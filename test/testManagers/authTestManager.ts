import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserInputModel } from '../../src/features/users/api/models/input/createUser.input.model';
import request from 'supertest';
import { LoginInputModel } from '../../src/features/auth/api/models/input/login.input.model';
import { authEndPoints } from '../../src/features/auth/api/models/auth.controller';
import { ConfirmationCodeInputModel } from '../../src/features/auth/api/models/input/confirmationCode.input.model';
import { RecoveryPasswordInputModel } from '../../src/features/auth/api/models/input/recoveryPassword.input.model';
import { NewPasswordInputModel } from '../../src/features/auth/api/models/input/newPassword.input.model';
import { UserViewModel } from '../../src/features/users/api/models/output/createdUser.output.model';
import { LoginOutputModel } from '../../src/features/auth/api/models/output/login.output.model';
import jwt from 'jsonwebtoken';
import { JwtUserType } from '../../src/features/users/api/models/types/jwtUserType';

export type UserViewTestType={
  userId: string,
  login: string,
  accessToken: string
}
export const userTestData = {
  email: 'user-1@example.com',
  login: 'user-1',
  password: 'password'
};
export const codeForTest = 'user-1@example.com_code for test';

export class AuthTestManager {
  constructor(protected app: INestApplication) {
  }

  async registrationTestUser(count: number = 1) {

    const usersData: UserViewTestType[] = [];
    for (let i = 0; count > i; i++) {

      const dataUser: UserInputModel = {
        email: `user-${1 + i}@example.com`,
        login: `user-${1 + i}`,
        password: 'password'
      };
      const code = `${dataUser.email}_code for test`;
      //Регистрируем пользователя
      await request(this.app.getHttpServer())
        .post(`/${authEndPoints.BASE}/${authEndPoints.REGISTRATION}`)
        .send(dataUser)
        .expect(HttpStatus.NO_CONTENT);
      //Подтверждаем почту
      await request(this.app.getHttpServer())
        .post(`/${authEndPoints.BASE}/${authEndPoints.REGISTRATION_CONFIRMATION}`)
        .send({ code })
        .expect(HttpStatus.NO_CONTENT);
      //Логинимся и получаем access token
      const resLogin = await request(this.app.getHttpServer())
        .post(`/${authEndPoints.BASE}/${authEndPoints.LOGIN}`)
        .send({
          loginOrEmail: dataUser.login,
          password: dataUser.password
        })
        .expect(HttpStatus.OK);

      const { accessToken } = resLogin.body as LoginOutputModel;
      const data = jwt.decode(accessToken) as JwtUserType;
      const user: { userId: string, login: string, accessToken: string } = {
        userId: data?.userId,
        login: dataUser.login,
        accessToken
      };
      usersData.push(user);
    }
    return usersData;

  }

  async registrationUser(data: UserInputModel, statusCode = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .post(`/${authEndPoints.BASE}/${authEndPoints.REGISTRATION}`)
      .send(data)
      .expect(statusCode);
    return res.body;
  }

  async confirmRegistration(code: ConfirmationCodeInputModel, statusCode = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .post(`/auth/registration-confirmation`)
      .send(code)
      .expect(statusCode);
    return res.body;
  }

  async login(data: LoginInputModel, statusCode = HttpStatus.OK) {
    const res = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .expect(statusCode);
    return res.body;
  }

  async recoveryPassword(email: RecoveryPasswordInputModel, statusCode = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .post(`/${authEndPoints.BASE}/${authEndPoints.RECOVERY_PASSWORD}`)
      .send(email)
      .expect(statusCode);
    return res.body;
  }

  async newPassword(data: NewPasswordInputModel, statusCode = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .post(`/${authEndPoints.BASE}/${authEndPoints.NEW_PASSWORD}`)
      .send(data)
      .expect(statusCode);
    return res.body;
  }
}
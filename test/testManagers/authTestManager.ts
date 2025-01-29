import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserInputModel } from '../../src/features/users/api/models/input/createUser.input.model';
import request from 'supertest';
import { testApp } from '../../test-setup';
import { LoginInputModel } from '../../src/features/auth/api/models/input/login.input.model';
import { authEndPoints } from '../../src/features/auth/api/models/auth.controller';
import { ConfirmationCodeInputModel } from '../../src/features/auth/api/models/input/confirmationCode.input.model';


export class AuthTestManager {
  constructor(protected app: INestApplication) {
  }

  async registrationTestUser( statusCode = HttpStatus.NO_CONTENT){
    const dto: UserInputModel = {
      email: 'test123@gmail.com',
      login: 'test',
      password: '123456'
    };
    const code = 'test123@gmail.com_code for test';

    await request(testApp.getHttpServer())
      .post(`/${authEndPoints.BASE}/${authEndPoints.REGISTRATION}`)
      .send(dto)
      .expect(statusCode);

     await request(testApp.getHttpServer(), )
      .post(`/auth/registration-confirmation`)
      .send({ code })
      .expect(statusCode);

  }

  async registrationUser(data: UserInputModel, statusCode = HttpStatus.NO_CONTENT) {
    const res = await request(testApp.getHttpServer())
      .post(`/${authEndPoints.BASE}/${authEndPoints.REGISTRATION}`)
      .send(data)
      .expect(statusCode);
    return res.body;
  }

  async confirmRegistration (code: ConfirmationCodeInputModel, statusCode = HttpStatus.NO_CONTENT) {
    console.log(code);
    const res = await request(testApp.getHttpServer(), )
      .post(`/auth/registration-confirmation`)
      .send(code)
      .expect(statusCode);
    return res.body;
  }

  async login(data: LoginInputModel, statusCode = HttpStatus.OK) {
    const res = await request(testApp.getHttpServer())
      .post('/auth/login')
      .send(data)
      .expect(statusCode);
    return res.body;
  }
}
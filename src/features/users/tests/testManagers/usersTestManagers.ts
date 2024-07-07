import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserInputModel } from '../../api/models/input/createUser.input.model';

export class UsersTestManagers  {
  constructor(protected app: INestApplication) {
  }
  async createUser(data: UserInputModel, statusCode=HttpStatus.CREATED) {

    const res = await request(this.app.getHttpServer())
      .post(`/users`)
      // .auth('admin', 'qwerty')
      .send(data)
      .expect(statusCode)

    return res.body
  }
};
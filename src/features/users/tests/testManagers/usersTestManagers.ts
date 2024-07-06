import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../../api/models/input/createUser.input.model';

export const UsersTestManagers = {
  async createUser(app: INestApplication, data: CreateUserDto, statusCode=HttpStatus.CREATED) {
    const res = await request(app.getHttpServer())
      .post(`/users`)
      // .auth('admin', 'qwerty')
      .send(data)
      .expect(statusCode)

    return res.body
  }
};
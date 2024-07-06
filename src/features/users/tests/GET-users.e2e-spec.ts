import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManagers } from './testManagers/usersTestManagers';
import { CreateUserDto } from '../api/models/input/createUser.input.model';
import { TestSetup } from '../../../../test-setup';

describe('AppController (e2e)', () => {
  let app: INestApplication
  let testSetup: TestSetup;

  beforeAll(async () => {
    testSetup = new TestSetup();
    app = await testSetup.init()
  });

  afterAll(async () => await testSetup.close());

  beforeEach(async () => await testSetup.clearDatabase());

  it('get all users', async () => {
    for (let i = 0; i < 5; i++) {
      const dto: CreateUserDto = {
        email: `email-test${i}@gmail.com`,
        login: `login${i}`,
        password: 'unbiliever13'
      };
      await UsersTestManagers.createUser(app, dto, HttpStatus.CREATED);
    }

    const res = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(res.body.items.length).toBe(5);
  });

});

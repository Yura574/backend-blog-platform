import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManagers } from './testManagers/usersTestManagers';
import { UserInputModel } from '../src/features/users/api/models/input/createUser.input.model';
import { testApp, initializeTestSetup, testSetup, closeTest, clearDatabase } from '../test-setup';

describe('AppController (e2e)', () => {

  let userTestManager: UsersTestManagers

  beforeAll(async () => {
    await initializeTestSetup();
    userTestManager = new UsersTestManagers(testApp)
  });

  afterAll(async () => await closeTest());

  beforeEach(async () => await clearDatabase());

  it('get all users', async () => {
    for (let i = 0; i < 5; i++) {
      const dto: UserInputModel = {
        email: `email-test${i}@gmail.com`,
        login: `login${i}`,
        password: 'unbiliever13'
      };
      await userTestManager.createUser(dto, HttpStatus.CREATED);

    }

    const res = await request(testApp.getHttpServer())
      .get('/users')
      .expect(200);

    expect(res.body.items.length).toBe(5);
  });

  it('registration user', async () => {

  });

});

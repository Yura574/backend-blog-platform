import { INestApplication } from '@nestjs/common';
import { clearDatabase, closeTest, initializeTestSetup, testApp, TestSetup } from '../../../../test-setup';
import { UsersTestManagers } from './testManagers/usersTestManagers';
import { UserInputModel } from '../api/models/input/createUser.input.model';


describe('POST users', () => {

  let userTestManager: UsersTestManagers;
  beforeAll(async () => {
    await initializeTestSetup();
    userTestManager = new UsersTestManagers(testApp);
  });

  afterAll(async () => await closeTest());

  beforeEach(async () => await clearDatabase());


  it('user should be create', async () => {
    const dto: UserInputModel = {
      email: `email-test@gmail.com`,
      login: `login`,
      password: 'unbiliever13'
    };

    const user = await userTestManager.createUser(dto);
    const getUser = await userTestManager.getUserById(user.id);
    console.log(getUser);
  });
});
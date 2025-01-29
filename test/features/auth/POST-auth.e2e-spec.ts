import { clearDatabase, closeTest, initializeTestSetup, testApp, TestSetup } from '../../../test-setup';
import { UsersTestManagers } from '../../testManagers/usersTestManagers';
import { UserInputModel } from '../../../src/features/users/api/models/input/createUser.input.model';
import request from 'supertest';
import { AuthTestManager, emailTest } from '../../testManagers/authTestManager';


describe('test for POST auth', () => {
  let userTestManager: UsersTestManagers;
  let authTestManager: AuthTestManager;
  beforeAll(async () => {
    await initializeTestSetup();
    userTestManager = new UsersTestManagers(testApp);
    authTestManager = new AuthTestManager(testApp);
    await authTestManager.registrationTestUser()
  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeTest();
  });

  it('registration user', async () => {
    const dto: UserInputModel = {
      email: 'yura5742248@gmail.com',
      login: 'yura',
      password: '123456'
    };
    const registr = await authTestManager.registrationUser(dto);
    console.log(registr);

    const code = 'yura5742248@gmail.com_code for test';

   await authTestManager.confirmRegistration({ code });

    const login = await authTestManager.login({
      loginOrEmail: dto.login,
      password: dto.password
    });
    console.log(login);
    expect(login.accessToken).toBeDefined();
  });
  it('login', async () => {

  });

  it('should send access token for login', async () => {
    await authTestManager.registrationTestUser()
    const login = await authTestManager.login({loginOrEmail: 'test', password: '123456'});
    expect(login.accessToken).toBeDefined();
  });
  it('recovery password', async () => {

    await authTestManager.registrationTestUser()
    await authTestManager.recoveryPassword({ email:emailTest })
  });

});
import { clearDatabase, closeTest, initializeTestSetup, testApp, TestSetup } from '../../../test-setup';
import { UsersTestManagers } from '../../testManagers/usersTestManagers';
import { UserInputModel } from '../../../src/features/users/api/models/input/createUser.input.model';
import request from 'supertest';
import { AuthTestManager, codeForTest, userTestData } from '../../testManagers/authTestManager';


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

  it('registration user & registration-confirmation ', async () => {
    const dto: UserInputModel = {
      email: 'yura5742248@gmail.com',
      login: 'yura',
      password: '123456'
    };
     await authTestManager.registrationUser(dto);


    const code = 'yura5742248@gmail.com_code for test';

   await authTestManager.confirmRegistration({ code });

    const login = await authTestManager.login({
      loginOrEmail: dto.login,
      password: dto.password
    });
    console.log(login);
    expect(login.accessToken).toBeDefined();
  });


  it('should send access token for login', async () => {
    await authTestManager.registrationTestUser()
    const login = await authTestManager.login({loginOrEmail: 'test', password: '123456'});
    expect(login.accessToken).toBeDefined();
  });
  it('recovery password and new password', async () => {

    await authTestManager.registrationTestUser()
    await authTestManager.recoveryPassword({ email:userTestData.email })

    await authTestManager.newPassword({newPassword:'654321', recoveryCode: codeForTest})
    const login =  await authTestManager.login({loginOrEmail: userTestData.email, password: '654321'})
    console.log(login);
    expect(login.accessToken).toBeDefined()
  });



  


});
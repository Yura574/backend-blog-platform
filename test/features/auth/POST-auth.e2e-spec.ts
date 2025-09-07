import {
  clearDatabase,
  closeTest,
  initializeTestSetup,
  testApp,
} from '../../../test-setup';
import { UsersTestManagers } from '../../testManagers/usersTestManagers';
import { UserInputModel } from '../../../src/features/users/api/models/input/createUser.input.model';
import {
  AuthTestManager,
  codeForTest,
  userTestData,
} from '../../testManagers/authTestManager';
import { HttpStatus } from '@nestjs/common';

describe('test for POST auth', () => {
  let userTestManager: UsersTestManagers;
  let authTestManager: AuthTestManager;
  let user;
  beforeAll(async () => {
    await initializeTestSetup();
    userTestManager = new UsersTestManagers(testApp);
    authTestManager = new AuthTestManager(testApp);
    await authTestManager.registrationTestUser();
  });
  beforeEach(async () => {
    await clearDatabase();
    user = await userTestManager.createUser({
      login: 'yura',
      password: '12345678',
      email: 'yura5742248@gmail.com',
    });
  });

  afterAll(async () => {
    await closeTest();
  });

  it('registration user & registration-confirmation ', async () => {
    const dto: UserInputModel = {
      email: 'yura5742248@gmail.com',
      login: 'yura',
      password: '123456',
    };
    await authTestManager.registrationUser(dto);

    const code = 'yura5742248@gmail.com_code for test';

    await authTestManager.confirmRegistration({ code });

    const login = await authTestManager.login({
      loginOrEmail: dto.login,
      password: dto.password,
    });
    expect(login.result.accessToken).toBeDefined();
  });

  it('should send access token for login', async () => {
    await authTestManager.registrationTestUser();
    const login = await authTestManager.login({
      loginOrEmail: userTestData.login,
      password: userTestData.password,
    });
    expect(login.result.accessToken).toBeDefined();
  });
  it('shouldn`t login', async () => {
    await authTestManager.registrationTestUser();
    await authTestManager.login(
      { loginOrEmail: '', password: '  ' },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('recovery password and new password', async () => {
    await authTestManager.registrationTestUser();
    await authTestManager.recoveryPassword({ email: userTestData.email });

    await authTestManager.newPassword({
      newPassword: '654321',
      recoveryCode: codeForTest,
    });
    const login = await authTestManager.login({
      loginOrEmail: userTestData.email,
      password: '654321',
    });
    expect(login.result.accessToken).toBeDefined();
  });

  it('should return new pair tokens', async () => {
    const user = await authTestManager.registrationTestUser(1);
    const login = await authTestManager.login({
      loginOrEmail: userTestData.login,
      password: userTestData.password,
    });
    const newToken = await authTestManager.refreshToken(login.refreshToken);
    expect(login.result.accessToken).toBeDefined();
    expect(newToken.accessToken).toBeDefined();
    expect(login.result.accessToken).not.toEqual(newToken.accessToken);
  });

  it('should return error if refresh token invalid', async () => {
    await authTestManager.registrationTestUser(1);
    const login = await authTestManager.login({
      loginOrEmail: userTestData.login,
      password: userTestData.password,
    });

    await authTestManager.logout
    const newToken = await authTestManager.refreshToken(
      login.refreshToken,
      HttpStatus.UNAUTHORIZED,
    );
    console.log(newToken);
  });
});

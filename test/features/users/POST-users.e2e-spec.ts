import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { UsersTestManagers } from '../../testManagers/usersTestManagers';
import { UserInputModel } from '../../../src/features/users/api/models/input/createUser.input.model';
import { UserViewModel } from '../../../src/features/users/api/models/output/createdUser.output.model';



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
      login: `login2`,
      password: 'unbiliever13'
    };

    const user = await userTestManager.createUser(dto);
    const getUser:UserViewModel = await userTestManager.getUserById(user.id);
    expect(getUser.login).toBe('login2')
  });
});
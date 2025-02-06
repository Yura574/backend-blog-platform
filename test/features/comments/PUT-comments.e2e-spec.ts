import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { AuthTestManager } from '../../testManagers/authTestManager';


describe('test for PUT posts', () => {
  let postsTestManagers: PostsTestManagers;
  let authTestManagers: AuthTestManager;
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    authTestManagers = new AuthTestManager(testApp);

  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeTest();
  });


});
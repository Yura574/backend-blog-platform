import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';


describe('test for DELETE posts', () => {
  let postsTestManagers: PostsTestManagers;
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);

  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeTest();
  });

it('should be delete post', async ()=> {
  await postsTestManagers.deletePost('507f1f77bcf86cd799439011', HttpStatus.NOT_FOUND )
  })
});
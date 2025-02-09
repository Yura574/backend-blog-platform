import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';


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
  const post:PostViewModel[] = await postsTestManagers.createTestPost()

  // await postsTestManagers.deletePost(post.id,HttpStatus.UNAUTHORIZED, 'qwerty', 'pass')

  await postsTestManagers.deletePost(post[0].id + 'a', HttpStatus.NOT_FOUND )

  // await postsTestManagers.deletePost(post.id)


})
});
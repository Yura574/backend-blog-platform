import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { AuthTestManager, UserViewTestType } from '../../testManagers/authTestManager';
import { CommentTestManagers } from '../../testManagers/commentTestManagers';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { CommentOutputModel } from '../../../src/features/comments/api/output/comment.output.model';
import { HttpStatus } from '@nestjs/common';

describe('test for DELETE posts', () => {
  let postsTestManagers: PostsTestManagers;
  let authTestManagers: AuthTestManager;
  let commentTestManagers: CommentTestManagers
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    authTestManagers = new AuthTestManager(testApp);
    commentTestManagers= new CommentTestManagers(testApp)
  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeTest();
  });

  it('should delete comment', async () => {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser(2)
    const post: PostViewModel[] = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel = await commentTestManagers.createTestComments(post[0].id, user[0].accessToken)
    await commentTestManagers.deleteCommentById(comment.id, user[0].accessToken)
    await commentTestManagers.deleteCommentById(comment.id, user[0].accessToken, HttpStatus.NOT_FOUND)
  });


  it('shouldn`t delete comment, invalid id', async () => {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser(2)
    await commentTestManagers.deleteCommentById('comment.id', user[0].accessToken, HttpStatus.NOT_FOUND)
  });
  it('shouldn`t delete comment, not authorization', async () => {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser(2)
    const post: PostViewModel[] = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel = await commentTestManagers.createTestComments(post[0].id, user[0].accessToken)

    await commentTestManagers.deleteCommentById(comment.id, '', HttpStatus.UNAUTHORIZED)
  });


  it('shouldn`t delete comment, try delete someone else`s comment ', async () => {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser(2)
    const post: PostViewModel[] = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel = await commentTestManagers.createTestComments(post[0].id, user[0].accessToken)
    await commentTestManagers.deleteCommentById(comment.id, user[1].accessToken, HttpStatus.FORBIDDEN)
  });


});
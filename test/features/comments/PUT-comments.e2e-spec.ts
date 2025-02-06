import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { AuthTestManager, UserViewTestType } from '../../testManagers/authTestManager';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { CommentOutputModel } from '../../../src/features/comments/api/output/comment.output.model';
import { CommentTestManagers } from '../../testManagers/commentTestManagers';
import { HttpStatus } from '@nestjs/common';


describe('test for PUT comments', () => {
  let postsTestManagers: PostsTestManagers;
  let authTestManagers: AuthTestManager;
  let commentTestManagers: CommentTestManagers
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    authTestManagers = new AuthTestManager(testApp);
    commentTestManagers = new CommentTestManagers(testApp)

  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeTest();
  });

  it('should be update content comment', async ()=> {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser()
    const post: PostViewModel = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel = await commentTestManagers.createTestComments(post.id, user[0].accessToken)
    const newContent = 'new content for comment'
    await commentTestManagers.updateCommentById(comment.id, newContent, user[0].accessToken)

    const updatedComment: CommentOutputModel = await commentTestManagers.getCommentById(comment.id)
    expect(updatedComment.content).toBe(newContent)
  })

  it('shouldn`t be update content comment, invalid content', async ()=> {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser()
    const post: PostViewModel = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel = await commentTestManagers.createTestComments(post.id, user[0].accessToken)
    const newContent = 'new content'
   const res = await commentTestManagers.updateCommentById(comment.id, newContent, user[0].accessToken, HttpStatus.BAD_REQUEST)

    expect(res).toStrictEqual({
      errorsMessages: [
        {
          message: "content length should be  min 20, max 300 symbols",
          field: 'content'
        },
      ]
    })
  })

  it('shouldn`t be update content comment, invalid id', async ()=> {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser()
    const newContent = 'new content for comment'
    await commentTestManagers.updateCommentById('comment.id', newContent, user[0].accessToken, HttpStatus.NOT_FOUND)

  })

  it('shouldn`t be update content comment,not authorization', async ()=> {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser()
    const post: PostViewModel = await postsTestManagers.createTestPost()
   const comment =  await commentTestManagers.createTestComments(post.id, user[0].accessToken)
    const newContent = 'new content for comment'
    await commentTestManagers.updateCommentById(comment.id, newContent, 'user[0].accessToken', HttpStatus.UNAUTHORIZED)

  })

  it('shouldn`t be update content comment,try to update someone else`s comment', async ()=> {
    const user: UserViewTestType[] = await authTestManagers.registrationTestUser(2)
    const post: PostViewModel = await postsTestManagers.createTestPost()
    const comment = await commentTestManagers.createTestComments(post.id, user[0].accessToken)
    const newContent = 'new content for comment'
    await commentTestManagers.updateCommentById(comment.id, newContent, user[1].accessToken, HttpStatus.FORBIDDEN)

  })

});
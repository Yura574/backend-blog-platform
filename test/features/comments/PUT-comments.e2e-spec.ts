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

  it('should be update like status for comment', async ()=> {
    const users = await authTestManagers.registrationTestUser()
    const post  = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel =await commentTestManagers.createTestComments(post.id, users[0].accessToken)
    await commentTestManagers.updateLikeStatus(comment.id, users[0].accessToken,  'Like')
    const res: CommentOutputModel = await commentTestManagers.getCommentById(comment.id, users[0].accessToken)
    expect(res.likesInfo.likesCount).toBe(1)
    expect(res.likesInfo.dislikesCount).toBe(0)
    expect(res.likesInfo.myStatus).toBe('Like')
  })

  it('should be update like status for comment, with different user', async ()=> {
    const users = await authTestManagers.registrationTestUser(5)
    const post  = await postsTestManagers.createTestPost()
    const comment: CommentOutputModel =await commentTestManagers.createTestComments(post.id, users[0].accessToken)

    await commentTestManagers.updateLikeStatus(comment.id, users[0].accessToken,  'Like')
    await commentTestManagers.updateLikeStatus(comment.id, users[1].accessToken,  'Dislike')
    await commentTestManagers.updateLikeStatus(comment.id, users[2].accessToken,  'Like')
    await commentTestManagers.updateLikeStatus(comment.id, users[3].accessToken,  'Like')
    await commentTestManagers.updateLikeStatus(comment.id, users[4].accessToken,  'Dislike')

    const res1: CommentOutputModel = await commentTestManagers.getCommentById(comment.id, users[0].accessToken)
    expect(res1.likesInfo.likesCount).toBe(3)
    expect(res1.likesInfo.dislikesCount).toBe(2)
    expect(res1.likesInfo.myStatus).toBe('Like')


    const res2: CommentOutputModel = await commentTestManagers.getCommentById(comment.id, users[4].accessToken)
    expect(res2.likesInfo.likesCount).toBe(3)
    expect(res2.likesInfo.dislikesCount).toBe(2)
    expect(res2.likesInfo.myStatus).toBe('Dislike')

    await commentTestManagers.updateLikeStatus(comment.id, users[0].accessToken,  'None')
    const res3: CommentOutputModel = await commentTestManagers.getCommentById(comment.id, users[0].accessToken)

    expect(res3.likesInfo.likesCount).toBe(2)
    expect(res3.likesInfo.dislikesCount).toBe(2)
    expect(res3.likesInfo.myStatus).toBe('None')
  })

  it('shouldn`t ve update like status, not authorization', async ()=> {
    const users = await authTestManagers.registrationTestUser()
    const post = await postsTestManagers.createTestPost()
    const comment = await commentTestManagers.createTestComments(post.id, users[0].accessToken)
    await commentTestManagers.updateLikeStatus(comment.id, 'token','Like', HttpStatus.UNAUTHORIZED)
  })


  it('shouldn`t ve update like status, not found comment', async ()=> {
    const users = await authTestManagers.registrationTestUser()
    const post = await postsTestManagers.createTestPost()
    await commentTestManagers.updateLikeStatus('comment.id', users[0].accessToken,'Like', HttpStatus.NOT_FOUND)
  })



});
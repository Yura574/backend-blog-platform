import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { CommentOutputModel } from '../../../src/features/comments/api/output/comment.output.model';
import { CommentTestManagers } from '../../testManagers/commentTestManagers';
import { AuthTestManager, UserViewTestType } from '../../testManagers/authTestManager';


describe('test for GET posts', () => {
  let postsTestManagers: PostsTestManagers;
  let commentsTestManagers: CommentTestManagers;
  let authTestManagers: AuthTestManager;
  let user: UserViewTestType[];
  let post: PostViewModel;
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    commentsTestManagers = new CommentTestManagers(testApp);
    authTestManagers = new AuthTestManager(testApp);
    user = await authTestManagers.registrationTestUser();
    post = await postsTestManagers.createTestPost();

  });
  beforeEach(async () => {
    await clearDatabase();
    user = await authTestManagers.registrationTestUser();
    post = await postsTestManagers.createTestPost();
  });

  afterAll(async () => {
    await closeTest();
  });

  it('should get comment by id', async ()=> {
    const comment: CommentOutputModel = await commentsTestManagers.createTestComments(post.id, user[0].accessToken)
    const res:CommentOutputModel  = await commentsTestManagers.getCommentById(comment.id)
    expect(res).toEqual({
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
       userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      createdAt: expect.any(String),
      likesInfo: {
       likesCount:0 ,
        dislikesCount:0 ,
        myStatus: 'None'
      }
    })

  })

  it('shouldn`t get comment by id, invalid id', async ()=> {
   await commentsTestManagers.getCommentById('comment.id', '',HttpStatus.NOT_FOUND)
  })

});

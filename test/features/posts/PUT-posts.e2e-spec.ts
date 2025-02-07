import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';
import { UpdatePostInputModel } from '../../../src/features/posts/api/model/input/updatePost.input.model';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { AuthTestManager } from '../../testManagers/authTestManager';
import e from 'express';


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

  it('should be update post', async () => {
    const post: PostViewModel = await postsTestManagers.createTestPost();
    const updateData: UpdatePostInputModel = {
      title: 'new post',
      content: 'new',
      shortDescription: 'newline short'
    };

    await postsTestManagers.updatePost(post.id, updateData);
    const getPost = await postsTestManagers.getPostById(post.id);
    expect(getPost).toEqual({
      id: post.id,
      title: updateData.title,
      shortDescription: updateData.shortDescription,
      content: updateData.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0, dislikesCount: 0, myStatus: 'None',
        newestLikes: expect.any(Array)
      }
    });
  });

  it('shouldn`t be update post, incorrect id', async () => {
    const post: PostViewModel = await postsTestManagers.createTestPost();
    const updateData: UpdatePostInputModel = {
      title: 'new post',
      content: 'new',
      shortDescription: 'newline short'
    };

    await postsTestManagers.updatePost('post.id', updateData, HttpStatus.NOT_FOUND);

  });

  it('shouldn`t update post auth incorrect', async () => {
    const post: PostViewModel = await postsTestManagers.createTestPost();
    const updateData: UpdatePostInputModel = {
      title: '123',
      content: 'no cont',
      shortDescription: 'qwerty'
    };

    await postsTestManagers.updatePost(post.id, updateData, HttpStatus.UNAUTHORIZED, 'qwe', 'password');
  });

  it('shouldn`t update post wrong data', async () => {
    const post: PostViewModel = await postsTestManagers.createTestPost();
    const updateData = {
      title: ' ',
      content: true,
      shortDescription: ''
    };

    const res = await postsTestManagers.updatePost(post.id, updateData, HttpStatus.BAD_REQUEST);
    expect(res).toEqual({
      errorsMessages: [
        {
          message: 'title length should be  min 1, max 15 symbols',
          field: 'title'
        },
        {
          message: 'shortDescription length should be  min 1, max 100 symbols',
          field: 'shortDescription'
        },
        {
          message: 'content length should be  min 1, max 1000 symbols',
          field: 'content'
        }
      ]
    });

  });

  it('should be like status for post', async () => {
    const users = await authTestManagers.registrationTestUser(5);

    const post: PostViewModel = await postsTestManagers.createTestPost();
    //user-1 поставил лайк
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'Like' );
    //
    // // //user-2 поставил дизлайк
    await postsTestManagers.updateLikeStatusPost(users[1].accessToken, post.id,  'Like' );
    // //
    await postsTestManagers.updateLikeStatusPost(users[2].accessToken, post.id,  'Dislike' );
    //

    const postUser1: PostViewModel = await postsTestManagers.getPostById(post.id, users[0].accessToken);
    const postUser2: PostViewModel = await postsTestManagers.getPostById(post.id, users[1].accessToken);
    const postUser3: PostViewModel = await postsTestManagers.getPostById(post.id, users[2].accessToken);
    const postUser4: PostViewModel = await postsTestManagers.getPostById(post.id, users[3].accessToken);
    const postNoUser: PostViewModel = await postsTestManagers.getPostById(post.id);
    // //
    expect(postUser1.extendedLikesInfo.likesCount).toBe(2);
    expect(postUser1.extendedLikesInfo.dislikesCount).toBe(1);
    expect(postUser1.extendedLikesInfo.myStatus).toBe('Like');
    expect(postUser3.extendedLikesInfo.myStatus).toBe('Dislike');
    expect(postUser4.extendedLikesInfo.myStatus).toBe('None');
    expect(postNoUser.extendedLikesInfo.myStatus).toBe('None');

    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'None' );
    const postUser1_1: PostViewModel = await postsTestManagers.getPostById(post.id, users[0].accessToken);
    expect(postUser1_1.extendedLikesInfo.likesCount).toBe(1);
    expect(postUser1_1.extendedLikesInfo.dislikesCount).toBe(1);
    expect(postUser1_1.extendedLikesInfo.myStatus).toBe('None');


  });

  it('shouldn`t add like twice one user ', async ()=> {
    const users = await authTestManagers.registrationTestUser(5)
    const post = await postsTestManagers.createTestPost()
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'Like')
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'Like')
const res = await postsTestManagers.getPostById(post.id, users[0].accessToken)
    console.log(res);
  })
  it('shouldn`t add like twice one user test ', async ()=> {
    const users = await authTestManagers.registrationTestUser(5)
    const post = await postsTestManagers.createTestPost()
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'Like')
    const resPost1: PostViewModel = await postsTestManagers.getPostById(post.id, users[0].accessToken)
    expect(resPost1.extendedLikesInfo.myStatus).toBe('Like')
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'Dislike')
    const resPost2: PostViewModel = await postsTestManagers.getPostById(post.id, users[0].accessToken)
    expect(resPost2.extendedLikesInfo.myStatus).toBe('Dislike')
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id, 'None')
    const resPost3: PostViewModel = await postsTestManagers.getPostById(post.id, users[0].accessToken)
    expect(resPost3.extendedLikesInfo.myStatus).toBe('None')

  })

  it('should get 3 last users like post', async () => {
    const users = await authTestManagers.registrationTestUser(5);

    const post: PostViewModel = await postsTestManagers.createTestPost();
    //user-1 поставил лайк
    await postsTestManagers.updateLikeStatusPost(users[0].accessToken, post.id,  'Like' );

    // //user-2 поставил дизлайк
    await postsTestManagers.updateLikeStatusPost(users[1].accessToken, post.id,  'Like' );
    //
    await postsTestManagers.updateLikeStatusPost(users[2].accessToken, post.id,  'Like' );
    await postsTestManagers.updateLikeStatusPost(users[3].accessToken, post.id,  'Like' );
    await postsTestManagers.updateLikeStatusPost(users[4].accessToken, post.id,  'Like' );


    const postUser1: PostViewModel = await postsTestManagers.getPostById(post.id, users[0].accessToken);


    expect(postUser1.extendedLikesInfo.likesCount).toBe(5);
    expect(postUser1.extendedLikesInfo.dislikesCount).toBe(0);
    expect(postUser1.extendedLikesInfo.myStatus).toBe('Like');
    expect(postUser1.extendedLikesInfo.newestLikes.length).toBe(3);
    expect(postUser1.extendedLikesInfo.newestLikes).toEqual([
      {
        addedAt: expect.any(String),
        userId: users[4].userId,
        login: users[4].login
      },
      {
        addedAt: expect.any(String),
        userId: users[3].userId,
        login: users[3].login
      },
      {
        addedAt: expect.any(String),
        userId: users[2].userId,
        login: users[2].login
      }
    ]);
  });

  it('shouldn`t be like status for post, invalid status', async () => {
    const user = await authTestManagers.registrationTestUser();

    const post = await postsTestManagers.createTestPost();

    const res1 = await postsTestManagers.updateLikeStatusPost(user[0].accessToken, post.id, 'Lik', HttpStatus.BAD_REQUEST);

    expect(res1).toEqual({
      errorsMessages: [
        {
          message: 'Invalid status',
          field: 'likeStatus'
        }
      ]
    });
  })
  it('shouldn`t be like status for post, post not found', async () => {
    const user = await authTestManagers.registrationTestUser();
    await postsTestManagers.updateLikeStatusPost(user[0].accessToken, '63189b06003380064c4193be', 'Like' , HttpStatus.NOT_FOUND);
  })
  it('shouldn`t be like status for post,unauthorized', async () => {
    const post = await postsTestManagers.createTestPost();

     await postsTestManagers.updateLikeStatusPost('user[0].accessToken', post.id, 'Like', HttpStatus.UNAUTHORIZED);


  });

});
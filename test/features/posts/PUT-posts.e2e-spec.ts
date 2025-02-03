import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';
import { UpdatePostInputModel } from '../../../src/features/posts/api/model/input/updatePost.input.model';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';


describe('test for PUT posts', () => {
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

  it('should be like status for post', async ()=> {
    const post: PostViewModel = await postsTestManagers.createTestPost()
    await postsTestManagers.updateLikeStatusPost(post.id, 'Like')

    const updatedPost: PostViewModel = await postsTestManagers.getPostById(post.id)
    // expect(updatedPost.extendedLikesInfo.myStatus).toBe('Like')
  })

});
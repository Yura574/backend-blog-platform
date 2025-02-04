import { BlogsTestManagers } from '../../testManagers/blogsTestManagers';
import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { ReturnViewModel } from '../../../src/features/1_commonTypes/returnViewModel';


describe('test for GET posts', () => {
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

  it('should get all posts', async () => {
    await postsTestManagers.createTestPost(12);
    const posts: ReturnViewModel<PostViewModel[]> = await postsTestManagers.getAllPosts({});
    expect(posts).toStrictEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 12,
      items: expect.any(Array)
    });
    expect(posts.items?.length).toBe(10);
    expect(posts.items?.[0]?.title).toBe('title 11');
  });
  it('should get posts with query', async () => {
    await postsTestManagers.createTestPost(12);
    const posts: ReturnViewModel<PostViewModel[]> = await postsTestManagers.getAllPosts(
      {
        pageNumber: 3,
        pageSize: 2,
        sortDirection: 'desc'
      });
    expect(posts).toStrictEqual({
      pagesCount: 6,
      page: 3,
      pageSize: 2,
      totalCount: 12,
      items: expect.any(Array)
    });
    expect(posts.items?.length).toBe(2);
    expect(posts.items?.[0]?.title).toBe('title 7');
  });

  it('should get post by id', async () => {
    const post: PostViewModel = await postsTestManagers.createTestPost();

    const createdPost = await postsTestManagers.getPostById(post.id);

    expect(createdPost).toEqual({
        id: expect.any(String),
        title: 'title',
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: expect.any(Array)
        }
      }
    );

  });

  it('shouldn`t get post by id', async () => {
    const post: PostViewModel = await postsTestManagers.createTestPost();

    await postsTestManagers.getPostById('post.id','', HttpStatus.NOT_FOUND);


  });


});

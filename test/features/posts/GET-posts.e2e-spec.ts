import { BlogsTestManagers } from '../../testManagers/blogsTestManagers';
import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { BlogViewModel } from '../../../src/features/blogs/api/model/output/createdBlog.output.model';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { CreatePostInputModel } from '../../../src/features/posts/api/model/input/createPost.input.model';
import { HttpStatus } from '@nestjs/common';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { ReturnViewModel } from '../../../src/features/1_commonTypes/returnViewModel';


describe('test for GET posts', () => {
  let postsTestManagers: PostsTestManagers;
  let blogsTestManagers: BlogsTestManagers;
  // let blog: BlogViewModel;
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    blogsTestManagers = new BlogsTestManagers(testApp);

    // blog = await blogsTestManagers.createTestBlog();
  });
  beforeEach(async () => {
    await clearDatabase();
    // blog = await blogsTestManagers.createTestBlog();
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
    })
    expect(posts.items?.length).toBe(10)
    expect(posts.items?.[0]?.title).toBe('title 11')
  });
  it('should get posts with query', async () => {
    await postsTestManagers.createTestPost(12);
    const posts: ReturnViewModel<PostViewModel[]> = await postsTestManagers.getAllPosts(
      {
        pageNumber: 3,
        pageSize: 2,
        sortDirection: 'desc',
      });
    expect(posts).toStrictEqual({
      pagesCount: 6,
      page: 3,
      pageSize: 2,
      totalCount: 12,
      items: expect.any(Array)
    })
    console.log( posts);
    expect(posts.items?.length).toBe(2)
    expect(posts.items?.[0]?.title).toBe('title 7')
  });

});
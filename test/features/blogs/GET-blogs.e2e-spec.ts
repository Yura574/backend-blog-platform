import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { BlogsTestManagers } from '../../testManagers/blogsTestManagers';
import { CreateBlogInputModel } from '../../../src/features/blogs/api/model/input/createBlog.input.model';
import { HttpStatus } from '@nestjs/common';


describe('test for GET blogs', () => {
  let blogsTestManagers: BlogsTestManagers;
  beforeAll(async () => {
    await initializeTestSetup();
    blogsTestManagers = new BlogsTestManagers(testApp);
  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeTest();
  });

  it('should create 5 blogs', async () => {

    await blogsTestManagers.createBlogs(5);
    const blogs = await blogsTestManagers.getAllBlogs();
    expect(blogs.items.length).toBe(5);
    expect(blogs.items[0].name).toBe('blog 0');
  });

  it('get all blogs', async () => {

    await blogsTestManagers.createBlogs(11);
    const blogs = await blogsTestManagers.getAllBlogs({ pageSize: 3, pageNumber: 2, sortDirection: 'asc' });
    expect(blogs.items.length).toBe(3);
    expect(blogs.items[0].name).toBe('blog 7');
    const blogs1 = await blogsTestManagers.getAllBlogs({ searchNameTerm: '0', sortDirection: 'asc' });
    expect(blogs1.items.length).toBe(2);
    expect(blogs1.items[0].name).toBe('blog 10');
  });

  it('get blog by id', async () => {

    const blog1: CreateBlogInputModel = {
      name: 'blog1',
      websiteUrl: 'https://example.com',
      description: `description for blog`
    };
    const blog2: CreateBlogInputModel = {
      name: 'blog2',
      websiteUrl: 'https://example.com',
      description: `description for blog`
    };
    const blog3: CreateBlogInputModel = {
      name: 'blog3',
      websiteUrl: 'https://example.com',
      description: `description for blog`
    };
    const newBlog1 = await blogsTestManagers.createBlog(blog1);
    const newBlog2 = await blogsTestManagers.createBlog(blog2);
    const newBlog3 = await blogsTestManagers.createBlog(blog3);

    const res = await blogsTestManagers.getBlogById(newBlog2.id);
    expect(res).toEqual({
      id: expect.any(String),
      name: 'blog2',
      description: `description for blog`,
      websiteUrl: 'https://example.com',
      createdAt: expect.any(String),
      isMembership: false
    });
  });

  it('get all posts by blog Id', async () => {

    const blog = await blogsTestManagers.createTestBlog();
    await blogsTestManagers.createPosts(blog.id, 11);
    const res = await blogsTestManagers.getAllPostsForBlog(blog.id, '', { pageSize: 3, pageNumber: 2 });
    expect(res).toStrictEqual({
      pagesCount: 4,
      page: 2,
      pageSize: 3,
      totalCount: 11,
      items: expect.any(Array)
    });

    expect(res.items[1]).toStrictEqual({
      id: expect.any(String),
      title: 'post title 4',
      shortDescription: 'short description for post 4',
      content: 'post content',
      blogId: blog.id,
      blogName: blog.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: res.items[1].extendedLikesInfo.newestLikes.length === 0
          ? expect.arrayContaining([])
          : expect.arrayContaining([
            expect.objectContaining({
              addedAt: expect.any(String),
              login: expect.any(String),
              userId: expect.any(String)
            })
          ])

      }
    });
  });

  it('shouldn`t get posts, blogId not found', async () => {
    const blog = await blogsTestManagers.createTestBlog();
    const posts = await blogsTestManagers.createPosts(blog.id, 6);
    await blogsTestManagers.getAllPostsForBlog('blog.id', '', {}, HttpStatus.NOT_FOUND);


  });


});
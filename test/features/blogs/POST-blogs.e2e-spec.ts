import { BlogsTestManagers, createPostTestData } from '../../testManagers/blogsTestManagers';
import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';

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

  it('create new blog', async () => {
    const newBlog = {
      name: `1212 `,
      websiteUrl: 'https://example.com',
      description: `description for blog`
    };
    const res = await blogsTestManagers.createBlog(newBlog);
    expect(res.name).toBe('1212');
    expect(res).toEqual({
      id: expect.any(String),
      name: '1212',
      description: `description for blog`,
      websiteUrl: 'https://example.com',
      createdAt: expect.any(String),
      isMembership: false
    });
  });

  it('create post for blogs', async () => {
    const blog = await blogsTestManagers.createTestBlog();
    const res = await blogsTestManagers.createPost(blog.id, createPostTestData);
    expect(res).toEqual({
        id: expect.any(String),
        title: createPostTestData.title,
        shortDescription: createPostTestData.shortDescription,
        content: createPostTestData.content,
        blogId: expect.any(String),
        blogName: blog.name,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: res.extendedLikesInfo.newestLikes.length === 0
            ? expect.arrayContaining([])
            : expect.arrayContaining([
              expect.objectContaining({
                addedAt: expect.any(String),
                login: expect.any(String),
                userId: expect.any(String)
              })
            ])
        }
      }
    );
  });

  it('post shouldn`t be create', async ()=> {
    const blog = await blogsTestManagers.createTestBlog();
    const newPost = {

    }
    const res = await blogsTestManagers.createPost(blog.id, newPost, 400);
    expect(res).toStrictEqual({
      errorsMessages: [
        {
          message: 'title must be longer than or equal to 1 characters',
          field: 'title'
        },
        {
          message: 'shortDescription must be longer than or equal to 1 characters',
          field: 'shortDescription'
        },
        {
          message: 'content must be longer than or equal to 1 characters',
          field: 'content'
        }
      ]
    })
  })
});
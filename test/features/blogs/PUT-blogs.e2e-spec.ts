import { BlogsTestManagers } from '../../testManagers/blogsTestManagers';
import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { CreateBlogInputModel } from '../../../src/features/blogs/api/model/input/createBlog.input.model';
import { UpdateBlogInputModel } from '../../../src/features/blogs/api/model/input/updateBlog.input.model';


describe('test for PUT blogs', () => {
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


  it('should be update blog', async ()=> {
    const blog = await blogsTestManagers.createTestBlog()
    const data: UpdateBlogInputModel = {
      name: 'new name',
      websiteUrl: blog.websiteUrl,
      description: 'new description'
    }
    await blogsTestManagers.updateBlogById(blog.id, data)
    const res = await blogsTestManagers.getBlogById(blog.id)
    expect(res).toEqual({
      id: blog.id,
      name: data.name,
      description: data.description,
      websiteUrl: data.websiteUrl,
      createdAt:expect.any(String),
      isMembership: false
   })
  })
  it('shouldn`t be update blog', async ()=> {
    const blog = await blogsTestManagers.createTestBlog()
    const data = {
      name: ' ',
      websiteUrl: true,
      description: false
    }
   const res= await blogsTestManagers.updateBlogById(blog.id, data, 400)
    expect(res).toEqual({
      errorsMessages: [
        {
          message: "length should be min 1, max 15",
          field: "name"
        },
        {
          message: "length should be min 1, max 500",
          field: "description"
        },
        {
          message: "Invalid websiteUrl format, should be https://example.com",
          field: "websiteUrl"
        },
      ]
    })
  })


});
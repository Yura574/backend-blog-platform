import { BlogsTestManagers } from '../../testManagers/blogsTestManagers';
import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { BlogViewModel } from '../../../src/features/blogs/api/model/output/createdBlog.output.model';
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


  it('should be deleted blog', async ()=> {
const blog: BlogViewModel = await blogsTestManagers.createTestBlog()
    const isGetBlog = await blogsTestManagers.getBlogById(blog.id)
    expect(isGetBlog).toBeDefined()

     await blogsTestManagers.deleteBlogById({blogId: blog.id, login: 'as', status: HttpStatus.UNAUTHORIZED})
     await blogsTestManagers.deleteBlogById({blogId: blog.id})
     await blogsTestManagers.getBlogById(blog.id,  HttpStatus.NOT_FOUND)


  })
})
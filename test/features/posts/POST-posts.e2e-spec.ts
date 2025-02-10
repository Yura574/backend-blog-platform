import { BlogsTestManagers } from '../../testManagers/blogsTestManagers';
import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { BlogViewModel } from '../../../src/features/blogs/api/model/output/createdBlog.output.model';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { CreatePostInputModel } from '../../../src/features/posts/api/model/input/createPost.input.model';
import { HttpStatus } from '@nestjs/common';
import { CommentTestManagers, contentTestComment } from '../../testManagers/commentTestManagers';
import { AuthTestManager } from '../../testManagers/authTestManager';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';


describe('test for POST posts', () => {
  let postsTestManagers: PostsTestManagers;
  let blogsTestManagers: BlogsTestManagers;
  let commentsTestManagers: CommentTestManagers;
  let authTestManagers: AuthTestManager;
  let blog: BlogViewModel;
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    blogsTestManagers = new BlogsTestManagers(testApp);
    commentsTestManagers = new CommentTestManagers(testApp);
    authTestManagers = new AuthTestManager(testApp);

    blog = await blogsTestManagers.createTestBlog();
  });
  beforeEach(async () => {
    await clearDatabase();
    blog = await blogsTestManagers.createTestBlog();
  });

  afterAll(async () => {
    await closeTest();
  });
  it('should ba create new post', async () => {
    const postData: CreatePostInputModel = {
      title: 'new post',
      content: 'content',
      shortDescription: 'shortDescription',
      blogId: blog.id
    };
    const res = await postsTestManagers.createPost({ data: postData });
    expect(res).toStrictEqual({
      id: expect.any(String),
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    });
  });
  it('shouldn`t be crate new post', async () => {
    const wrongDataPost1: CreatePostInputModel = {
      title: '',
      content: '',
      blogId: blog.id,
      shortDescription: ''
    };
    const res1 = await postsTestManagers.createPost({ data: wrongDataPost1, status: HttpStatus.BAD_REQUEST });
    expect(res1).toEqual({
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
  it('shouldn`t be crate new post, no content', async () => {
    const wrongDataPost2 = {
      title: 'asas',
      blogId: 'blog.id',
      shortDescription: '2355'
    };
    const res2 = await postsTestManagers.createPost({ data: wrongDataPost2, status: HttpStatus.BAD_REQUEST });
    expect(res2).toEqual({
      errorsMessages: [
        {
          message: 'content length should be  min 1, max 1000 symbols',
          field: 'content'
        } ,
        {
          message: 'Invalid id',
          field: 'blogId'
        }
      ]
    });
  });

  it('shouldn`t be crate new post, no content2', async () => {
    const wrongDataPost2 = {
      title:"valid",
      content:"valid",
      blogId:"63189b06003380064c4193b",
      shortDescription:"length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
    };
    const res2 = await postsTestManagers.createPost({ data: wrongDataPost2, status: HttpStatus.BAD_REQUEST });
    expect(res2).toEqual({
      errorsMessages: [
        {
          message: 'shortDescription length should be  min 1, max 100 symbols',
          field: 'shortDescription'
        } ,
        {
          message: 'Invalid id',
          field: 'blogId'
        }
      ]
    });
  });
  it('shouldn`t be crate new post, wrong blogId', async () => {
    const wrongDataPost3: CreatePostInputModel = {
      title: '1212',
      content: 'dssd',
      blogId: '63189b06003380064c4193be',
      shortDescription: 'sdsd'
    };

    await postsTestManagers.createPost({ data: wrongDataPost3, status: HttpStatus.NOT_FOUND});

  });
  it('shouldn`t be crate new post, not authorization ', async () => {
    const postData: CreatePostInputModel = {
      title: 'new post',
      content: 'content',
      shortDescription: 'shortDescription',
      blogId: blog.id
    };

    await postsTestManagers.createPost(
      {
        data: postData,
        login: 'qwerty',
        status: HttpStatus.UNAUTHORIZED
      });

  });

  it('should be create comment', async () => {
    const user = await authTestManagers.registrationTestUser();
    const post: PostViewModel[] = await postsTestManagers.createTestPost();


    const comment = await commentsTestManagers.createComment(post[0].id, contentTestComment, user[0].accessToken);
    expect(comment).toEqual({
      id: expect.any(String),
      content: contentTestComment,
      commentatorInfo: {
        userId: user[0].userId,
        userLogin: user[0].login
      },
      createdAt: expect.any(String),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None'
      }
    });
  });

  it('shouldn`t be create new comment, not authorization', async () => {
    const post: PostViewModel[] = await postsTestManagers.createTestPost();
    await commentsTestManagers.createComment(post[0].id, contentTestComment, '', HttpStatus.UNAUTHORIZED);
  });
  it('shouldn`t be create new comment, incorrect content', async () => {
    const user = await authTestManagers.registrationTestUser();
    const post: PostViewModel[] = await postsTestManagers.createTestPost();
    const res1 = await commentsTestManagers.createComment(post[0].id, 'contentTest', user[0].accessToken, HttpStatus.BAD_REQUEST);
    expect(res1).toEqual({
      errorsMessages: [
        {
          message: 'content length should be  min 20, max 300 symbols',
          field: 'content'
        }
      ]
    });
  });

  it('should return error if :id from uri param not found', async () => {
    const users = await authTestManagers.registrationTestUser();
    await commentsTestManagers.createTestComments('post[0].id', users[0].accessToken, 1, HttpStatus.NOT_FOUND);
  });


});
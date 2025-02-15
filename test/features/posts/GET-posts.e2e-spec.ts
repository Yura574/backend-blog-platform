import { clearDatabase, closeTest, initializeTestSetup, testApp } from '../../../test-setup';
import { PostsTestManagers } from '../../testManagers/postsTestManagers';
import { HttpStatus } from '@nestjs/common';
import { PostViewModel } from '../../../src/features/posts/api/model/output/postViewModel';
import { ReturnViewModel } from '../../../src/features/1_commonTypes/returnViewModel';
import { CommentOutputModel } from '../../../src/features/comments/api/output/comment.output.model';
import { CommentTestManagers } from '../../testManagers/commentTestManagers';
import { AuthTestManager, UserViewTestType } from '../../testManagers/authTestManager';


describe('test for GET posts', () => {
  let postsTestManagers: PostsTestManagers;
  let commentsTestManagers: CommentTestManagers;
  let authTestManagers: AuthTestManager;
  let user: UserViewTestType[];
  beforeAll(async () => {
    await initializeTestSetup();
    postsTestManagers = new PostsTestManagers(testApp);
    commentsTestManagers = new CommentTestManagers(testApp);
    authTestManagers = new AuthTestManager(testApp);
    user= await authTestManagers.registrationTestUser();

  });
  beforeEach(async () => {
    await clearDatabase();
    user = await authTestManagers.registrationTestUser();
  });

  afterAll(async () => {
    await closeTest();
  });

  it('should get all posts', async () => {
    await postsTestManagers.createTestPost(12);
    const posts: ReturnViewModel<PostViewModel[]> = await postsTestManagers.getAllPosts('',{});
    expect(posts).toStrictEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 10,
      totalCount: 12,
      items: expect.any(Array)
    });
    expect(posts.items?.length).toBe(10);
    expect(posts.items?.[0]?.title).toBe('title 12');
  });
  it('should get posts with query', async () => {
    await postsTestManagers.createTestPost(12);
    const posts: ReturnViewModel<PostViewModel[]> = await postsTestManagers.getAllPosts('',


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
    expect(posts.items?.[0]?.title).toBe('title 8');
  });

  it('should get post by id', async () => {
    const post: PostViewModel[] = await postsTestManagers.createTestPost()
    const createdPost = await postsTestManagers.getPostById(post[0].id);

    expect(createdPost).toEqual({
        id: expect.any(String),
        title: 'title 1',
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: post[0].blogId,
        blogName: post[0].blogName,
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
    await postsTestManagers.getPostById('post.id', '', HttpStatus.NOT_FOUND);
  });

  it('should get comments for post', async () => {
    const post: PostViewModel[] = await postsTestManagers.createTestPost()

    await commentsTestManagers.createTestComments(post[0].id, user[0].accessToken, 9);
    const res1: ReturnViewModel<CommentOutputModel[]> = await commentsTestManagers.getComments(post[0].id, '', {});
    expect(res1).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 9,
      items: expect.any(Array)
    });

    expect(res1.items![0].content).toBe('comment 9 should be count');
  });

  it('should get comments for post, with query', async () => {
    const post: PostViewModel[] = await postsTestManagers.createTestPost()

    await commentsTestManagers.createTestComments(post[0].id, user[0].accessToken, 10);
    //комменты сначало старые
    const res1: ReturnViewModel<CommentOutputModel[]> = await commentsTestManagers.getComments(post[0].id, '',{pageNumber:2, pageSize:3, sortDirection:'asc'} );
    expect(res1).toEqual({
      pagesCount: 4,
      page: 2,
      pageSize: 3,
      totalCount: 10,
      items: expect.any(Array)
    });
    //комменты сначало новые
    expect(res1.items![0].content).toBe('comment 4 should be count');
    const res2: ReturnViewModel<CommentOutputModel[]> = await commentsTestManagers.getComments(post[0].id, '',{pageNumber:2, pageSize:3,}  );
    expect(res2).toEqual({
      pagesCount: 4,
      page: 2,
      pageSize: 3,
      totalCount: 10,
      items: expect.any(Array)
    });

    expect(res2.items![0].content).toBe('comment 7 should be count');
  });


});

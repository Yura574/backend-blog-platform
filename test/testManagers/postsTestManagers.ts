import { CreatePostInputModel } from '../../src/features/posts/api/model/input/createPost.input.model';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createBlogTestData } from './blogsTestManagers';
import { PostViewModel } from '../../src/features/posts/api/model/output/postViewModel';

export class PostsTestManagers {
  constructor(protected app: INestApplication) {
  }

  async createPost({
                     data,
                     status = HttpStatus.CREATED,
                     login = 'admin',
                     password = 'qwerty'
                   }: CreatePostType) {

    const res = await request(this.app.getHttpServer())
      .post('/posts')
      .auth(login, password)
      .send(data)
      .expect(status);
    return res.body;
  }

  async createTestPost(count = 1, status = HttpStatus.CREATED) {
    const resBlog = await request(this.app.getHttpServer())
      .post('/blogs')
      .auth('admin', 'qwerty')
      .send(createBlogTestData)
      .expect(status);


    // console.log(resBlog.body);
    const posts: PostViewModel[] = [];
    for (let i = 0; count > i; i++) {
      const data: CreatePostInputModel = {
        blogId: resBlog.body.id,
        content: `content`,
        title: `title ${1 + i}`,
        shortDescription: `shortDescription`
      };
      const res = await request(this.app.getHttpServer())
        .post('/posts')
        .auth('admin', 'qwerty')
        .send(data)
        .expect(HttpStatus.CREATED);
      posts.push(res.body);
    }
    return posts;


  }

  async getAllPosts(token = '',
                    {
                      sortBy = 'createdAt',
                      sortDirection = 'desc',
                      pageSize = 10,
                      pageNumber = 1
                    },
                    status = HttpStatus.OK) {

    const res = await request(this.app.getHttpServer())
      .get(`/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortDirection=${sortDirection}&sortBy=${sortBy}`)
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;
  }

  async getPostById(postId: string, token: string = '', status = HttpStatus.OK) {
    const res = await request(this.app.getHttpServer())
      .get(`/posts/${postId}`)
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;

  }

  async updatePost(
    postID: string,
    data?: any,
    status = HttpStatus.NO_CONTENT,
    login = 'admin', password = 'qwerty'
  ) {
    const res = await request(this.app.getHttpServer())
      .put(`/posts/${postID}`)
      .send(data)
      .auth(login, password)
      .expect(status);
    return res.body;
  }

  async updateLikeStatusPost(token: string, postId: string, likeStatus: any, status = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .put(`/posts/${postId}/like-status`)
      .send({ likeStatus })
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;

  }

  async deletePost(postId: string, status = HttpStatus.NO_CONTENT, login = 'admin', password = 'qwerty') {
    return request(this.app.getHttpServer())
      .delete(`/posts/${postId}`)
      .auth(login, password)
      .expect(status);
  }

  async getPostComments(postId: string, token = '', status = HttpStatus.OK) {
    const res = await request(this.app.getHttpServer())
      .get(`/posts/${postId}/comments`)
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body
  }
}


type CreatePostType = {
  data: any
  login?: string,
  password?: string
  status?: HttpStatus
}

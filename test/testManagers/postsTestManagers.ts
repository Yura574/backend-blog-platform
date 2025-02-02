import { CreatePostInputModel } from '../../src/features/posts/api/model/input/createPost.input.model';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createBlogTestData } from './blogsTestManagers';
import { QueryPostsType } from '../../src/features/posts/api/types/queryPostsType';


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

  async createTestPost(count?: number) {
    const resBlog = await request(this.app.getHttpServer())
      .post('/blogs')
      .auth('admin', 'qwerty')
      .send(createBlogTestData)
      .expect(HttpStatus.CREATED);

    const postTestData: CreatePostInputModel = {
      blogId: resBlog.body.id,
      content: 'content',
      title: 'title',
      shortDescription: 'shortDescription'
    };

    if (count) {
      for (let i = 0; i < count; i++) {
        const data: CreatePostInputModel = {
          blogId: resBlog.body.id,
          content: `content ${i}`,
          title: `title ${i}`,
          shortDescription: `shortDescription ${i}`
        };
        await request(this.app.getHttpServer())
          .post('/posts')
          .auth('admin', 'qwerty')
          .send(data)
          .expect(HttpStatus.CREATED);
      }

    } else {
      const res = await request(this.app.getHttpServer())
        .post('/posts')
        .auth('admin', 'qwerty')
        .send(postTestData)
        .expect(HttpStatus.CREATED);
      return res.body;
    }
  }

  async getAllPosts({ sortBy, sortDirection, pageSize, pageNumber }: QueryPostsType,
                    status = HttpStatus.OK) {
    const query: QueryPostsType = {
      pageNumber: pageNumber ? pageNumber : 1,
      pageSize: pageSize ? pageSize : 10,
      sortDirection: sortDirection ? sortDirection : 'desc',
      sortBy: sortBy ? sortBy : 'createdAt'
    };
    const res = await request(this.app.getHttpServer())
      .get(`/posts?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}&sortDirection=${query.sortDirection}&sortBy=${query.sortBy}`)
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
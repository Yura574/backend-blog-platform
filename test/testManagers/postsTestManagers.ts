import { CreatePostInputModel } from '../../src/features/posts/api/model/input/createPost.input.model';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createBlogTestData } from './blogsTestManagers';


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

  async createTestPost() {
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
    const res = await request(this.app.getHttpServer())
      .post('/posts')
      .auth('admin', 'qwerty')
      .send(postTestData)
      .expect(HttpStatus.CREATED);
    return res.body;
  }
}


type CreatePostType = {
  data: any
  login?: string,
  password?: string
  status?: HttpStatus
}
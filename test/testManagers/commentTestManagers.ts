import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';


export const contentTestComment = 'length content should be min 20 symbols';

export class CommentTestManagers {
  constructor(private app: INestApplication) {
  }


  async createComment(postId: string, content: string, token = '', status = HttpStatus.CREATED) {
    const res = await request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .send({ content })
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;
  }

  async createTestComments(postId: string, token: string, count = 1, status = HttpStatus.CREATED) {
    if (count === 1) {
      const res = await request(this.app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .send({ content: contentTestComment })
        .auth(token, { type: 'bearer' })
        .expect(status);
      return res.body;
    } else {
      for (let i = 0; count > i ; i++) {
        await request(this.app.getHttpServer())
          .post(`/posts/${postId}/comments`)
          .send({ content: contentTestComment })
          .auth(token, { type: 'bearer' })
          .expect(status);
      }
    }

  }

  async getComments(postId: string, pageNumber =1, pageSize = 10, sortBy='createdAt', sortDirection='desc'){
    const res = await request(this.app.getHttpServer())
      .get(`/posts/${postId}/comments?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`)

    return res.body
  }
}

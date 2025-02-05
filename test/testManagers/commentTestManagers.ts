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
}

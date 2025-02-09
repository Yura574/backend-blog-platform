import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { LikeStatusInputModel } from '../../src/features/posts/api/model/input/LikeStatus.input.model';
import { LikeStatus } from '../../src/features/posts/api/model/output/postViewModel';
import { CommentOutputModel } from '../../src/features/comments/api/output/comment.output.model';


export const contentTestComment = 'length content should be min 20 symbols';

export class CommentTestManagers {
  constructor(private app: INestApplication) {
  }


  async createComment(postId: string, content: string, token: string, status = HttpStatus.CREATED) {
    const res = await request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .send({ content })
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;
  }

  async createTestComments(postId: string, token: string, count = 1, status = HttpStatus.CREATED): Promise<CommentOutputModel[]> {

    let comments: CommentOutputModel[] = [];
    for (let i = 0; count > i; i++) {
      const content = `comment ${1 + i} should be count`;
      const res = await request(this.app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .send({ content })
        .auth(token, { type: 'bearer' })
        .expect(status);
      comments.push(res.body);
    }
    return comments;


  }

  async getComments(postId: string, token = '', {
    pageNumber = 1,
    pageSize = 10,
    sortDirection = 'desc',
    sortBy = 'createdAt'
  }) {
    const res = await request(this.app.getHttpServer())
      .get(`/posts/${postId}/comments?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`)
      .auth(token, { type: 'bearer' });

    return res.body;
  }

  async getCommentById(commentId: string, token = '', status = HttpStatus.OK) {
    const res = await request(this.app.getHttpServer())
      .get(`/comments/${commentId}`)
      .auth(token, { type: 'bearer' })
      .expect(status);

    return res.body;
  }

  async deleteCommentById(commentId: string, token: string, status = HttpStatus.NO_CONTENT) {
    await request(this.app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .auth(token, { type: 'bearer' })
      .expect(status);
  }

  async updateCommentById(commentId: string, content: string, token: string, status = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .put(`/comments/${commentId}`)
      .send({ content })
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;
  }

  async updateLikeStatus(commentId: string, token: string, likeStatus: LikeStatus, status = HttpStatus.NO_CONTENT) {
    const res = await request(this.app.getHttpServer())
      .put(`/comments/${commentId}/like-status`)
      .send({ likeStatus })
      .auth(token, { type: 'bearer' })
      .expect(status);
    return res.body;
  }
}

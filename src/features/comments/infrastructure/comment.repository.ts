import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import { CreateNewCommentType } from '../api/types/createNewComment.type';


@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
  }

  async createComment(comment: CreateNewCommentType) {
    try {
      const res = await this.commentModel.create(comment);
      console.log(res);
      return res
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
}
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import { CreateNewCommentType } from '../api/types/createNewComment.type';

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
  }

  async createComment(comment: CreateNewCommentType) {
    try {
      return await this.commentModel.create(comment);
    } catch (err) {
      throw new BadRequestException('comment not found');
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(commentId)) throw new NotFoundException();
      const comment: CommentDocument | null = await this.commentModel.findOne({ _id: commentId });
      if (!comment) throw new NotFoundException();

      if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException();

      return await this.commentModel.deleteOne({ _id: commentId });

    } catch (err) {
      if (err instanceof NotFoundException) throw new NotFoundException();

      if (err instanceof ForbiddenException) throw new ForbiddenException();

      throw new InternalServerErrorException();
    }
  }


}
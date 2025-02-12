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
import { LikeUserInfo } from '../../posts/api/types/postDBType';
import { AuthUserType } from '../../users/api/models/types/userType';

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
  }

  async createComment(comment: CreateNewCommentType) {
    try {
      return await this.commentModel.create(comment);
    } catch (err) {
      console.log(err);
      throw new Error('comment not found');
    }
  }

  async updateComment(commentId: string, content: string) {
    try {
      return await this.commentModel.updateOne({ _id: commentId }, {
        $set: {
          content
        }
      });
    } catch (err) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async updateLikeStatus(commentId: string, likeUserInfo: LikeUserInfo) {
    const userId = likeUserInfo.userId;
    try {
      //проверка корректности id, ошибка если не соответствует ObjectId
      if (!Types.ObjectId.isValid(commentId)) throw new NotFoundException();

      const comment: CommentDocument | null = await this.commentModel.findOne({ _id: commentId });
      if (!comment) throw new NotFoundException();


      const myLikeStatus = comment.likesUserInfo.find(el => el.userId === likeUserInfo.userId);
      if (myLikeStatus) {
        if (likeUserInfo.likeStatus === 'None') {
          const res = await this.commentModel.updateOne({ _id: commentId }, {
            $pull: { likesUserInfo: { userId } }
          });
          if (res.modifiedCount === 0) throw new NotFoundException();
        } else {
          await this.commentModel.updateOne({ _id: commentId }, {
            $pull: { likesUserInfo: { userId } }
          });
          await this.commentModel.updateOne({ _id: commentId }, {
            $push: { likesUserInfo: likeUserInfo }
          });

        }

      } else {
        if (likeUserInfo.likeStatus !== 'None') {
          const res = await this.commentModel.updateOne({ _id: commentId }, {
              $push: { likesUserInfo: likeUserInfo }
            }
          );
          if (res.modifiedCount === 0) throw new NotFoundException();
        }
      }
      return;
    } catch (err) {
      if (err instanceof NotFoundException) throw new NotFoundException('comment not found');
      if (err instanceof ForbiddenException) throw new ForbiddenException();
      throw new InternalServerErrorException('something went wrong');
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
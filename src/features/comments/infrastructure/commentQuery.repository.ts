import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import { Model, Types } from 'mongoose';
import { QueryCommentsType } from '../api/types/QueryComments.type';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { CommentOutputModel } from '../api/output/comment.output.model';


@Injectable()
export class CommentQueryRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument> ) {
  }

  async getCommentsByPostId(postId: string, query: QueryCommentsType): Promise<ReturnViewModel<CommentOutputModel[] | void>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const countDocument = await this.commentModel.countDocuments({ postId });
    const pagesCount = Math.ceil(countDocument / pageSize);
    const skip = (+pageNumber - 1) * +pageSize;
    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    const res: CommentDocument[] | null = await this.commentModel.find({ postId }).sort(sort).skip(skip).limit(+pageSize);
    const returnComments: CommentOutputModel[] = res.map((el: CommentDocument) => {
      return {
        id: el.id,
        content: el.content,
        createdAt: el.createdAt,
        commentatorInfo: {
          userId: el.commentatorInfo.userId,
          userLogin: el.commentatorInfo.userLogin
        },
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None'
        }
      };
    });
    return {
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: countDocument,
      pagesCount,
      items: returnComments
    };
  }

  async getCommentById(id: string): Promise<CommentOutputModel | void> {
    try {
      if (!Types.ObjectId.isValid(id)) throw new NotFoundException();

      const comment: CommentDocument | null = await this.commentModel.findOne({ _id: id });
      if(!comment) throw new NotFoundException()
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: 'None'
        }
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }
}
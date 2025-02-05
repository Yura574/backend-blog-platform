import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import { CreateNewCommentType } from '../api/types/createNewComment.type';
import { QueryCommentsType } from '../api/types/QueryComments.type';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { CommentOutputModel } from '../api/output/comment.output.model';


@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
  }

  async createComment(comment: CreateNewCommentType) {
    try {
      const res = await this.commentModel.create(comment);
      return res;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async getCommentsByPostId(postId: string, query: QueryCommentsType) {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const countDocument = await this.commentModel.countDocuments({postId})
    const pagesCount = Math.ceil(countDocument)
    const skip = (+pageNumber - 1) * +pageSize;
    const sort: any ={}
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1
    const res = await this.commentModel.find({postId}).sort(sort).skip(skip).limit(+pageSize);
    console.log(res);
    return {
      page: pageNumber,
      pageSize,
      totalCount: countDocument,
      pagesCount,
      items: res
    }
  }
}
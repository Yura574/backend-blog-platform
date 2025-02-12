import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/comment.repository';
import { CreateNewCommentType } from '../api/types/createNewComment.type';
import { CommentOutputModel } from '../api/output/comment.output.model';
import { CommentQueryRepository } from '../infrastructure/commentQuery.repository';
import { LikeStatus } from '../../posts/api/model/output/postViewModel';
import { LikeUserInfo } from '../../posts/api/types/postDBType';
import { Types } from 'mongoose';
import { ErrorMessageType } from '../../../infrastructure/exception-filters/exeptions';


@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository,
              private commentQueryRepository: CommentQueryRepository) {
  }

  async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentOutputModel | void> {
    // await this.postQueryRepository.getPostById(req.params.id)
    //add class
    const newComment: CreateNewCommentType = {
      postId,
      content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId,
        userLogin
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        likeUserInfo: []
      }

    };
    const comment = await this.commentRepository.createComment(newComment);


    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None'
      }
    };
  }

  async updateComment(commentId: string, content: string, userId: string) {
    const comment: CommentOutputModel | null = await this.commentQueryRepository.getCommentById(commentId);
    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException();

    return await this.commentRepository.updateComment(commentId, content);
  }

  async updateLikeStatus(commentId: string, likeStatus: LikeStatus, userId: string, userLogin: string) {
    const likeUserInfo: LikeUserInfo = {
      userId,
      likeStatus,
      login: userLogin,
      addedAt: new Date().toISOString()
    };
    return await this.commentRepository.updateLikeStatus(commentId, likeUserInfo);
  }

  async deleteComment(commentId: string, userId: string) {
    if (!Types.ObjectId.isValid(commentId)) throw new NotFoundException();

    try {
      const comment: CommentOutputModel | null = await this.commentQueryRepository.getCommentById(commentId);
      if (!comment) throw new NotFoundException();
      if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException();
      return await this.commentRepository.deleteComment(commentId, userId);
    } catch (err) {

      if (err instanceof NotFoundException) throw new NotFoundException();
      if (err instanceof ForbiddenException) throw new ForbiddenException();
      throw new InternalServerErrorException();
    }
  }
}

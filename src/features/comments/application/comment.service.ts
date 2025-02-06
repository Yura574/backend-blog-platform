import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/comment.repository';
import { CreateNewCommentType } from '../api/types/createNewComment.type';
import { CommentOutputModel } from '../api/output/comment.output.model';
import { CommentQueryRepository } from '../infrastructure/commentQuery.repository';


@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository,
              private commentQueryRepository: CommentQueryRepository) {
  }

  async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentOutputModel | void> {

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
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: 'None'
      }
    };
  }

  async updateComment(commentId: string, content: string, userId: string) {
    const comment: CommentOutputModel | null = await this.commentQueryRepository.getCommentById(commentId);
    if(!comment) throw new NotFoundException()
    if (comment.commentatorInfo.userId !== userId) throw new ForbiddenException();

return await this.commentRepository.updateComment(commentId, content)
  }

  async deleteComment(commentId: string, userId: string) {
    return await this.commentRepository.deleteComment(commentId, userId);
  }
}

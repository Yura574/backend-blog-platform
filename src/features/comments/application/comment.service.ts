import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/comment.repository';
import { CreateNewCommentType } from '../api/types/createNewComment.type';
import { CommentOutputModel } from '../api/output/comment.output.model';
import { QueryCommentsType } from '../api/types/QueryComments.type';


@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {
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


  async deleteComment(commentId: string, userId: string){
    return await this.commentRepository.deleteComment(commentId, userId)
  }
}

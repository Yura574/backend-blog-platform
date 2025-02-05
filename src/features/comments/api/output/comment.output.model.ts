import { LikeStatus } from '../../../posts/api/model/output/postViewModel';


export type CommentOutputModel = {
  id: string,
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string
  },
  createdAt: string,
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus
  }
}
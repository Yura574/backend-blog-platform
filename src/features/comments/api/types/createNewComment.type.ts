import { LikeUserInfo } from '../../../posts/api/types/postDBType';


export type CreateNewCommentType = {
  postId: string
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string
  },
  createdAt: string
  likesInfo:{
    likesCount: number,
    dislikesCount: number
    likeUserInfo:LikeUserInfo[]
  }
}
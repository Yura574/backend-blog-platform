import { Prop } from '@nestjs/mongoose';


export type NewPost = {
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: {
    likesCount: number
    dislikesCount: number
    likeUserInfo: LikeUserInfo[]
  }
}

type LikeUserInfo = {
  userId: string
  likeStatus: string
  login: string
  createdAt: string
}
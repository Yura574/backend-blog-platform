import { Types } from 'mongoose';
import { Prop } from '@nestjs/mongoose';


export type PostDBType = {
  _id: Types.ObjectId
  title: string,
  content: string,
  blogId: string,
  shortDescription: string,
  blogName: string,
  createdAt: string,
  extendedLikesInfo: ExtendedLikesInfoType
}

type ExtendedLikesInfoType = {
  likeUserInfo: LikeUserInfo[]
}

export type LikeUserInfo = {
  userId: string
  likeStatus: LikeStatus
  login: string
  addedAt: string
}
export type LikeStatus = 'None' | 'Like' | 'Dislike'


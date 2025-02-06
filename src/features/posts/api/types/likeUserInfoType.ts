import { Prop } from '@nestjs/mongoose';


export type LikeUserInfoType = {

  userId: string

  login: string

  likeStatus: 'Like' | 'Dislike' | 'None'

  addedAt: string
}
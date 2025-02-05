import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsArray } from 'class-validator';


export type CommentDocument = HydratedDocument<Comment>

@Schema()
class CommentatorInfo {
  @Prop()
  userId: string

  @Prop()
  userLogin: string

}
class LikeUserInfo {
  @Prop()
  userId: string
  @Prop()
  likeStatus: 'Like' | 'Dislike' | 'None'
  @Prop()
  login: string
  @Prop()
  addedAt: string
}

@Schema()
class LikesInfo {
  @Prop()
  likesCount: number
  @Prop()
  dislikesCount: number

  @Prop({type: [LikeUserInfo]})
  @IsArray()
  likeUserInfo: LikeUserInfo[]
}

@Schema()
export class Comment {
  @Prop()
  postId: string

  @Prop()
  content: string;

  @Prop()
  createdAt: string

  @Prop({type: CommentatorInfo, _id: false})
  commentatorInfo: CommentatorInfo

  @Prop({ type: LikesInfo, _id: false})
  likesInfo: LikesInfo
}

export const CommentSchema = SchemaFactory.createForClass(Comment)



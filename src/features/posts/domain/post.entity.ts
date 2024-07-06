import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray } from 'class-validator';


export type PostDocument = HydratedDocument<Post>
@Schema()

@Schema()
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
class ExtendedLikesInfo{
  @Prop()
  likesCount: number

  @Prop()
  dislikesCount: number

  @Prop({type: [LikeUserInfo]})
  @IsArray()
  likeUserInfo: LikeUserInfo[]
}


@Schema()
export class Post {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({type: ExtendedLikesInfo, _id: false})
  extendedLikesInfo:  ExtendedLikesInfo;

}




export const PostSchema = SchemaFactory.createForClass(Post)

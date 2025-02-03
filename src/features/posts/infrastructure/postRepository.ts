import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model, Types } from 'mongoose';
import { NewPost } from '../api/model/output/newPost';
import { UpdatePostInputModel } from '../api/model/input/updatePost.input.model';
import { LikeStatus } from '../api/model/output/postViewModel';
import { PostDBType } from '../api/types/postDBType';


@Injectable()

export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
  }

  async createPost(dto: NewPost) {
    return await this.postModel.create(dto);
  }

  async updatePost(postId: string, dto: UpdatePostInputModel) {
try {
  const { title, shortDescription, content } = dto;
  if (!Types.ObjectId.isValid(postId)) throw new NotFoundException();
  const res = await this.postModel.updateOne({ _id: postId }, {
    $set: {
      content,
      title,
      shortDescription
    }
  });
  if (res.modifiedCount === 0) throw new NotFoundException();
} catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async updateLikeStatusPost(postId: string, likeStatus: LikeStatus) {
try {
  if (!Types.ObjectId.isValid(postId)) throw new NotFoundException();
  const postInfo: PostDBType | null = await this.postModel.findOne({_id: postId})
  console.log(postInfo?.extendedLikesInfo.likeUserInfo.filter(el=> el.userId).length !==0);
  if(postInfo?.extendedLikesInfo.likeUserInfo.filter(el=> el.userId).length !==0){

  }

  const res = await this.postModel.updateOne({ _id: postId }, {
    $set: {
     // extendedLikesInfo.
    }
  });
  if (res.modifiedCount === 0) throw new NotFoundException();
} catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async deletePost(postId: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) throw new NotFoundException();

      const result = await this.postModel.deleteOne({ _id: postId });

      if (result.deletedCount === 0) throw new NotFoundException();
      return result;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }
}
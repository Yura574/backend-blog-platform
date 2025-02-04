import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model, Types } from 'mongoose';
import { NewPost } from '../api/model/output/newPost';
import { UpdatePostInputModel } from '../api/model/input/updatePost.input.model';
import { LikeStatus } from '../api/model/output/postViewModel';
import { LikeUserInfo, PostDBType } from '../api/types/postDBType';
import { AuthUserType, UserType } from '../../users/api/models/types/userType';
import { LikeUserInfoType } from '../api/types/likeUserInfoType';


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

  async updateLikeStatusPost(postId: string, likeStatus: LikeStatus, userData: AuthUserType) {
    const { userId, login } = userData;
    try {
      //проверка корректности id, ошибка если не соответствует ObjectId
      if (!Types.ObjectId.isValid(postId)) throw new NotFoundException();

      const postInfo: PostDBType | null = await this.postModel.findOne({ _id: postId });
      if (!postInfo) throw new NotFoundException('Post not found');

      const likeUserInfo: LikeUserInfo = {
        userId,
        login,
        likeStatus,
        addedAt: new Date().toISOString()
      };
      const myLikeStatus = postInfo.extendedLikesInfo.likeUserInfo.find(el => el.userId === userId);
      if (myLikeStatus) {
        const res = await this.postModel.updateOne({ _id: postId }, {
          $set: {
            'extendedLikesInfo.likesCount': postInfo.extendedLikesInfo.likesCount + (likeStatus === 'Like' ? 1 : -1),
            'extendedLikesInfo.dislikesCount': postInfo.extendedLikesInfo.dislikesCount + (likeStatus === 'Dislike' ? 1 : -1)
          },
          $pull: { 'extendedLikesInfo.likeUserInfo': { userId } },
          $push: { 'extendedLikesInfo.likeUserInfo': likeUserInfo }
        });
        if (res.modifiedCount === 0) throw new NotFoundException();

      } else {
        //если юзер лайк не ставил, просто устанавливаем статус который отправил
        const res = await this.postModel.updateOne({ _id: postId }, {
          $set: {
            'extendedLikesInfo.likesCount': postInfo.extendedLikesInfo.likesCount + (likeStatus=== 'Like'? 1: 0),
            'extendedLikesInfo.dislikesCount': postInfo.extendedLikesInfo.dislikesCount + (likeStatus=== 'Dislike'? 1: 0)
          },
          $push: { 'extendedLikesInfo.likeUserInfo': likeUserInfo }
        });
        if (res.modifiedCount === 0) throw new NotFoundException();
      }


    } catch (err) {
      console.log(err);
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
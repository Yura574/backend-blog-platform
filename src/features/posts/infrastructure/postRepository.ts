import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model } from 'mongoose';
import { NewPost } from '../api/model/output/newPost';
import { UpdatePostInputModel } from '../api/model/input/updatePost.input.model';


@Injectable()

export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
  }

  async createPost(dto: NewPost) {
    return await this.postModel.create(dto);
  }

  async updatePost(postId: string, dto: UpdatePostInputModel) {

      const { title, shortDescription, content } = dto;
      const res = await this.postModel.updateOne({ _id: postId }, {
        $set: {
          content,
          title,
          shortDescription
        }
      });
      if(res.modifiedCount === 0) throw new NotFoundException();


  }

  async deleteBlog(id: string) {
    const isDeleted = await this.postModel.deleteOne({ _id: id });
    if (isDeleted.deletedCount === 0) throw new NotFoundException();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model } from 'mongoose';
import { NewPost } from '../api/model/output/newPost';


@Injectable()

export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
  }

  async createPost(dto: NewPost) {
    return await this.postModel.create(dto);
  }
}
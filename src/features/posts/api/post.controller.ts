import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from '../application/postService';
import { CreatePostInputModel } from './model/input/createPost.input.model';


@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {
  }

  @Post()
  async createPost(@Body() dto: CreatePostInputModel) {
    return await this.postService.createPost(dto);
  }
}
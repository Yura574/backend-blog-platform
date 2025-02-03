import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post, Put,
  Req, UseGuards
} from '@nestjs/common';
import { PostService } from '../application/postService';
import { CreatePostInputModel } from './model/input/createPost.input.model';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { QueryPostsType } from './types/queryPostsType';
import { PostQueryRepository } from '../infrastructure/postQueryRepository';
import { ParamType } from '../../1_commonTypes/paramType';
import { UpdatePostInputModel } from './model/input/updatePost.input.model';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { LikeStatus } from './model/output/postViewModel';


@Controller('posts')
export class PostController {
  constructor(private postService: PostService,
              private postQueryRepository: PostQueryRepository) {
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() dto: CreatePostInputModel) {
    return await this.postService.createPost(dto);
  }

  @Get()
  async getPosts(@Req() req: RequestType<{}, {}, QueryPostsType>) {
    return await this.postQueryRepository.getPosts(req.query);
  }

  @Get(':id')
  async getPostById(@Param() param: ParamType) {
    return await this.postQueryRepository.getPostById(param.id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param() param: ParamType,
                   @Body() body: UpdatePostInputModel) {
    console.log(123);
    return await this.postService.updatePost(param.id, body);
  }

  @UseGuards(AuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostLikeStatus(@Param() param: ParamType,
                   @Body() body: LikeStatus) {
    return await this.postService.updateLikeStatusPost(param.id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() param: ParamType) {
    return await this.postService.deletePost(param.id);
  }
}
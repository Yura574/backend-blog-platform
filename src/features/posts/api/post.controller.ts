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
  Req
} from '@nestjs/common';
import { PostService } from '../application/postService';
import { CreatePostInputModel } from './model/input/createPost.input.model';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { QueryPostsType } from './types/queryPostsType';
import { PostQueryRepository } from '../infrastructure/postQueryRepository';
import { ParamType } from '../../1_commonTypes/paramType';
import { UpdatePostInputModel } from './model/input/updatePost.input.model';


@Controller('posts')
export class PostController {
  constructor(private postService: PostService,
              private  postQueryRepository: PostQueryRepository) {
  }

  @Post()
  async createPost(@Body() dto: CreatePostInputModel) {
    return await this.postService.createPost(dto);
  }

  @Get()
  async getPosts(@Req() req:RequestType<{}, {}, QueryPostsType>){
    return await this.postQueryRepository.getPosts(req.query)
  }

  @Get(':id')
  async getPostById(@Param() param: ParamType){
    // if(!param.id) throw new NotFoundException({}, 'Blog not found')
    console.log('sd');
    return await this.postQueryRepository.getPostById(param.id)
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
async updatePost(@Param() param: ParamType,
                 @Body() body: UpdatePostInputModel){
return await this.postService.updatePost(param.id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() param: ParamType) {
    return await this.postService.deletePost(param.id)
  }
}
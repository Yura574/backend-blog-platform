import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogInputModel } from './model/input/createBlog.input.model';
import { Request } from 'express';
import { BlogsQueryRepository } from '../infrastructure/blogsQuery.repository';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { UserType } from '../../users/api/models/types/userType';
import { BlogViewModel } from './model/output/createdBlog.output.model';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { QueryBlogsTypes } from './types/queryBlogsTypes';
import { ParamType } from '../../1_commonTypes/paramType';


@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService,
              private blogsQueryRepository: BlogsQueryRepository) {
  }

  @Post()
  async createBlog(@Body() data: CreateBlogInputModel) {
    return await this.blogsService.createBlog(data);
  }

  @Get()
  async getBlogs(@Req() req: RequestType<{}, {}, QueryBlogsTypes>): Promise<ReturnViewModel<BlogViewModel[]> | null> {
    return await this.blogsQueryRepository.getBlogs(req.query);
  }

  @Get(':id')
  async getBlogById(@Param() param: ParamType) {
    return this.blogsQueryRepository.getBlogById(param.id)
  }
}
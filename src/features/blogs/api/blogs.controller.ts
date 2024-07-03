import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogInputModel } from './model/input/createBlog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogsQuery.repository';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { BlogViewModel } from './model/output/createdBlog.output.model';
import { RequestType } from '../../1_commonTypes/commonTypes';
import { QueryBlogsTypes } from './types/queryBlogsTypes';
import { ParamType } from '../../1_commonTypes/paramType';
import { UpdateBlogInputModel } from './model/input/updateBlog.input.model';


@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService,
              private blogsQueryRepository: BlogsQueryRepository) {
  }

  @Post()
  async createBlog(@Body() dto: CreateBlogInputModel) {
    return await this.blogsService.createBlog(dto);
  }

  @Get()
  async getBlogs(@Req() req: RequestType<{}, {}, QueryBlogsTypes>): Promise<ReturnViewModel<BlogViewModel[]> | null> {
    return await this.blogsQueryRepository.getBlogs(req.query);
  }

  @Get(':id')
  async getBlogById(@Param() param: ParamType) {
    return this.blogsQueryRepository.getBlogById(param.id)
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param() param: ParamType,
                   @Body() dto: UpdateBlogInputModel) {
    return await this.blogsService.updateBlog(param.id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param() param: ParamType){
    return await this.blogsService.deleteBlog(param.id)
  }
}
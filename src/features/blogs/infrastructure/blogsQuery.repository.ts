import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import { Model } from 'mongoose';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { BlogViewModel } from '../api/model/output/createdBlog.output.model';
import { QueryBlogsTypes } from '../api/types/queryBlogsTypes';


@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {
  }

  async getBlogs(queryParams: QueryBlogsTypes): Promise<ReturnViewModel<BlogViewModel[]> | null> {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortDirection = 'desc',
      sortBy = 'createdAt',
      searchNameTerm = null
    } = queryParams;

    const searchQuery =
      searchNameTerm ? { name: { $regex: new RegExp(searchNameTerm) } } : {};

    const blogsCount = await this.blogModel.countDocuments(searchQuery);
    const pagesCount = blogsCount / pageSize;

    const skip = (+pageNumber - 1) * +pageSize;
    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    const blogs = await this.blogModel.find(searchQuery).sort(sort).skip(skip).limit(+pageSize);
    const mappedBlogs: BlogViewModel[] = blogs.map(blog => {
      return {

        id: blog.id.toString(),
        name:  blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMemberShip: blog.isMemberShip,
        createdAt: new Date(blog.createdAt).toISOString()
      };
    });

    return {
      page: pageNumber,
      pagesCount,
      pageSize,
      totalCount: blogsCount,
      items: mappedBlogs
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.blogModel.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return {
      id: blog.id.toString(),
      name:  blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMemberShip: blog.isMemberShip,
      createdAt: new Date(blog.createdAt).toISOString()
    };
  }
}
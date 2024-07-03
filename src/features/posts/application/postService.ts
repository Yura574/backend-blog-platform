import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../infrastructure/postRepository';
import { CreatePostInputModel } from '../api/model/input/createPost.input.model';
import { NewPost } from '../api/model/output/newPost';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogsQuery.repository';


@Injectable()
export class PostService{
  constructor(private postRepository: PostRepository,
              private blogsQueryRepository: BlogsQueryRepository) {
  }

  async createPost(dto:CreatePostInputModel){
    const{title, content, shortDescription, blogId}= dto
    const blog = await this.blogsQueryRepository.getBlogById(blogId)
    if(!blog) throw new NotFoundException('Blog not found')
    const post: NewPost = {
      title,
      shortDescription,
      content,
      createdAt: new Date().toISOString(),
      blogId,
      blogName: blog.name,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount:0,
        likeUserInfo: []
      }
    }

    return await this.postRepository.createPost(post)
  }
}
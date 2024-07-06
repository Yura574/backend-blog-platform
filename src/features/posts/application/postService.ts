import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../infrastructure/postRepository';
import { CreatePostInputModel } from '../api/model/input/createPost.input.model';
import { NewPost } from '../api/model/output/newPost';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogsQuery.repository';
import { PostViewModel } from '../api/model/output/postViewModel';
import { UpdatePostInputModel } from '../api/model/input/updatePost.input.model';


@Injectable()
export class PostService{
  constructor(private postRepository: PostRepository,
              private blogsQueryRepository: BlogsQueryRepository) {
  }

  async createPost(dto:CreatePostInputModel): Promise<PostViewModel>{
    const{title, content, shortDescription, blogId}= dto
    if(!blogId) throw new HttpException('BlogId is required', HttpStatus.BAD_REQUEST)
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

   const createdPost =  await this.postRepository.createPost(post)
    return {
      id: createdPost._id.toString(),
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      title: createdPost.title,
      content: createdPost.content,
      shortDescription: createdPost.shortDescription,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
        myStatus: 'None'
      }

    }
  }

  async updatePost(postId: string, dto: UpdatePostInputModel){
    return await this.postRepository.updatePost(postId, dto)
  }

  async deletePost(id: string){
    return await this.postRepository.deleteBlog(id)
  }
}
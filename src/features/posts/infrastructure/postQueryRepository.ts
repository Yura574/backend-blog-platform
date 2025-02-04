import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.entity';
import { Model } from 'mongoose';
import { QueryPostsType } from '../api/types/queryPostsType';
import { ReturnViewModel } from '../../1_commonTypes/returnViewModel';
import { NewestLikesType, PostViewModel } from '../api/model/output/postViewModel';
import { LikeStatus, LikeUserInfo, PostDBType } from '../api/types/postDBType';
import { BlogsService } from '../../blogs/application/blogs.service';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogsQuery.repository';


@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
              private blogQueryRepository: BlogsQueryRepository) {
  }


  async getPosts(query: QueryPostsType, blogId?: string): Promise<ReturnViewModel<PostViewModel[]> | null> {
    const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = query;
    if (blogId) {
      const blog = await this.blogQueryRepository.getBlogById(blogId);
      if (!blog) throw new NotFoundException();
    }
    const skip = (pageNumber - 1) * pageSize;
    const totalCount = await this.postModel.countDocuments(blogId ? { blogId } : {});
    const pagesCount = Math.ceil(totalCount / pageSize);
    const sortObject: any = {};
    sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1;

    const items: PostDBType[] = await this.postModel.find(blogId ? { blogId } : {}).skip(skip).limit(pageSize).sort(sortObject);

    const returnItems: PostViewModel[] = items.map(item => {
      const likeInfo = this.getLikesInfoForPost(item);
      return {

        id: item._id.toString(),
        blogId: item.blogId,
        blogName: item.blogName,
        title: item.title,
        content: item.content,
        shortDescription: item.shortDescription,
        createdAt: item.createdAt,
        extendedLikesInfo: {
          likesCount: item.extendedLikesInfo.likesCount,
          dislikesCount: item.extendedLikesInfo.dislikesCount,
          newestLikes: likeInfo.newestLikes,
          myStatus: likeInfo.userStatus
        }
      };
    });
    const obj = {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: returnItems
    };
    return obj;
  }

  async getPostById(postId: string, userData?: any) {

    try {
      const postDB: PostDBType | null = await this.postModel.findById(postId);
      if (!postDB) {
        throw new NotFoundException();
      }

      const likeInfo = this.getLikesInfoForPost(postDB, userData);
      const post: PostViewModel = {
        id: postDB._id.toString(),
        title: postDB.title,
        shortDescription: postDB.shortDescription,
        content: postDB.content,
        blogId: postDB.blogId,
        blogName: postDB.blogName,
        createdAt: postDB.createdAt,
        extendedLikesInfo: {
          likesCount: postDB.extendedLikesInfo.likesCount,
          dislikesCount: postDB.extendedLikesInfo.dislikesCount,
          myStatus: likeInfo.userStatus,
          newestLikes: likeInfo.newestLikes
        }
      };
      return post;
    } catch (err) {
      throw new NotFoundException({}, 'Post not found');

    }

  }

  getLikesInfoForPost(post: PostDBType, userData?: any) {

    let userStatus: LikeStatus;
    const likePosts: LikeUserInfo[] = post.extendedLikesInfo.likeUserInfo;
    let sortedLikePosts: LikeUserInfo[] = likePosts.sort((a: LikeUserInfo, b: LikeUserInfo) => a.addedAt > b.addedAt ? -1 : 1);
    const likesCount = likePosts.filter((like: LikeUserInfo) => like.likeStatus === 'Like');

    const dislikesCount = likePosts.filter((like: LikeUserInfo) => like.likeStatus === 'Dislike');
    let newestLikes: NewestLikesType[] = [];
    for (let i = 0; newestLikes.length < 3 && i < sortedLikePosts.length; i++) {
      if (sortedLikePosts[i].likeStatus === 'Like') {
        const post: NewestLikesType = {
          addedAt: sortedLikePosts[i].addedAt,
          userId: sortedLikePosts[i].userId,
          login: sortedLikePosts[i].login
        };
        newestLikes.push(post);
      }
    }
    const findUserStatus = likePosts.find((likeStatus: LikeUserInfo) => userData && likeStatus.userId === userData.userId );
    userStatus = findUserStatus ? findUserStatus.likeStatus : 'None';

    return {
      likesCount: likesCount.length,
      dislikesCount: dislikesCount.length,
      userStatus,
      newestLikes: newestLikes
    };
  }
}
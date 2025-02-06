import { LikeStatus } from '../posts/api/model/output/postViewModel';

export type LikesInfoType = {
  likesCount: number,
  dislikesCount: number,
  myStatus: LikeStatus
}
import { LikeUserInfoType } from '../../features/posts/api/types/likeUserInfoType';
import { LikesInfoType } from '../../features/1_commonTypes/likesInfoType';
import { LikeStatus, LikeUserInfo, PostDBType } from '../../features/posts/api/types/postDBType';
import { NewestLikesType } from '../../features/posts/api/model/output/postViewModel';


export const likeInfoHandler = (userInfo: LikeUserInfo[], userId?: string) =>  {

  let userStatus: LikeStatus;

  let sortedLikePosts: LikeUserInfo[] = userInfo.sort((a: LikeUserInfo, b: LikeUserInfo) => a.addedAt > b.addedAt ? -1 : 1);
  const likesCount = userInfo.filter((like: LikeUserInfo) => like.likeStatus === 'Like');
  const dislikesCount = userInfo.filter((like: LikeUserInfo) => like.likeStatus === 'Dislike');

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

  const findUserStatus = userInfo.find((likeStatus: LikeUserInfo) =>  likeStatus.userId === userId );
  userStatus = findUserStatus ? findUserStatus.likeStatus : 'None';

  return {
    likesCount: likesCount.length,
    dislikesCount: dislikesCount.length,
    userStatus,
    newestLikes
  };
}
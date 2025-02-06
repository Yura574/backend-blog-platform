import { LikeUserInfoType } from '../../features/posts/api/types/likeUserInfoType';
import { LikesInfoType } from '../../features/1_commonTypes/likesInfoType';


export const likeInfoHandler = (likeInfo: LikeUserInfoType[], userId?: string): LikesInfoType => {
  const likesCount = likeInfo.filter(el=> el.likeStatus === 'Like').length
  const dislikesCount = likeInfo.filter(el=> el.likeStatus === 'Dislike').length
  const myStatus = likeInfo.find(el=> el.userId === userId)

  return {
    likesCount,
    dislikesCount,
    myStatus: myStatus ? myStatus.likeStatus : 'None'
  }
}
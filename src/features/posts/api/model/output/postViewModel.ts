
export type PostViewModel = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: ExtendedLikesInfo
}

export type ExtendedLikesInfo = {
  likesCount: number
  dislikesCount: number
  myStatus: LikeStatus
  newestLikes: NewestLikesType[]
}

export type NewestLikesType = {
  addedAt: string,
  userId: string,
  login: string
}
export type LikeStatus = 'None' | 'Like' | 'Dislike'



export type PostViewModel= {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: ExtendedLikesInfo
}

type ExtendedLikesInfo= {
  likesCount: number
  dislikes: number
  myStatus: LikeStatus
  newestLikes: string
}

type LikeStatus = 'None'| 'Like' | 'Dislike'
import { POST_MESSAGES } from '~/constants/messages'
import ExtraPost from '../models/ExtraPost'
import Notify from '../models/Notify'
import Post from '../models/Post'
import { PostType } from '../types/postType'
import { LikePostReqBody, UpdatePostReqBody } from '~/requestTypes'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/constants/httpStatus'

const postService = {
  handleGetPostList: async (limit: number, page: number) => {
    const post = new Post()
    const result = await post.getAll(limit, limit * (page - 1))
    return result
  },
  handleGetPostListByUser: async (userId: number, limit: number, page: number) => {
    const post = new Post()
    const result = await post.getAllById(userId, limit, limit * (page - 1))
    return result
  },
  handleGetPostDetail: async (id: number) => {
    const post = new Post()
    const result = await post.get(id)
    return result
  },
  handleAddPost: async (userId: number, data: PostType) => {
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const post = new Post(
      data.content,
      data.createdAt,
      '',
      userId,
      data.communityId ? data.communityId : 0,
      data.type,
      images,
      video
    )
    const { insertId } = await post.insert()
    const result = await post.find('SELECT * FROM posts WHERE id=?', [insertId])
    result.length > 0 &&
      Array.from(result).forEach((post: any) => {
        if (post.images) {
          const images = JSON.parse(post.images)
          post.images = images
        }
        if (post.video) {
          const video = JSON.parse(post.video)
          post.video = video
        }
      })
    return { message: POST_MESSAGES.CREATED_POST_SUCCESSFULLY, post: result[0] }
  },
  handleGetLikesPost: async (id: number) => {
    const ep = new ExtraPost()
    const result = await ep.getAllByPostIdAndType(id, 'like')
    return result
  },
  handleLikePost: async (userId: number, data: LikePostReqBody) => {
    const ep = new ExtraPost(userId, data.postId, data.type)
    const { insertId } = await ep.insert()
    if (userId !== data.receiverId) {
      const notify = new Notify('unseen', 'likedPost', insertId, data.receiverId)
      await notify.insert()
    }
    return { message: POST_MESSAGES.LIKED_POST_SUCCESSFULLY }
  },
  handleDeletePost: async (id: number, userId: number) => {
    const post = new Post()
    const { changedRows } = await post.delete(id, userId)
    if (changedRows === 0) {
      throw new ErrorWithStatus({
        message: POST_MESSAGES.USER_ID_IS_NOT_MATCHED_BY_POST,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    return { message: POST_MESSAGES.DELETED_POST_SUCCESSFULLY }
  },
  handleUnlikePost: async (id: number, userId: number) => {
    const ep = new ExtraPost()
    const notify = new Notify()
    await Promise.all([await ep.delete(id, userId), await notify.delete(id, 'likedPost')])
    return { message: POST_MESSAGES.UNLIKE_POST_SUCCESSFULLY }
  },
  handleUpdatePost: async (id: number, data: UpdatePostReqBody) => {
    const post = new Post()
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const sql = `UPDATE posts SET ${data.content ? `content='${data.content}'` : ''}${
      data.modifiedAt ? `,modifiedAt='${data.modifiedAt}'` : ''
    }${images ? `,images='${images}'` : ''}${video ? `,video='${video}'` : ''}${
      data.type ? `,type='${data.type}'` : ''
    } WHERE id=${id}`
    await post.update(sql, [])
    return { message: POST_MESSAGES.UPDATE_POST_SUCCESSFULLY }
  },
  handleGetLikes: async () => {
    const ep = new ExtraPost()
    const result = await ep.getAllByType('like')
    return result
  },
  handleSharePost: async (userId: number, postId: number, type: string) => {
    const ep = new ExtraPost(userId, postId, type)
    await ep.insert()
    return { message: POST_MESSAGES.SHARED_POST_SUCCESSFULLY }
  },
  handleGetSharesPost: async (id: number) => {
    const ep = new ExtraPost()
    const resultShare: any[] = await ep.getAllByPostIdAndType(id, 'share')
    const resultShareTo: any[] = await ep.getAllByPostIdAndType(id, 'shareTo')
    return [...resultShare, ...resultShareTo]
  }
}

export default postService

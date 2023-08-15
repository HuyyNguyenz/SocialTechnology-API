import ExtraPost from '../models/ExtraPost'
import Notify from '../models/Notify'
import Post from '../models/Post'
import { PostType } from '../types/postType'

const postService = {
  handleGetPostList: async (limit: number, offset: number) => {
    const post = new Post()
    const result = await post.getAll(limit, offset)
    return result
  },
  handleGetPostListByUser: async (userId: number, limit: number, offset: number) => {
    const post = new Post()
    const result = await post.getAllById(userId, limit, offset)
    return result
  },
  handleGetPostDetail: async (id: number) => {
    const post = new Post()
    const result = await post.get(id)
    return result
  },
  handleAddPost: async (data: PostType) => {
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const post = new Post(data.content, data.createdAt, '', data.userId, data.communityId, data.type, images, video)
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

    return { message: 'Đăng bài thành công', status: 201, post: result[0] }
  },
  handleGetLikesPost: async (postId: number) => {
    const ep = new ExtraPost()
    const result = await ep.getAllById(postId, 'like')
    return result
  },
  handleLikePost: async (userId: number, postId: number, type: string, receiverId: number) => {
    const ep = new ExtraPost(userId, postId, type)
    const { insertId } = await ep.insert()
    if (userId !== receiverId) {
      const notify = new Notify('unseen', 'likedPost', insertId, receiverId)
      await notify.insert()
    }
    return { status: 201, message: 'Liked post successfully' }
  },
  handleDeletePost: async (id: number) => {
    const post = new Post()
    await post.delete(id)
    return { message: 'Xoá bài viết thành công', status: 201 }
  },
  handleUnlikePost: async (id: number) => {
    const ep = new ExtraPost()
    await ep.delete(id)
    const notify = new Notify()
    await notify.delete(id, 'likedPost')
    return { status: 201, message: 'Unlike post successfully' }
  },
  handleUpdatePost: async (id: number, data: PostType) => {
    const post = new Post()
    const sql = 'UPDATE `posts` SET content=?,modifiedAt=?,images=?,video=?,type=? WHERE id=?'
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const values = [data.content, data.modifiedAt, images, video, data.type, id]
    await post.update(sql, values)
    return { message: 'Cập nhật bài viết thành công', status: 200 }
  },
  handleGetLikes: async () => {
    const ep = new ExtraPost()
    const result = await ep.getAll()
    return result
  },
  handleSharePost: async (userId: number, postId: number, type: string) => {
    const ep = new ExtraPost(userId, postId, type)
    await ep.insert()
    return { status: 201, message: 'Shared post successfully' }
  },
  handleGetSharesPost: async (postId: number) => {
    const ep = new ExtraPost()
    const resultShare: any[] = await ep.getAllById(postId, 'share')
    const resultShareTo: any[] = await ep.getAllById(postId, 'shareTo')
    return resultShare
  }
}

export default postService

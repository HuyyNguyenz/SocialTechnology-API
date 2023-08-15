import Comment from '../models/Comment'
import Notify from '../models/Notify'
import Post from '../models/Post'
import { CommentType } from '../types/commentType'
import { PostType } from '../types/postType'

const commentService = {
  handleGetCommentList: async () => {
    const comment = new Comment()
    const result = await comment.getAll()
    return result
  },
  handleGetCommentListByPost: async (postId: number, limit: number, offset: number) => {
    const comment = new Comment()
    const result = await comment.getAllById(postId, limit, offset)
    return result
  },
  handleAddComment: async (data: CommentType) => {
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const comment = new Comment(data.content, data.createdAt, '', data.userId, data.postId, images, video)
    await comment.insert()
    const comments: CommentType[] = await comment.getAll()
    const foundComment = comments.find(
      (comment) =>
        comment.userId === data.userId &&
        comment.createdAt === data.createdAt &&
        Number(comment.postId) === Number(data.postId)
    )
    const post = new Post()
    const sql = 'SELECT * FROM posts WHERE id=?'
    const values = [data.postId]
    const foundPost: PostType[] = await post.find(sql, values)
    if (data.userId !== foundPost[0]?.userId) {
      const notify = new Notify('unseen', 'comment', Number(foundComment?.id), Number(foundPost[0]?.userId))
      await notify.insert()
    }
    return { message: 'Bình luận thành công', status: 201 }
  },
  handleDeleteComment: async (id: number) => {
    const comment = new Comment()
    await comment.delete(id)
    return { message: 'Xoá bình luận thành công', status: 201 }
  },
  handleUpdateComment: async (id: number, data: CommentType) => {
    const comment = new Comment()
    const sql = 'UPDATE `comments` SET content=?,modifiedAt=?,images=?,video=? WHERE id=?'
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const values = [data.content, data.modifiedAt, images, video, id]
    await comment.update(sql, values)
    return { message: 'Cập nhật bình luận thành công', status: 200 }
  }
}

export default commentService

import { COMMENT_MESSAGES } from '~/constants/messages'
import Comment from '../models/Comment'
import Notify from '../models/Notify'
import { CommentType } from '../types/commentType'
import { UpdateCommentReqBody } from '~/requestTypes'

const commentService = {
  handleGetCommentList: async () => {
    const comment = new Comment()
    const result = await comment.getAll()
    return result
  },
  handleGetCommentListByPost: async ({ id, limit, page }: { id: number; limit: number; page: number }) => {
    const comment = new Comment()
    const result = await comment.getAllById(id, limit, limit * (page - 1))
    return result
  },
  handleAddComment: async (userId: number, data: CommentType, authorId: number) => {
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const comment = new Comment(data.content, data.createdAt, '', userId, data.postId, images, video)
    const { insertId } = await comment.insert()
    if (userId !== authorId) {
      const notify = new Notify('unseen', 'comment', Number(insertId), authorId)
      await notify.insert()
    }
    return { message: COMMENT_MESSAGES.COMMENT_POST_SUCCESSFULLY }
  },
  handleDeleteComment: async (id: number, userId: number) => {
    const comment = new Comment()
    await comment.delete(id, userId)
    return { message: COMMENT_MESSAGES.DELETE_COMMENT_SUCCESSFULLY }
  },
  handleUpdateComment: async (id: number, data: UpdateCommentReqBody, userId: number) => {
    const comment = new Comment()
    const images = (data.images?.length as number) > 0 ? JSON.stringify(data.images) : ''
    const video = data.video?.name ? JSON.stringify(data.video) : ''
    const sql = `UPDATE comments SET ${data.content ? `content='${data.content}'` : ''}${
      data.modifiedAt ? `,modifiedAt='${data.modifiedAt}'` : ''
    }${images ? `,images='${images}'` : ''}${video ? `,video='${video}'` : ''}WHERE id=${id} AND userId=${userId}`
    await comment.update(sql, [])
    return { message: COMMENT_MESSAGES.UPDATE_COMMENT_SUCCESSFULLY }
  }
}

export default commentService

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comment_1 = __importDefault(require("~/models/Comment"));
const Notify_1 = __importDefault(require("~/models/Notify"));
const Post_1 = __importDefault(require("~/models/Post"));
const commentService = {
    handleGetCommentList: async () => {
        const comment = new Comment_1.default();
        const result = await comment.getAll();
        return result;
    },
    handleGetCommentListByPost: async (postId, limit, offset) => {
        const comment = new Comment_1.default();
        const result = await comment.getAllById(postId, limit, offset);
        return result;
    },
    handleAddComment: async (data) => {
        const images = data.images?.length > 0 ? JSON.stringify(data.images) : '';
        const video = data.video?.name ? JSON.stringify(data.video) : '';
        const comment = new Comment_1.default(data.content, data.createdAt, '', data.userId, data.postId, images, video);
        await comment.insert();
        const comments = await comment.getAll();
        const foundComment = comments.find((comment) => comment.userId === data.userId &&
            comment.createdAt === data.createdAt &&
            Number(comment.postId) === Number(data.postId));
        const post = new Post_1.default();
        const sql = 'SELECT * FROM posts WHERE id=?';
        const values = [data.postId];
        const foundPost = await post.find(sql, values);
        if (data.userId !== foundPost[0]?.userId) {
            const notify = new Notify_1.default('unseen', 'comment', Number(foundComment?.id), Number(foundPost[0]?.userId));
            await notify.insert();
        }
        return { message: 'Bình luận thành công', status: 201 };
    },
    handleDeleteComment: async (id) => {
        const comment = new Comment_1.default();
        await comment.delete(id);
        return { message: 'Xoá bình luận thành công', status: 201 };
    },
    handleUpdateComment: async (id, data) => {
        const comment = new Comment_1.default();
        const sql = 'UPDATE `comments` SET content=?,modifiedAt=?,images=?,video=? WHERE id=?';
        const images = data.images?.length > 0 ? JSON.stringify(data.images) : '';
        const video = data.video?.name ? JSON.stringify(data.video) : '';
        const values = [data.content, data.modifiedAt, images, video, id];
        await comment.update(sql, values);
        return { message: 'Cập nhật bình luận thành công', status: 200 };
    }
};
exports.default = commentService;

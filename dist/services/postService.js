"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExtraPost_1 = __importDefault(require("~/models/ExtraPost"));
const Notify_1 = __importDefault(require("~/models/Notify"));
const Post_1 = __importDefault(require("~/models/Post"));
const postService = {
    handleGetPostList: async (limit, offset) => {
        const post = new Post_1.default();
        const result = await post.getAll(limit, offset);
        return result;
    },
    handleGetPostListByUser: async (userId, limit, offset) => {
        const post = new Post_1.default();
        const result = await post.getAllById(userId, limit, offset);
        return result;
    },
    handleGetPostDetail: async (id) => {
        const post = new Post_1.default();
        const result = await post.get(id);
        return result;
    },
    handleAddPost: async (data) => {
        const images = data.images?.length > 0 ? JSON.stringify(data.images) : '';
        const video = data.video?.name ? JSON.stringify(data.video) : '';
        const post = new Post_1.default(data.content, data.createdAt, '', data.userId, data.communityId, data.type, images, video);
        const { insertId } = await post.insert();
        const result = await post.find('SELECT * FROM posts WHERE id=?', [insertId]);
        result.length > 0 &&
            Array.from(result).forEach((post) => {
                if (post.images) {
                    const images = JSON.parse(post.images);
                    post.images = images;
                }
                if (post.video) {
                    const video = JSON.parse(post.video);
                    post.video = video;
                }
            });
        return { message: 'Đăng bài thành công', status: 201, post: result[0] };
    },
    handleGetLikesPost: async (postId) => {
        const ep = new ExtraPost_1.default();
        const result = await ep.getAllById(postId, 'like');
        return result;
    },
    handleLikePost: async (userId, postId, type, receiverId) => {
        const ep = new ExtraPost_1.default(userId, postId, type);
        const { insertId } = await ep.insert();
        if (userId !== receiverId) {
            const notify = new Notify_1.default('unseen', 'likedPost', insertId, receiverId);
            await notify.insert();
        }
        return { status: 201, message: 'Liked post successfully' };
    },
    handleDeletePost: async (id) => {
        const post = new Post_1.default();
        await post.delete(id);
        return { message: 'Xoá bài viết thành công', status: 201 };
    },
    handleUnlikePost: async (id) => {
        const ep = new ExtraPost_1.default();
        await ep.delete(id);
        const notify = new Notify_1.default();
        await notify.delete(id, 'likedPost');
        return { status: 201, message: 'Unlike post successfully' };
    },
    handleUpdatePost: async (id, data) => {
        const post = new Post_1.default();
        const sql = 'UPDATE `posts` SET content=?,modifiedAt=?,images=?,video=?,type=? WHERE id=?';
        const images = data.images?.length > 0 ? JSON.stringify(data.images) : '';
        const video = data.video?.name ? JSON.stringify(data.video) : '';
        const values = [data.content, data.modifiedAt, images, video, data.type, id];
        await post.update(sql, values);
        return { message: 'Cập nhật bài viết thành công', status: 200 };
    },
    handleGetLikes: async () => {
        const ep = new ExtraPost_1.default();
        const result = await ep.getAll();
        return result;
    },
    handleSharePost: async (userId, postId, type) => {
        const ep = new ExtraPost_1.default(userId, postId, type);
        await ep.insert();
        return { status: 201, message: 'Shared post successfully' };
    },
    handleGetSharesPost: async (postId) => {
        const ep = new ExtraPost_1.default();
        const resultShare = await ep.getAllById(postId, 'share');
        const resultShareTo = await ep.getAllById(postId, 'shareTo');
        const result = [...resultShare, ...resultShareTo];
        return result;
    }
};
exports.default = postService;

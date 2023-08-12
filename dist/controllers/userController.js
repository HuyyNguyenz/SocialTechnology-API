"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("~/services/userService"));
const postService_1 = __importDefault(require("~/services/postService"));
const commentService_1 = __importDefault(require("~/services/commentService"));
const friendService_1 = __importDefault(require("~/services/friendService"));
const notifyService_1 = __importDefault(require("~/services/notifyService"));
const messageService_1 = __importDefault(require("~/services/messageService"));
const axios_1 = __importDefault(require("axios"));
const userController = {
    verifyUser: async (req, res) => {
        const { username } = req.params;
        if (username) {
            const result = await userService_1.default.handleVerifyUser(username);
            res.status(200).json(result);
        }
    },
    registerUser: async (req, res) => {
        const userData = req.body;
        if (userData) {
            const result = await userService_1.default.handleRegister(userData);
            res.status(result.status).json(result);
        }
    },
    loginUser: async (req, res) => {
        const userData = req.body;
        if (userData) {
            const result = await userService_1.default.handleLogin(userData);
            res.status(result.status).json(result);
        }
    },
    getUser: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await userService_1.default.handleGetUser(id);
            const avatar = result.data.avatar !== '' ? JSON.parse(result.data.avatar) : '';
            const backgroundImage = result.data.backgroundImage !== '' ? JSON.parse(result.data.backgroundImage) : '';
            res.status(result.status).json({ ...result.data, avatar, backgroundImage });
        }
        else {
            const userData = JSON.parse(req.headers.user);
            if (userData.id) {
                const result = await userService_1.default.handleGetUser(userData.id);
                const avatar = result.data.avatar !== '' ? JSON.parse(result.data.avatar) : '';
                const backgroundImage = result.data.backgroundImage !== '' ? JSON.parse(result.data.backgroundImage) : '';
                res.status(result.status).json({ ...result.data, avatar, backgroundImage });
            }
        }
    },
    getAllUser: async (req, res) => {
        const result = await userService_1.default.handleGetAllUser();
        result.length > 0 &&
            Array.from(result).forEach((user) => {
                if (user.avatar !== '') {
                    const avatar = JSON.parse(user.avatar);
                    user.avatar = avatar;
                }
                if (user.backgroundImage !== '') {
                    const backgroundImage = JSON.parse(user.backgroundImage);
                    user.backgroundImage = backgroundImage;
                }
            });
        res.status(200).json(result);
    },
    requestRefreshToken: async (req, res) => {
        const { refreshToken } = req.body;
        if (refreshToken) {
            const result = await userService_1.default.handleRefreshToken(refreshToken);
            res.status(result.status).json(result);
        }
    },
    searchUser: async (req, res) => {
        const { searchValue } = req.body;
        if (searchValue) {
            const result = await userService_1.default.handleSearch(searchValue);
            result.length > 0 &&
                Array.from(result).forEach((user) => {
                    if (user.avatar !== '') {
                        const avatar = JSON.parse(user.avatar);
                        user.avatar = avatar;
                    }
                    if (user.backgroundImage !== '') {
                        const backgroundImage = JSON.parse(user.backgroundImage);
                        user.backgroundImage = backgroundImage;
                    }
                });
            res.status(200).json(result);
        }
    },
    sendOtpFromMail: async (req, res) => {
        const { userEmail } = req.headers;
        if (userEmail) {
            const result = await userService_1.default.handleSendOtp(userEmail);
            res.status(result.status).json(result);
        }
    },
    permitRecoveryPassword: async (req, res) => {
        const userOtp = JSON.parse(req.headers.userOtp);
        res.status(200).json({ userOtp });
    },
    recoveryPassword: async (req, res) => {
        const { email } = req.params;
        const { password } = req.body;
        if (email && password) {
            const result = await userService_1.default.handleResetPassword(password, email);
            res.status(result.status).json(result);
        }
    },
    updateUserProfile: async (req, res) => {
        const { id } = req.params;
        if (id && req.body.id) {
            const result = await userService_1.default.handleUpdateProfile(Number(id), req.body);
            res.status(200).json(result);
        }
        else {
            const { socketId } = req.body;
            const result = await userService_1.default.handleUpdateSocketId(Number(id), socketId);
            res.status(200).json(result);
        }
    },
    updateUserState: async (req, res) => {
        const { id, state } = req.params;
        if (id && state) {
            const result = await userService_1.default.handleUpdateUserState(Number(id), state);
            res.status(200).json(result);
        }
    },
    getPostList: async (req, res) => {
        const { limit, offset } = req.params;
        const result = await postService_1.default.handleGetPostList(Number(limit), Number(offset));
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
        res.status(200).json(result);
    },
    getPostListByUser: async (req, res) => {
        const { userId, limit, offset } = req.params;
        const result = await postService_1.default.handleGetPostListByUser(Number(userId), Number(limit), Number(offset));
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
        res.status(200).json(result);
    },
    getPostDetail: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await postService_1.default.handleGetPostDetail(Number(id));
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
            res.status(200).json(result);
        }
    },
    getLikesPost: async (req, res) => {
        const { postId } = req.params;
        if (postId) {
            const result = await postService_1.default.handleGetLikesPost(Number(postId));
            res.status(200).json(result);
        }
    },
    addPost: async (req, res) => {
        const { createdAt } = req.body;
        if (createdAt) {
            const result = await postService_1.default.handleAddPost(req.body);
            res.status(result.status).json(result);
        }
    },
    likePost: async (req, res) => {
        const { userId, postId, type, receiverId } = req.body;
        if (userId && postId && type === 'like' && receiverId) {
            const result = await postService_1.default.handleLikePost(userId, postId, type, receiverId);
            res.status(result.status).json(result);
        }
    },
    deletePost: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await postService_1.default.handleDeletePost(Number(id));
            res.status(result.status).json(result);
        }
    },
    deleteLikePost: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await postService_1.default.handleUnlikePost(Number(id));
            res.status(result.status).json(result);
        }
    },
    updatePost: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await postService_1.default.handleUpdatePost(Number(id), req.body);
            res.status(result.status).json(result);
        }
    },
    getCommentList: async (req, res) => {
        const result = await commentService_1.default.handleGetCommentList();
        result.length > 0 &&
            Array.from(result).forEach((comment) => {
                if (comment.images) {
                    const images = JSON.parse(comment.images);
                    comment.images = images;
                }
                if (comment.video) {
                    const video = JSON.parse(comment.video);
                    comment.video = video;
                }
            });
        res.status(200).json(result);
    },
    getCommentListByPost: async (req, res) => {
        const { postId, limit, offset } = req.params;
        if (postId) {
            const result = await commentService_1.default.handleGetCommentListByPost(Number(postId), Number(limit), Number(offset));
            result.length > 0 &&
                Array.from(result).forEach((comment) => {
                    if (comment.images) {
                        const images = JSON.parse(comment.images);
                        comment.images = images;
                    }
                    if (comment.video) {
                        const video = JSON.parse(comment.video);
                        comment.video = video;
                    }
                });
            res.status(200).json(result);
        }
    },
    addComment: async (req, res) => {
        const { createdAt } = req.body;
        if (createdAt) {
            const result = await commentService_1.default.handleAddComment(req.body);
            res.status(result.status).json(result);
        }
    },
    deleteComment: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await commentService_1.default.handleDeleteComment(Number(id));
            res.status(result.status).json(result);
        }
    },
    updateComment: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await commentService_1.default.handleUpdateComment(Number(id), req.body);
            res.status(result.status).json(result);
        }
    },
    getFriendList: async (req, res) => {
        const result = await friendService_1.default.handleGetAllFriend();
        res.status(200).json(result);
    },
    requestMakeFriend: async (req, res) => {
        const data = req.body;
        if (data) {
            const result = await friendService_1.default.handleRequestMakeFriend(data);
            res.status(result.status).json(result);
        }
    },
    deleteFriend: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await friendService_1.default.handleDeleteFriend(Number(id));
            res.status(result.status).json(result);
        }
    },
    acceptFriend: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await friendService_1.default.handleAcceptFriend(Number(id));
            res.status(result.status).json(result);
        }
    },
    getNotifyList: async (req, res) => {
        const result = await notifyService_1.default.handleGetNotifyList();
        res.status(200).json(result);
    },
    updateNotify: async (req, res) => {
        const { id } = req.params;
        const { receiverId } = req.body;
        if (id) {
            const result = await notifyService_1.default.handleUpdateNotify(Number(id), Number(receiverId));
            res.status(result.status).json(result);
        }
    },
    getMessageList: async (req, res) => {
        const result = await messageService_1.default.handleGetMessageList();
        result.length > 0 &&
            Array.from(result).forEach((message) => {
                if (message.images) {
                    const images = JSON.parse(message.images);
                    message.images = images;
                }
                if (message.video) {
                    const video = JSON.parse(message.video);
                    message.video = video;
                }
            });
        res.status(200).json(result);
    },
    addMessage: async (req, res) => {
        const { createdAt } = req.body;
        if (createdAt) {
            const result = await messageService_1.default.handleAddMessage(req.body);
            res.status(result.status).json(result);
        }
    },
    deleteMessage: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await messageService_1.default.handleDeleteMessage(Number(id));
            res.status(result.status).json(result);
        }
    },
    updateMessage: async (req, res) => {
        const { id } = req.params;
        if (id) {
            const result = await messageService_1.default.handleUpdateMessage(Number(id), req.body);
            res.status(result.status).json(result);
        }
    },
    getArticle: async (req, res) => {
        const { link } = req.query;
        try {
            const data = (await axios_1.default.get(link)).data;
            res.status(200).json(data);
        }
        catch (error) {
            res.status(404).json({ message: 'Lỗi' });
        }
    },
    getLikes: async (req, res) => {
        const result = await postService_1.default.handleGetLikes();
        res.status(200).json(result);
    },
    sharePost: async (req, res) => {
        const { userId, postId, type } = req.body;
        if (userId && postId && type) {
            const result = await postService_1.default.handleSharePost(userId, postId, type);
            res.status(result.status).json(result);
        }
    },
    getSharesPost: async (req, res) => {
        const { postId } = req.params;
        if (postId) {
            const result = await postService_1.default.handleGetSharesPost(Number(postId));
            res.status(200).json(result);
        }
    }
};
exports.default = userController;

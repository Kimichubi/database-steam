"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
const likeService = {
    newLike: async (postId, userId, categoryId) => {
        try {
            if (!postId) {
                throw new Error("Post não existe");
            }
            if (!userId) {
                throw new Error("User não existe");
            }
            const postExists = await prisma_1.default.post.findUnique({
                where: {
                    id: postId,
                },
            });
            if (!postExists) {
                throw new Error("Post não existe");
            }
            const likeAlready = await prisma_1.default.likes.findMany({
                where: {
                    postId,
                    userId,
                },
            });
            if (likeAlready.length >= 1) {
                throw new Error("Voce já curtiu este post");
            }
            const like = await prisma_1.default.likes.create({
                data: {
                    postId,
                    userId,
                    categoryId,
                },
            });
            return like;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    postWithMoreLikes: async () => {
        try {
            const postsWithMoreLikes = await prisma_1.default.post.findMany({
                include: {
                    _count: true,
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    likes: {
                        _count: "desc",
                    },
                },
                take: 10, // Limita o número de resultados retornados (por exemplo, 10)
            });
            return postsWithMoreLikes;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    categoryWithMoreLikes: async () => {
        try {
            const categoryWithMoreLikes = await prisma_1.default.category.findMany({
                include: {
                    _count: true,
                },
                orderBy: {
                    likes: {
                        _count: "desc",
                    },
                },
                take: 10, // Limita o número de resultados retornados (por exemplo, 10)
            });
            return categoryWithMoreLikes;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userMostLikedPost: async (userId, page) => {
        try {
            if (!userId) {
                throw new Error("Usuario não cadastrado ou não encontrado!");
            }
            const take = 6;
            const skip = (page - 1) * take;
            const post = await prisma_1.default.post.findMany({
                where: {
                    likes: {
                        some: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    likes: {
                        _count: "desc",
                    },
                },
                include: {
                    _count: {
                        select: { likes: true, favorites: true },
                    },
                },
                take,
                skip,
            });
            return post;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    removeLike: async (postId, userId, categoryId) => {
        try {
            if (!postId) {
                throw new Error("Post não foi encontrado!");
            }
            const like = await prisma_1.default.likes.deleteMany({
                where: {
                    postId,
                    userId,
                    categoryId,
                },
            });
            if (like.count < 1) {
                throw new Error("Like não foi encontrado!");
            }
            return like;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
};
exports.default = likeService;

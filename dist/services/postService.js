"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
const postService = {
    newPost: async (authorId, name, fanArtUrl, categoryId) => {
        try {
            if (!categoryId || categoryId === 0) {
                throw new Error("Category não informado!");
            }
            else if (!name) {
                throw new Error("Nome não informado!");
            }
            else if (!fanArtUrl) {
                throw new Error("Url não informado!");
            }
            else if (!authorId) {
                throw new Error("Author não informado!");
            }
            const post = await prisma_1.default.post.create({
                data: {
                    fanArtUrl,
                    authorId,
                    name,
                    categoryId,
                },
            });
            return post;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    deletePost: async (userId, postId, categoryId) => {
        try {
            const post = await prisma_1.default.post.findUnique({
                where: {
                    id: postId,
                },
            });
            if (!post) {
                throw new Error("Post não encontrado");
            }
            if (post.authorId !== userId) {
                throw new Error("Post não pode ser excluido, você não é o autor");
            }
            await prisma_1.default.likes.deleteMany({
                where: {
                    postId: post.id,
                    categoryId,
                },
            });
            await prisma_1.default.favorites.deleteMany({
                where: {
                    postId: post.id,
                    categoryId,
                },
            });
            const deletedPost = await prisma_1.default.post.delete({
                where: {
                    id: postId,
                    categoryId,
                },
            });
            return deletedPost;
        }
        catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
        }
    },
    getPostsById: async (postId) => {
        try {
            if (!postId) {
                throw new Error("Por favor informe o ID do Post");
            }
            const post = await prisma_1.default.post.findUnique({
                where: {
                    id: postId,
                },
                select: {
                    name: true,
                    id: true,
                    fanArtUrl: true,
                    author: { select: { name: true } },
                    categoryId: true,
                    category: { select: { name: true } },
                    _count: true,
                },
            });
            if (!post) {
                throw new Error("Post não existe!");
            }
            return post;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    getAllPosts: async () => {
        try {
            const posts = await prisma_1.default.post.findMany({
                include: {
                    author: { select: { name: true } },
                    category: { select: { name: true } },
                    _count: true,
                },
                take: 10,
            });
            if (!posts) {
                throw new Error("Nenhumo post foi encontrado!");
            }
            return posts;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                return error.message;
            }
        }
    },
    getMostRecentlyPosts: async () => {
        try {
            const posts = await prisma_1.default.post.findMany({
                orderBy: {
                    id: "desc",
                },
                include: {
                    author: { select: { name: true } },
                    _count: true,
                },
                take: 10,
            });
            if (!posts) {
                throw new Error("Nenhumo post foi encontrado!");
            }
            return posts;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                return error.message;
            }
        }
    },
    searchPost: async (query, page, categoryId) => {
        try {
            if (!query) {
                throw new Error("Query não informada!");
            }
            const take = 6;
            const skip = (page - 1) * take;
            const searchPostParams = await prisma_1.default.post.findMany({
                where: {
                    categoryId,
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                include: {
                    _count: true,
                },
                take,
                skip,
            });
            return searchPostParams;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    getUserPosts: async (userId, page) => {
        try {
            const take = 6;
            const skip = (page - 1) * take;
            if (!userId) {
                throw new Error("User não informado");
            }
            const posts = await prisma_1.default.post.findMany({
                where: {
                    authorId: userId,
                },
                select: {
                    id: true,
                    name: true,
                    fanArtUrl: true,
                    categoryId: true,
                    _count: true,
                    author: {
                        select: { name: true, id: true },
                    },
                },
                take,
                skip,
            });
            return posts;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
};
exports.default = postService;

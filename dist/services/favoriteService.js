"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
const favoriteService = {
    newFavorite: async (postId, userId, categoryId) => {
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
            const favoriteAlready = await prisma_1.default.favorites.findMany({
                where: {
                    postId,
                    userId,
                },
            });
            if (favoriteAlready.length >= 1) {
                throw new Error("Voce já favoritou este post");
            }
            const favorite = await prisma_1.default.favorites.create({
                data: {
                    postId,
                    userId,
                    categoryId,
                },
            });
            return favorite;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    postWithMoreFavorite: async () => {
        try {
            const postWithMoreFavorites = await prisma_1.default.post.findMany({
                include: {
                    _count: true,
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    favorites: {
                        _count: "desc",
                    },
                },
                take: 10, // Limita o número de resultados retornados (por exemplo, 10)
            });
            return postWithMoreFavorites;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    categoryWithMoreFavorite: async () => {
        try {
            const categoryWithMoreFavorite = await prisma_1.default.category.findMany({
                include: {
                    _count: true,
                },
                orderBy: {
                    favorites: {
                        _count: "desc",
                    },
                },
                take: 10, // Limita o número de resultados retornados (por exemplo, 10)
            });
            return categoryWithMoreFavorite;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userMostFavoritedPost: async (userId, page) => {
        try {
            if (!userId) {
                throw new Error("Usuario não cadastrado ou não encontrado!");
            }
            const take = 6;
            const skip = (page - 1) * take;
            const post = await prisma_1.default.post.findMany({
                where: {
                    favorites: {
                        some: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    favorites: {
                        _count: "desc",
                    },
                },
                take,
                skip,
                include: {
                    _count: {
                        select: { favorites: true },
                    },
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
    removeFavorite: async (postId, userId, categoryId) => {
        try {
            if (!postId) {
                throw new Error("Post não foi encontrado!");
            }
            const favorite = await prisma_1.default.favorites.deleteMany({
                where: {
                    postId,
                    userId,
                    categoryId,
                },
            });
            if (favorite.count < 1) {
                throw new Error("Favorito não foi encontrado!");
            }
            return favorite;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
};
exports.default = favoriteService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
const categoryService = {
    newCategory: async (name, imageUrl) => {
        try {
            if (!name) {
                throw new Error("Name não informado!");
            }
            const categoryExists = await prisma_1.default.category.findUnique({
                where: {
                    name,
                },
            });
            if (categoryExists) {
                throw new Error("Categoria já existe!");
            }
            const category = await prisma_1.default.category.create({
                data: {
                    name,
                    imageUrl,
                },
            });
            return category;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    deleteCategory: async (categoryId) => {
        try {
            if (!categoryId) {
                throw new Error("categoryId não informado!");
            }
            await prisma_1.default.likes.deleteMany({
                where: {
                    categoryId,
                },
            });
            await prisma_1.default.favorites.deleteMany({
                where: {
                    categoryId,
                },
            });
            await prisma_1.default.post.deleteMany({
                where: {
                    categoryId,
                },
            });
            const category = await prisma_1.default.category.delete({
                where: {
                    id: categoryId,
                },
            });
            return category;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    getAllCategorys: async (page) => {
        try {
            const take = 10;
            const skip = (page - 1) * take;
            const category = await prisma_1.default.category.findMany({
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    _count: true,
                },
                take,
                skip,
            });
            return category;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    getOneCategory: async (categoryId, page) => {
        try {
            if (!categoryId) {
                throw new Error("Categoria não informada!");
            }
            const take = 6;
            const skip = (page - 1) * take;
            const category = await prisma_1.default.category.findUnique({
                where: {
                    id: categoryId,
                },
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    posts: {
                        select: {
                            _count: {
                                select: {
                                    likes: true,
                                    favorites: true,
                                },
                            },
                            id: true,
                            author: {
                                select: {
                                    name: true,
                                },
                            },
                            name: true,
                            fanArtUrl: true,
                        },
                        take,
                        skip,
                    },
                    _count: true,
                },
            });
            return category;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    followCategory: async (userId, categoryId) => {
        try {
            if (!userId) {
                throw new Error("Usuario não informado!");
            }
            if (!categoryId) {
                throw new Error("Categoria não informada!");
            }
            const follow = await prisma_1.default.category.update({
                where: {
                    id: categoryId,
                },
                data: {
                    followers: { connect: { id: userId } },
                },
            });
            return follow;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    searchCategory: async (query, page) => {
        try {
            if (!query) {
                throw new Error("Query não informada!");
            }
            const take = 6;
            const skip = (page - 1) * take;
            const searchCategoryParams = await prisma_1.default.category.findMany({
                where: {
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
            return searchCategoryParams;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
};
exports.default = categoryService;

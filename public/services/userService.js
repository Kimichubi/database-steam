"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codeGenerator_1 = require("../helpers/code/codeGenerator");
const emailSendler_1 = require("../helpers/emailSendler/emailSendler");
const prisma_1 = __importDefault(require("../prisma/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService = {
    findByEmail: async (email) => {
        try {
            const user = await prisma_1.default.users.findUnique({
                where: {
                    email,
                },
            });
            return user;
        }
        catch (err) {
            if (err) {
                console.error(err);
                return;
            }
        }
    },
    register: async ({ name, email, password }) => {
        try {
            const userAlready = await userService.findByEmail(email);
            if (userAlready) {
                throw new Error("Usuario já cadastrado!");
            }
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            const code = (0, codeGenerator_1.generateConfirmationCode)();
            const hashedCode = await bcrypt_1.default.hash(code, 10);
            const user = await prisma_1.default.users.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    confirmationCode: hashedCode,
                },
            });
            return user;
        }
        catch (err) {
            if (err) {
                console.error(err);
                return err;
            }
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await userService.findByEmail(email);
            if (!user) {
                throw new Error("Usuario não cadastrado");
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error("As senhas não são iguais");
            }
            const token = jsonwebtoken_1.default.sign(user, process.env.SECRET_KEY, {
                expiresIn: "24h",
            });
            return token;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    infos: async (userId) => {
        try {
            if (!userId) {
                throw new Error("Usuario não cadastrado!");
            }
            const user = await prisma_1.default.users.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    name: true,
                    email: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    getFollowingCategorys: async (userId, page) => {
        const take = 10;
        const skip = (page - 1) * take;
        try {
            if (!userId) {
                throw new Error("userId não informado");
            }
            const userFollowing = await prisma_1.default.users.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    followingCategories: {
                        take,
                        skip,
                        select: {
                            name: true,
                            id: true,
                            _count: true,
                            imageUrl: true,
                        },
                    },
                },
            });
            return userFollowing;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userFollowingOneCategory: async (userId, categoryId) => {
        try {
            if (!userId) {
                throw new Error("User não informado");
            }
            else if (!categoryId) {
                throw new Error("Category não informado");
            }
            const userIsFollowing = await prisma_1.default.category.findUnique({
                where: {
                    id: categoryId,
                },
                select: {
                    followers: {
                        where: {
                            id: userId,
                        },
                        select: {
                            name: true,
                        },
                    },
                },
            });
            if (userIsFollowing?.followers.length < 1) {
                throw new Error("Categoria não seguida");
            }
            return userIsFollowing;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    unFollowCategory: async (userId, categoryId) => {
        try {
            if (!userId) {
                throw new Error("Usuario não informado!");
            }
            if (!categoryId) {
                throw new Error("Categoria não informada!");
            }
            const unFollow = await prisma_1.default.users.update({
                where: {
                    id: userId,
                },
                data: {
                    followingCategories: {
                        disconnect: {
                            id: categoryId,
                        },
                    },
                },
                select: {
                    name: true,
                },
            });
            return unFollow;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userLikedPost: async (postId, categoryId, userId) => {
        try {
            if (!userId) {
                throw new Error("User não informado");
            }
            else if (!categoryId) {
                throw new Error("Category não informado");
            }
            else if (!postId) {
                throw new Error("Category não informado");
            }
            const userIsLiked = await prisma_1.default.likes.findMany({
                where: {
                    postId,
                    categoryId,
                    userId,
                },
            });
            if (userIsLiked?.length < 1) {
                throw new Error("Post não likado!");
            }
            return userIsLiked;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userFavoritedPost: async (postId, categoryId, userId) => {
        try {
            if (!userId) {
                throw new Error("User não informado");
            }
            else if (!categoryId) {
                throw new Error("Category não informado");
            }
            else if (!postId) {
                throw new Error("Category não informado");
            }
            const userIsFavorited = await prisma_1.default.favorites.findMany({
                where: {
                    postId,
                    categoryId,
                    userId,
                },
            });
            if (userIsFavorited?.length < 1) {
                throw new Error("Post não Favoritado!");
            }
            return userIsFavorited;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userUpdateEmailAndName: async (email, name, userId) => {
        try {
            if (!email) {
                throw new Error("Email não informado!");
            }
            else if (!name) {
                throw new Error("Nome não informado!");
            }
            else if (!userId) {
                throw new Error("User não informado!");
            }
            const userUpdate = await prisma_1.default.users.update({
                where: {
                    id: userId,
                },
                data: {
                    name,
                    email,
                },
                select: {
                    name: true,
                    email: true,
                },
            });
            return userUpdate;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userUpdatePassword: async (currentPassword, newPassword, userId) => {
        try {
            if (!currentPassword) {
                throw new Error("currentPassword não informado!");
            }
            else if (!newPassword) {
                throw new Error("newPassword não informado!");
            }
            else if (!userId) {
                throw new Error("User não informado!");
            }
            const user = await prisma_1.default.users.findUnique({
                where: {
                    id: userId,
                },
            });
            const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new Error("Senhas não são iguais!");
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            const updatedPassword = await prisma_1.default.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                },
                select: {
                    name: true,
                    email: true,
                },
            });
            return updatedPassword;
        }
        catch (error) {
            if (error instanceof Error) {
                return error;
            }
        }
    },
    userFogortPasswordSendCode: async (email) => {
        try {
            const user = await prisma_1.default.users.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new Error("Usuario não encontrado");
            }
            const code = (0, codeGenerator_1.generateConfirmationCode)();
            const hashedCode = await bcrypt_1.default.hash(code, 10);
            await prisma_1.default.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    confirmationCode: hashedCode,
                },
            });
            const sendConfirmatioN = (0, emailSendler_1.sendConfirmationEmail)(Number(code), user.email);
            return sendConfirmatioN;
        }
        catch (error) {
            return error;
        }
    },
    userConfirmCode: async (email, code) => {
        try {
            const user = await prisma_1.default.users.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new Error("Usuario não encontrado!");
            }
            else if (!code) {
                throw new Error("Codigo não foi digitado!");
            }
            const isMatch = await bcrypt_1.default.compare(code, user.confirmationCode);
            if (isMatch) {
                const newCode = (0, codeGenerator_1.generateConfirmationCode)();
                const newHashedCode = await bcrypt_1.default.hash(newCode, 10);
                const response = await prisma_1.default.users.update({
                    where: {
                        email,
                    },
                    data: {
                        confirmed: true,
                    },
                    select: {
                        confirmed: true,
                    },
                });
                await prisma_1.default.users.update({
                    where: { email },
                    data: {
                        confirmationCode: newHashedCode,
                        confirmed: false,
                    },
                });
                return response;
            }
            else {
                throw new Error("Código informado incorreto!");
            }
        }
        catch (error) {
            return error;
        }
    },
    userUpdatePasswordByEmail: async (email, newPassword) => {
        try {
            if (!email) {
                throw new Error("Informe o email!");
            }
            else if (!newPassword) {
                throw new Error("Informe a senha!");
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            const response = await prisma_1.default.users.update({
                where: {
                    email,
                },
                data: {
                    password: hashedPassword,
                },
                select: {
                    name: true,
                },
            });
            return response;
        }
        catch (error) {
            return error;
        }
    },
};
exports.default = userService;

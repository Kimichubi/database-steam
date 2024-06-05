"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const userController = {
    register: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ name, email, password }] = body;
                if (!name) {
                    throw new Error("Por favor informe o nome");
                }
                else if (!email) {
                    throw new Error("Por favor informe o email");
                }
                else if (!password) {
                    throw new Error("Por favor informe a senha");
                }
                const user = await userService_1.default.register({ name, email, password });
                if (user instanceof Error) {
                    //@ts-ignore
                    throw new Error(user.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: "Usuario criado com sucesso",
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                }
            }
        });
    },
    login: (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
                return;
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ email, password }] = body;
                const token = await userService_1.default.login({ email, password });
                if (token instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: token.message, status: res.statusCode }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: token, status: res.statusCode }));
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                    return;
                }
            }
        });
    },
    infos: async (req, res) => {
        try {
            //@ts-ignore
            const userId = req.user.id;
            const user = await userService_1.default.infos(userId);
            if (user instanceof Error) {
                throw new Error(user.message);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: user, status: res.statusCode }));
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                return;
            }
        }
    },
    folloWingCategory: async (req, res, page) => {
        try {
            //@ts-ignore
            const userId = req.user.id;
            const user = await userService_1.default.getFollowingCategorys(userId, Number(page));
            if (user instanceof Error) {
                throw new Error(user.message);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: user, status: res.statusCode }));
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                return;
            }
        }
    },
    userFollowingOneCategory: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ categoryId }] = body;
                if (!categoryId) {
                    throw new Error("Por favor informe o category");
                }
                //@ts-ignore
                const userId = req.user.id;
                const userIsFollowing = await userService_1.default.userFollowingOneCategory(userId, Number(categoryId));
                if (userIsFollowing instanceof Error) {
                    //@ts-ignore
                    throw new Error(userIsFollowing.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: userIsFollowing,
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                }
            }
        });
    },
    unFollowCategory: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ categoryId }] = body;
                if (!categoryId) {
                    throw new Error("Por favor informe o category");
                }
                //@ts-ignore
                const userId = req.user.id;
                const unfollow = await userService_1.default.unFollowCategory(userId, Number(categoryId));
                if (unfollow instanceof Error) {
                    //@ts-ignore
                    throw new Error(unfollow.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: unfollow,
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                }
            }
        });
    },
    userLikedsPosts: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ categoryId, postId }] = body;
                if (!categoryId) {
                    throw new Error("Por favor informe o category");
                }
                //@ts-ignore
                const userId = req.user.id;
                const userLikeds = await userService_1.default.userLikedPost(Number(postId), Number(categoryId), Number(userId));
                if (userLikeds instanceof Error) {
                    //@ts-ignore
                    throw new Error(userLikeds.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: userLikeds,
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                }
            }
        });
    },
    userFavoritedPost: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ categoryId, postId }] = body;
                if (!categoryId) {
                    throw new Error("Por favor informe o category");
                }
                //@ts-ignore
                const userId = req.user.id;
                const userFavorited = await userService_1.default.userFavoritedPost(Number(postId), Number(categoryId), Number(userId));
                if (userFavorited instanceof Error) {
                    //@ts-ignore
                    throw new Error(userFavorited.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: userFavorited,
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                }
            }
        });
    },
    userUpdateEmailAndName: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ email, name }] = body;
                //@ts-ignore
                const userId = req.user.id;
                const userUpdated = await userService_1.default.userUpdateEmailAndName(email, name, userId);
                if (userUpdated instanceof Error) {
                    throw new Error(userUpdated.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: userUpdated, status: res.statusCode }));
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                }
            }
        });
    },
    userUpdatePassword: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            if (err instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: err, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ currentPassword, newPassword }] = body;
                //@ts-ignore
                const userId = req.user.id;
                const userUpdated = await userService_1.default.userUpdatePassword(currentPassword, newPassword, userId);
                if (userUpdated instanceof Error) {
                    throw new Error(userUpdated.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: userUpdated, status: res.statusCode }));
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                }
            }
        });
    },
    userFogortPasswordSendCode: async (req, res) => {
        let body = [];
        req
            .on("error", (error) => {
            if (error instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error, status: res.statusCode }));
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ email }] = body;
                const response = await userService_1.default.userFogortPasswordSendCode(email);
                if (response instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: response.message,
                        status: res.statusCode,
                    }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: "Código enviado!",
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                }
            }
        });
    },
    userConfirmCode: async (req, res) => {
        let body = [];
        req
            .on("error", (error) => {
            if (error instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error, status: res.statusCode }));
                return;
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ email, confirmationCode }] = body;
                const response = await userService_1.default.userConfirmCode(email, confirmationCode);
                if (response instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: response.message,
                        status: res.statusCode,
                    }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: response,
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                    return;
                }
            }
            return;
        });
    },
    userUpdatePasswordByEmail: async (req, res) => {
        let body = [];
        req
            .on("error", (error) => {
            if (error instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error, status: res.statusCode }));
                return;
            }
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ email, newPassword }] = body;
                const response = await userService_1.default.userUpdatePasswordByEmail(email, newPassword);
                if (response instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: response.message,
                        status: res.statusCode,
                    }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    message: response,
                    status: res.statusCode,
                }));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: error.message,
                        status: res.statusCode,
                    }));
                    return;
                }
            }
            return;
        });
    },
};
exports.default = userController;

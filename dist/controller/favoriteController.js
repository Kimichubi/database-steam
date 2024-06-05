"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favoriteService_1 = __importDefault(require("../services/favoriteService"));
const favoriteController = {
    newFavorite: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: err.message, status: res.statusCode }));
            return;
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                const [{ postId, categoryId }] = body;
                //@ts-ignore
                const userId = req.user.id;
                const favorite = await favoriteService_1.default.newFavorite(Number(postId), userId, Number(categoryId));
                if (favorite instanceof Error) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: favorite.message,
                        status: res.statusCode,
                    }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: favorite, status: res.statusCode }));
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
        });
    },
    postWithMoreFavorites: async (req, res) => {
        try {
            const posts = await favoriteService_1.default.postWithMoreFavorite();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: posts, status: res.statusCode }));
            return;
        }
        catch (error) {
            if (error) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error, status: res.statusCode }));
                return;
            }
        }
    },
    userMostFavoritedPost: async (req, res, page) => {
        try {
            //@ts-ignore
            const userId = req.user.id;
            const posts = await favoriteService_1.default.userMostFavoritedPost(userId, page);
            if (posts instanceof Error) {
                throw new Error(posts.message);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: posts, status: res.statusCode }));
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error, status: res.statusCode }));
                return;
            }
        }
    },
    removeFavorite: async (req, res) => {
        let body = [];
        req
            .on("error", (err) => {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: err.message, status: res.statusCode }));
            return;
        })
            .on("data", (chunk) => {
            body.push(JSON.parse(chunk));
        })
            .on("end", async () => {
            try {
                //@ts-ignore
                const userId = req.user.id;
                const [{ postId, categoryId }] = body;
                const favorite = await favoriteService_1.default.removeFavorite(Number(postId), userId, Number(categoryId));
                if (favorite instanceof Error) {
                    throw new Error(favorite.message);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: favorite, status: res.statusCode }));
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
        });
    },
};
exports.default = favoriteController;

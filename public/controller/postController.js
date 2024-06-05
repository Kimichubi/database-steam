"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postService_1 = __importDefault(require("../services/postService"));
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const postController = {
    newPost: async (req, res) => {
        const form = (0, formidable_1.default)({ multiples: true });
        try {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        success: false,
                        message: "Failed to process upload",
                    }));
                    return;
                }
                const fanArtFile = files.fanArtUrl;
                if (!fanArtFile) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "No file uploaded" }));
                    return;
                }
                //@ts-ignore
                const oldPath = fanArtFile[0].filepath;
                const uploadDir = path_1.default.join(__dirname, "../../uploads");
                if (!fs_1.default.existsSync(uploadDir)) {
                    fs_1.default.mkdirSync(uploadDir, { recursive: true });
                } //@ts-ignore
                const newFileName = fanArtFile[0].newFilename;
                const originalName = fanArtFile[0].originalFilename;
                const newPath = path_1.default.join(uploadDir, newFileName + originalName);
                fs_1.default.rename(oldPath, newPath.replace(/\s+/g, ""), async (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Failed to save file" }));
                        return;
                    }
                    const fanArtUrl = `/uploads/${newFileName}${originalName.replace(/\s+/g, "")}`;
                    //@ts-ignore
                    if (!fields.categoryId) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            message: "Categoria não informada",
                            status: res.statusCode,
                        }));
                        return;
                    }
                    //@ts-ignore
                    const name = fields.name[0];
                    //@ts-ignore
                    const authorId = req.user.id;
                    //@ts-ignore
                    const categoryId = fields.categoryId[0];
                    //@ts-ignore
                    const categoryToNumber = Number(categoryId);
                    // Salvar as URLs dos arquivos no banco de dados
                    const post = await postService_1.default.newPost(authorId, name, fanArtUrl, 
                    //@ts-ignore
                    categoryToNumber);
                    if (post instanceof Error) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            message: post.message,
                            status: res.statusCode,
                        }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: post,
                        status: res.statusCode,
                    }));
                    return;
                });
            });
        }
        catch (err) {
            if (err instanceof Error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: err.message,
                    status: res.statusCode,
                }));
                return;
            }
        }
    },
    deletePost: async (req, res) => {
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
                const post = await postService_1.default.deletePost(userId, Number(postId), Number(categoryId));
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: post, status: res.statusCode }));
            }
            catch (error) {
                if (error instanceof Error) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                }
            }
        });
    },
    getPostsById: async (req, res) => {
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
                const [{ postId }] = body;
                const post = await postService_1.default.getPostsById(Number(postId));
                if (post instanceof Error) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: post.message, status: res.statusCode }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: post, status: res.statusCode }));
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
            return;
        });
    },
    getAllPosts: async (req, res) => {
        try {
            const response = await postService_1.default.getAllPosts();
            if (response) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: response, status: res.statusCode }));
                return;
            }
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
    getRecentPosts: async (req, res) => {
        try {
            const response = await postService_1.default.getMostRecentlyPosts();
            if (response) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: response, status: res.statusCode }));
                return;
            }
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
    searchPostParams: async (req, res, query, page) => {
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
                const [{ categoryId }] = body;
                const response = await postService_1.default.searchPost(query, page, categoryId);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: response, status: res.statusCode }));
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
            return;
        });
    },
    getUserPosts: async (req, res, page) => {
        try {
            //@ts-ignore
            const userId = req.user.id;
            const posts = await postService_1.default.getUserPosts(userId, page);
            if (posts instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: posts.message, status: res.statusCode }));
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: posts, status: res.statusCode }));
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
};
exports.default = postController;

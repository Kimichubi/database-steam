"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryService_1 = __importDefault(require("../services/categoryService"));
const formidable_1 = __importDefault(require("formidable"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const categoryController = {
    newCategory: async (req, res) => {
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
                const imagesUrl = files.imageUrl;
                if (!imagesUrl) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "No file uploaded" }));
                    return;
                }
                //@ts-ignore
                const oldPath = imagesUrl[0].filepath;
                const uploadDir = path_1.default.join(__dirname, "../../categoryImages");
                if (!fs_1.default.existsSync(uploadDir)) {
                    fs_1.default.mkdirSync(uploadDir, { recursive: true });
                } //@ts-ignore
                const newFileName = imagesUrl[0].newFilename;
                const originalName = imagesUrl[0].originalFilename;
                const newPath = path_1.default.join(uploadDir, newFileName + originalName);
                fs_1.default.rename(oldPath, newPath.replace(/\s+/g, ""), async (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Failed to save file" }));
                        return;
                    }
                    const imagesUrl = `/categoryImages/${newFileName}${originalName.replace(/\s+/g, "")}`;
                    //@ts-ignore
                    const name = fields.name[0];
                    //@ts-ignore
                    // Salvar as URLs dos arquivos no banco de dados
                    const category = await categoryService_1.default.newCategory(name, imagesUrl);
                    if (category instanceof Error) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            success: category.message,
                            message: "Failed to create category",
                        }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        success: true,
                        message: "Category created successfully",
                    }));
                });
            });
        }
        catch (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Failed to create category" }));
        }
    },
    getAllCategorys: async (req, res, page) => {
        try {
            //@ts-ignore
            const response = await categoryService_1.default.getAllCategorys(page);
            if (response instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: response.message, status: res.statusCode }));
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: response, status: res.statusCode }));
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                return;
            }
        }
    },
    getOneCategory: async (req, res, page) => {
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
                //@ts-ignore
                const userId = req.user.id;
                const response = await categoryService_1.default.getOneCategory(Number(categoryId), page);
                if (response instanceof Error) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: response.message,
                        status: res.statusCode,
                    }));
                    return;
                }
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
        });
    },
    followCategory: async (req, res) => {
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
                //@ts-ignore
                const userId = req.user.id;
                const follow = await categoryService_1.default.followCategory(userId, Number(categoryId));
                if (follow instanceof Error) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: follow.message,
                        status: res.statusCode,
                    }));
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: follow, status: res.statusCode }));
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
    deleteCategory: async (req, res) => {
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
                //@ts-ignore
                const userId = req.user.id;
                const response = await categoryService_1.default.deleteCategory(Number(categoryId));
                if (response instanceof Error) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        message: response.message,
                        status: res.statusCode,
                    }));
                    return;
                }
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
        });
    },
    searchCategoryParams: async (req, res, query, page) => {
        try {
            //@ts-ignore
            const response = await categoryService_1.default.searchCategory(query, page);
            if (response instanceof Error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: response.message, status: res.statusCode }));
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: response, status: res.statusCode }));
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: error.message, status: res.statusCode }));
                return;
            }
        }
    },
};
exports.default = categoryController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const verifyToken_1 = __importDefault(require("./token/verifyToken"));
const postController_1 = __importDefault(require("./controller/postController"));
const userController_1 = __importDefault(require("./controller/userController"));
const likeController_1 = __importDefault(require("./controller/likeController"));
const favoriteController_1 = __importDefault(require("./controller/favoriteController"));
const categoryController_1 = __importDefault(require("./controller/categoryController"));
const port = process.env.PORT;
const server = (0, http_1.createServer)(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { method, url } = req;
    //POST  no TOKEN
    if (method === "POST") {
        if (url === "/register") {
            await userController_1.default.register(req, res);
            return;
        }
        else if (url === "/login") {
            await userController_1.default.login(req, res);
            return;
        }
        else if (url === "/user/forgot") {
            await userController_1.default.userFogortPasswordSendCode(req, res);
            return;
        }
        else if (url === "/user/confirmation") {
            await userController_1.default.userConfirmCode(req, res);
            return;
        }
        else if (url === "/user/update/password/byEmail") {
            await userController_1.default.userUpdatePasswordByEmail(req, res);
            return;
        }
    }
    //GET no Token
    if (method === "GET") {
        //static
        //@ts-ignore
        if (url.startsWith("/uploads/")) {
            //@ts-ignore
            const filename = url.split("/").pop();
            //@ts-ignore
            const filePath = path_1.default.join(__dirname, "../uploads", filename);
            //@ts-ignore
            fs_1.default.access(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    //@ts-ignore
                    const fileStream = fs_1.default.createReadStream(filePath);
                    fileStream.pipe(res);
                }
            });
            return;
        }
        else if (url === "/get/posts") {
            await postController_1.default.getAllPosts(req, res);
            return;
        }
        else if (url === "/posts/likes") {
            await likeController_1.default.postWithMoreLike(req, res);
            return;
        }
        else if (url === "/posts/favoriteds") {
            await favoriteController_1.default.postWithMoreFavorites(req, res);
            return;
        }
        else if (url?.startsWith("/categoryImages/")) {
            const filename = url.split("/").pop();
            //@ts-ignore
            const filePath = path_1.default.join(__dirname, "../categoryImages", filename);
            //@ts-ignore
            fs_1.default.access(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    //@ts-ignore
                    const fileStream = fs_1.default.createReadStream(filePath);
                    fileStream.pipe(res);
                }
            });
            return;
        }
    }
    //TOKEN
    (0, cors_1.default)()(req, res, async () => {
        //This is the way to searchParams in NodeJs
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathName = parsedUrl.pathname;
        const queryParams = parsedUrl.searchParams;
        const { method, url } = req;
        (0, verifyToken_1.default)(req, res, async () => {
            //POST with TOKEN
            if (method === "POST") {
                if (url === "/upload") {
                    await postController_1.default.newPost(req, res);
                    return;
                }
                else if (url === "/posts/id") {
                    await postController_1.default.getPostsById(req, res);
                    return;
                }
                else if (url === "/like") {
                    await likeController_1.default.newLike(req, res);
                    return;
                }
                else if (url === "/favorite") {
                    await favoriteController_1.default.newFavorite(req, res);
                    return;
                }
                else if (url === "/new/category") {
                    await categoryController_1.default.newCategory(req, res);
                }
                else if (pathName === "/category/getOne" && queryParams.has("page")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    await categoryController_1.default.getOneCategory(req, res, page);
                    return;
                }
                else if (url === "/category/follow") {
                    await categoryController_1.default.followCategory(req, res);
                    return;
                }
                else if (url === "/user/isFollowing") {
                    await userController_1.default.userFollowingOneCategory(req, res);
                    return;
                }
                else if (url === "/user/unfollow") {
                    await userController_1.default.unFollowCategory(req, res);
                    return;
                }
                else if (url === "/like/delete") {
                    await likeController_1.default.removeLike(req, res);
                    return;
                }
                else if (url === "/favorite/delete") {
                    await favoriteController_1.default.removeFavorite(req, res);
                    return;
                }
                else if (url === "/user/likes/posts") {
                    await userController_1.default.userLikedsPosts(req, res);
                    return;
                }
                else if (url === "/user/favorited/posts") {
                    await userController_1.default.userFavoritedPost(req, res);
                    return;
                }
                else if (pathName === "/post/search" &&
                    queryParams.has("page") &&
                    queryParams.has("query")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    //@ts-ignore
                    const query = queryParams.get("query")?.toString();
                    await postController_1.default.searchPostParams(req, res, query, page);
                    return;
                }
                else if (url === "/post/delete") {
                    await postController_1.default.deletePost(req, res);
                    return;
                }
                return;
            }
            //GET with TOKEN
            if (method === "GET") {
                //@ts-ignore
                if (url.startsWith("/uploads/")) {
                    //@ts-ignore
                    const filename = url.split("/").pop();
                    //@ts-ignore
                    const filePath = path_1.default.join(__dirname, "../uploads", filename);
                    //@ts-ignore
                    fs_1.default.access(filePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            //@ts-ignore
                            const fileStream = fs_1.default.createReadStream(filePath);
                            fileStream.pipe(res);
                        }
                    });
                    return;
                }
                else if (pathName === "/posts/user/likes" &&
                    queryParams.has("page")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    await likeController_1.default.userMostLikedPost(req, res, page);
                    return;
                }
                else if (pathName === "/posts/user/favorited" &&
                    queryParams.has("page")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    await favoriteController_1.default.userMostFavoritedPost(req, res, page);
                    return;
                }
                else if (url === "/user/infos") {
                    await userController_1.default.infos(req, res);
                    return;
                }
                else if (url === "/get/posts/recently") {
                    await postController_1.default.getRecentPosts(req, res);
                    return;
                }
                else if (pathName === "/category/all" && queryParams.has("page")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    await categoryController_1.default.getAllCategorys(req, res, page);
                    return;
                }
                else if (pathName === "/user/following" && queryParams.has("page")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    await userController_1.default.folloWingCategory(req, res, page);
                    return;
                }
                else if (pathName === "/category/search" &&
                    queryParams.has("page") &&
                    queryParams.has("query")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    //@ts-ignore
                    const query = queryParams.get("query")?.toString();
                    await categoryController_1.default.searchCategoryParams(req, res, query, Number(page));
                    return;
                }
                else if (pathName === "/posts/getUser/posts" &&
                    queryParams.has("page")) {
                    //@ts-ignore
                    const page = parseInt(queryParams.get("page")) || 1;
                    await postController_1.default.getUserPosts(req, res, page);
                    return;
                }
            }
            //PUT WITH TOKEN
            if (method === "PUT") {
                if (url === "/user/update") {
                    await userController_1.default.userUpdateEmailAndName(req, res);
                    return;
                }
                else if (url === "/user/update/password") {
                    await userController_1.default.userUpdatePassword(req, res);
                    return;
                }
            }
            //DELETE with TOKEN
            if (method === "DELETE") {
                if (url === "/category/delete") {
                    await categoryController_1.default.deleteCategory(req, res);
                }
                return;
            }
        });
        return;
    });
});
server.listen(port, () => {
    console.log(`Server running at Port ${port}`);
    console.log("Database Prisma");
});
exports.default = server;

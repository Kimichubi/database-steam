import { createServer } from "http";
import userController from "./controller/userController";
import cors from "cors";
import { verifyToken } from "./token/verifyToken";
import postController from "./controller/postController";
import path from "path";
import fs from "fs";
import likeController from "./controller/likeController";
import favoriteController from "./controller/favoriteController";
import categoryController from "./controller/categoryController";
import url from "url";
const hostname = "localhost";
const port = 8080;

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { method, url } = req;
  //POST  no TOKEN
  if (method === "POST") {
    if (url === "/register") {
      await userController.register(req, res);
      return;
    } else if (url === "/login") {
      await userController.login(req, res);
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
      const filePath = path.join(__dirname, "/uploads", filename);

      //@ts-ignore
      fs.access(filePath, (err) => {
        if (err) {
          console.log(err);
        } else {
          //@ts-ignore
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        }
      });
      return;
    } else if (url === "/get/posts") {
      await postController.getAllPosts(req, res);
      return;
    } else if (url === "/posts/likes") {
      await likeController.postWithMoreLike(req, res);
      return;
    } else if (url === "/posts/favoriteds") {
      await favoriteController.postWithMoreFavorites(req, res);
      return;
    } else if (url?.startsWith("/categoryImages/")) {
      const filename = url.split("/").pop();
      //@ts-ignore
      const filePath = path.join(__dirname, "/categoryImages", filename);

      //@ts-ignore
      fs.access(filePath, (err) => {
        if (err) {
          console.log(err);
        } else {
          //@ts-ignore
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        }
      });
      return;
    }
  }

  //TOKEN
  cors()(req, res, async () => {
    //This is the way to searchParams in NodeJs
    const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
    const pathName = parsedUrl.pathname;
    const queryParams = parsedUrl.searchParams;

    const { method, url } = req;
    verifyToken(req, res, async () => {
      //POST with TOKEN
      if (method === "POST") {
        if (url === "/upload") {
          await postController.newPost(req, res);
          return;
        } else if (url === "/posts/id") {
          await postController.getPostsById(req, res);
          return;
        } else if (url === "/like") {
          await likeController.newLike(req, res);
          return;
        } else if (url === "/favorite") {
          await favoriteController.newFavorite(req, res);
          return;
        } else if (url === "/new/category") {
          await categoryController.newCategory(req, res);
        } else if (url === "/category/getOne") {
          await categoryController.getOneCategory(req, res);
          return;
        } else if (url === "/category/follow") {
          await categoryController.followCategory(req, res);
          return;
        } else if (url === "/user/isFollowing") {
          await userController.userFollowingOneCategory(req, res);
          return;
        } else if (url === "/user/unfollow") {
          await userController.unFollowCategory(req, res);
          return;
        } else if (url === "/like/delete") {
          await likeController.removeLike(req, res);
          return;
        } else if (url === "/favorite/delete") {
          await favoriteController.removeFavorite(req, res);
          return;
        } else if (url === "/user/likes/posts") {
          await userController.userLikedsPosts(req, res);
          return;
        } else if (url === "/user/favorited/posts") {
          await userController.userFavoritedPost(req, res);
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
          const filePath = path.join(__dirname, "/uploads", filename);

          //@ts-ignore
          fs.access(filePath, (err) => {
            if (err) {
              console.log(err);
            } else {
              //@ts-ignore
              const fileStream = fs.createReadStream(filePath);
              fileStream.pipe(res);
            }
          });
          return;
        } else if (url === "/posts/user/likes") {
          await likeController.userMostLikedPost(req, res);
          return;
        } else if (url === "/posts/user/favorited") {
          await favoriteController.userMostFavoritedPost(req, res);
          return;
        } else if (url === "/user/infos") {
          await userController.infos(req, res);
          return;
        } else if (url === "/get/posts/recently") {
          await postController.getRecentPosts(req, res);
          return;
        } else if (pathName === "/category/all" && queryParams.has("page")) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          await categoryController.getAllCategorys(req, res, page);
          return;
        } else if (pathName === "/user/following" && queryParams.has("page")) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          await userController.folloWingCategory(req, res, page);
          return;
        }
      }
      //PUT WITH TOKEN
      if (method === "PUT") {
        if (url === "/user/update") {
          await userController.userUpdateEmailAndName(req, res);
          return;
        } else if (url === "/user/update/password") {
          await userController.userUpdatePassword(req, res);
          return;
        }
      }
      //DELETE with TOKEN
      if (method === "DELETE") {
        if (url === "/post/delete") {
          await postController.deletePost(req, res);
          return;
        } else if (url === "/category/delete") {
          await categoryController.deleteCategory(req, res);
        }
        return;
      }
    });

    return;
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at Port ${port}`);
  console.log("Database Prisma");
});

export default server;

import { createServer } from "http";
import userController from "./controller/userController";
import cors from "cors";
import { verifyToken } from "./token/verifyToken";
import postController from "./controller/postController";
import path from "path";
import fs from "fs";
import likeController from "./controller/likeController";
import favoriteController from "./controller/favoriteController";
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
    }
  }

  //TOKEN
  cors()(req, res, async () => {
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
        }
      }
      //DELETE with TOKEN
      if (method === "DELETE") {
        if (url === "/post/delete") {
          await postController.deletePost(req, res);
          return;
        } else if (url === "/like/delete") {
          await likeController.removeLike(req, res);
          return;
        } else if (url === "/favorite/delete") {
          await favoriteController.removeFavorite(req, res);
          return;
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

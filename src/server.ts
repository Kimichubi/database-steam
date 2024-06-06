import { createServer } from "http";
import cors from "cors";
import path from "path";
import fs from "fs";
import verifyToken from "./token/verifyToken";
import postController from "./controller/postController";
import userController from "./controller/userController";
import likeController from "./controller/likeController";
import favoriteController from "./controller/favoriteController";
import categoryController from "./controller/categoryController";

const hostname = "localhost";

const server = createServer(async (req, res) => {
  cors()(req, res, async () => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
    const pathName = parsedUrl.pathname;
    const queryParams = parsedUrl.searchParams;
    const { method, url } = req;

    //@ts-ignore
    // Helper function to serve static files
    const serveStaticFile = (filePath) => {
      console.log(filePath);
      fs.access(filePath, (err) => {
        if (err) {
          console.log(err);
          res.statusCode = 404;
          res.end("File not found");
          return;
        } else {
          const destinationPath =
            "/opt/render/project/src/categoryImages/" +
            path.basename(filePath) +
            "bg3.jpg"; // Define o caminho de destino
          fs.copyFile(filePath, destinationPath, (err) => {
            // Copia o arquivo para o destino
            if (err) {
              console.error("Error copying file:", err);
              res.statusCode = 500;
              res.end("Internal Server Error");
              return;
            }
            // Remove o arquivo de origem após a cópia bem-sucedida
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
                res.statusCode = 500;
                res.end("Internal Server Error");
                return;
              }
              console.log("File moved successfully");
              // Envie a resposta após a cópia e exclusão bem-sucedidas
              res.statusCode = 200;
              res.end("File moved successfully");
            });
          });
        }
      });
    };

    // Helper function to copy a file
    //@ts-ignore
    const copyFile = (source, destination) => {
      fs.copyFile(source, destination, (err) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.end("Internal Server Error");
          return;
        } else {
          console.log("File copied successfully.");
        }
      });
    };

    // Routes without token verification
    if (method === "POST") {
      if (url === "/register") {
        await userController.register(req, res);
        return;
      } else if (url === "/login") {
        await userController.login(req, res);
        return;
      } else if (url === "/user/forgot") {
        await userController.userFogortPasswordSendCode(req, res);
        return;
      } else if (url === "/user/confirmation") {
        await userController.userConfirmCode(req, res);
        return;
      } else if (url === "/user/update/password/byEmail") {
        await userController.userUpdatePasswordByEmail(req, res);
        return;
      }
    }

    if (method === "GET") {
      if (pathName.startsWith("/uploads/")) {
        //@ts-ignore
        const filename = url.split("/").pop(); //@ts-ignore
        const filePath = path.join(__dirname, "../uploads", filename);
        serveStaticFile(filePath);
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
      } else if (pathName.startsWith("/categoryImages/")) {
        //@ts-ignore
        const filename = url.split("/").pop(); //@ts-ignore
        const filePath = path.join(__dirname, "../categoryImages", filename);
        serveStaticFile(filePath);
        return;
      } else if (url === "/") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: "Hello world", status: res.statusCode })
        );
        return;
      }
    }

    // Routes with token verification
    verifyToken(req, res, async () => {
      const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
      const pathName = parsedUrl.pathname;
      const queryParams = parsedUrl.searchParams;
      const { method, url } = req;

      if (method === "POST") {
        if (url === "/upload") {
          const tempFilePath = "path/to/temporary/file"; // Replace with the temporary file path
          const destinationFilePath = "path/to/destination/file"; // Replace with the destination file path
          copyFile(tempFilePath, destinationFilePath);
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
          return;
        } else if (pathName === "/category/getOne" && queryParams.has("page")) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          await categoryController.getOneCategory(req, res, page);
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
        } else if (
          pathName === "/post/search" &&
          queryParams.has("page") &&
          queryParams.has("query")
        ) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          const query = queryParams.get("query")?.toString(); //@ts-ignore
          await postController.searchPostParams(req, res, query, page);
          return;
        } else if (url === "/post/delete") {
          await postController.deletePost(req, res);
          return;
        }
      }

      if (method === "GET") {
        //@ts-ignore
        if (url.startsWith("/uploads/")) {
          //@ts-ignore
          const filename = url.split("/").pop(); //@ts-ignore
          const filePath = path.join(__dirname, "../uploads", filename);
          serveStaticFile(filePath);
          return;
        } else if (
          pathName === "/posts/user/likes" &&
          queryParams.has("page")
        ) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          await likeController.userMostLikedPost(req, res, page);
          return;
        } else if (
          pathName === "/posts/user/favorited" &&
          queryParams.has("page")
        ) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          await favoriteController.userMostFavoritedPost(req, res, page);
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
        } else if (
          pathName === "/category/search" &&
          queryParams.has("page") &&
          queryParams.has("query")
        ) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          const query = queryParams.get("query")?.toString();
          await categoryController.searchCategoryParams(
            req,
            res,
            //@ts-ignore
            query,
            Number(page)
          );
          return;
        } else if (
          pathName === "/posts/getUser/posts" &&
          queryParams.has("page")
        ) {
          //@ts-ignore
          const page = parseInt(queryParams.get("page")) || 1;
          await postController.getUserPosts(req, res, page);
          return;
        }
      }

      if (method === "PUT") {
        if (url === "/user/update") {
          await userController.userUpdateEmailAndName(req, res);
          return;
        } else if (url === "/user/update/password") {
          await userController.userUpdatePassword(req, res);
          return;
        }
      }

      if (method === "DELETE") {
        if (url === "/category/delete") {
          await categoryController.deleteCategory(req, res);
          return;
        }
        return;
      }
    });
  });
}).listen(process.env.PORT ? Number(process.env.PORT) : 8080);

export default server;

import { createServer } from "http";
import userPost from "./router/userPost";
import { verifyToken } from "./token/verifyToken";
import { postPost } from "./router/postPost";
import cors from "cors";
import { likeRoute } from "./router/likeRoutes";
import { URL } from "url";

const hostname = "localhost";
const port = 3000 || 8080;

const server = createServer(async (req, res) => {
  //METHOD = POST sem TOKEN
  if (req.method === "POST") {
    if (req.url === "/register") {
      await userPost.register(req, res);
      return;
    } else if (req.url === "/login") {
      await userPost.login(req, res);
      return;
    }
  }

  //METODOS COM TOKEN
  cors()(req, res, async () => {
    //Verificar se o user tem o TOKEN
    verifyToken(req, res, async () => {
      //METODOS POST
      if (req.method === "POST") {
        const url = new URL(`http://${req.headers.host}${req.url}`);
        const id = url.searchParams.get("id");
        //      /uploads
        if (req.url === "/upload") {
          await postPost.newPost(req, res);
          return;
        } //      /like?id=${id}
        else if (req.url === `/like?id=${id}`) {
          await likeRoute.likeRoute(req, res, id!);
          return;
        }
        return;
      } //METODOS GET
      else if (req.method === "GET") {
        //  /posts
        if (req.url === "/posts") {
          await postPost.getAllPost(req, res);
          return;
        } else if (req.url === "/posts/likeds") {
          await likeRoute.getPostWithMoreLike(req, res);
          return;
        } else if (req.url === "/posts/user/likeds") {
          await likeRoute.getPostWithMoreLikeUser(req, res);
          return;
        }
        return;
      } else if (req.method === "DELETE") {
        const url = new URL(`http://${req.headers.host}${req.url}`);
        const id = url.searchParams.get("id");
        if (req.url === `/like/delete?id=${id}`) {
          await likeRoute.likeToRemove(req, res, Number(id));
          return;
        }
      }
      return;
    });
  });
  return;
});

server.listen(port, hostname, () => {
  console.log(`Server running at Port ${port}`);
  console.log("Database Prisma");
});

export default server;

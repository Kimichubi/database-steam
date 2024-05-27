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
  //POSTS METHODS without Token
  if (req.method === "POST") {
    if (req.url === "/register") {
      await userPost.register(req, res);
      return;
    } else if (req.url === "/login") {
      await userPost.login(req, res);
      return;
    }
  }

  cors()(req, res, async () => {
    verifyToken(req, res, async () => {
      if (req.method === "POST") {
        const url =  new URL(`http://${req.headers.host}${req.url}`);
        const id =  url.searchParams.get("id");

        if (req.url === "/upload") {
          await postPost.newPost(req, res);
          return;
        } else if (req.url === `/like?id=${id}`) {
          await likeRoute.likeRoute(req, res, id!);
          return;
        }
      } else if (req.method === "GET") {
        if (req.url === "/posts") {
          await postPost.getAllPost(req, res);
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

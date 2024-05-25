import { createServer } from "http";
import userPost from "./router/userPost";
import { verifyToken } from "./token/verifyToken";
import { postPost } from "./router/postPost";
import cors from "cors";
const hostname = "localhost";
const port = 3000 || 8080;

const server = createServer(async (req, res) => {
  //POSTS METHODS without Token
  if (req.method === "POST") {
    if (req.url === "/register") {
      await userPost.register(req, res);
    } else if (req.url === "/login") {
      await userPost.login(req, res);
    }
    return;
  }

  //@ts-ignore

  cors()(req, res, async () => {
    verifyToken(req, res, async () => {
      if (req.method === "POST") {
        if (req.url === "/upload") {
          await postPost.newPost(req, res);
        }
        return;
      } else if (req.method === "GET") {
        if (req.url === "/posts") {
          await postPost.getAllPost(req, res);
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

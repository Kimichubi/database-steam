import { createServer } from "http";
import prisma from "./prisma/prisma";
import userPost from "./router/userPost";
import { verifyToken } from "./token/verifyToken";

const hostname = "localhost";
const port = 3000 || 8080;

const server = createServer(async (req, res) => {
  //POSTS METHODS without Token
  await userPost.register(req, res);
  await userPost.login(req, res);
  if (req.method === "GET" && req.url === "/try") {
    verifyToken(req, res, async () => {
      res.statusCode = 200;
      //@ts-ignore
      res.end("Acesso permitido" + " " + req.user.name);
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at Port ${port}`);
  console.log("Database Prisma");
});

export default server;

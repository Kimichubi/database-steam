import { createServer } from "http";
import prisma from "./prisma/prisma";
import userPost from "./router/userPost";

const hostname = "localhost";
const port = 3000 || 8080;

const server = createServer(async (req, res) => {
  //POSTS METHODS
  await userPost.register(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at Port ${port}`);
  console.log("Database Prisma");
});

export default server;

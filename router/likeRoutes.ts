import { IncomingMessage, Server, ServerResponse } from "http";

import { likeController } from "../controller/likeController";
import prisma from "../prisma/prisma";

export const likeRoute = {
  likeRoute: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      let body: any = [];
      req
        .on("error", (error) => {
          console.log(error);
        })
        .on("data", async (chunk) => {
          body.push(JSON.parse(chunk));
          const [{ postId }] = body;
          const post = await prisma.post.findUnique({
            where: {
              id: Number(postId),
            },
          });
          const like = await likeController.like(req, res, postId);

          if (like!) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: `Like adicionado no post ${post?.name}`,
                status: res.statusCode,
              })
            );
          }
        });

      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  likeToRemove: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      let body: any = [];
      req
        .on("error", (error) => {
          console.log(error);
        })
        .on("data", async (chunk) => {
          body.push(JSON.parse(chunk));
          const [{ postId }] = body;
          const response = await likeController.removeLike(req, res, postId);
          if (response) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: response, status: res.statusCode })
            );
          }
        });

      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getPostWithMoreLike: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await likeController.postsWithMoreLikes(req, res);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: response, status: res.statusCode }));

      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getPostWithMoreLikeUser: async (
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    try {
      const response = await likeController.postsWithMoreLikesUser(req, res);
      if (response) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: response, status: res.statusCode }));
        return;
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error }));
        return;
      }
    }
  },
};

import { IncomingMessage, ServerResponse } from "http";

import { likeController } from "../controller/likeController";
import prisma from "../prisma/prisma";

export const likeRoute = {
  likeRoute: async (
    req: IncomingMessage,
    res: ServerResponse,
    postId: number | string
  ) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
      });
      const like = await likeController.like(req, res, postId);

      if (like!) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            message: `Like adicionado no post ${post?.name}`,
            status: res.statusCode,
          })
        );
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getPostWithMoreLike: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await likeController.postsWithMoreLikes(req, res);

      res.statusCode = 200;
      res.end(JSON.stringify({ message: response, status: res.statusCode }));

      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
};

import { IncomingMessage, ServerResponse } from "http";

import { likeController } from "../controller/likeController";

export const likeRoute = {
  likeRoute: async (
    req: IncomingMessage,
    res: ServerResponse,
    postId: number | string
  ) => {
    try {
      await likeController.like(req, res, postId);
      res.statusCode = 200;
      res.end(
        JSON.stringify({ message: "Like adicionado", status: res.statusCode })
      );
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
      }
    }
  },
};

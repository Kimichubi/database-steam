import { IncomingMessage, ServerResponse } from "http";
import likeService from "../services/likeService";

const likeController = {
  newLike: async (req: IncomingMessage, res: ServerResponse) => {
    let body: any = [];

    req
      .on("error", (err) => {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: err.message, status: res.statusCode })
        );
        return;
      })
      .on("data", (chunk) => {
        body.push(JSON.parse(chunk));
      })
      .on("end", async () => {
        try {
          const [{ postId, categoryId }] = body;
          //@ts-ignore
          const userId = req.user.id;

          const like = await likeService.newLike(
            Number(postId),
            userId,
            Number(categoryId)
          );

          if (like instanceof Error) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: like.message, status: res.statusCode })
            );
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: like, status: res.statusCode }));
          return;
        } catch (error) {
          if (error instanceof Error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: error.message, status: res.statusCode })
            );
            return;
          }
        }
      });
  },
  postWithMoreLike: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const posts = await likeService.postWithMoreLikes();

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: posts, status: res.statusCode }));
      return;
    } catch (error) {
      if (error) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  userMostLikedPost: async (
    req: IncomingMessage,
    res: ServerResponse,
    page: number
  ) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const posts = await likeService.userMostLikedPost(userId, page);
      if (posts instanceof Error) {
        throw new Error(posts.message);
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: posts, status: res.statusCode }));
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  removeLike: async (req: IncomingMessage, res: ServerResponse) => {
    let body: any = [];
    req
      .on("error", (err) => {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: err.message, status: res.statusCode })
        );
        return;
      })
      .on("data", (chunk) => {
        body.push(JSON.parse(chunk));
      })
      .on("end", async () => {
        try {
          //@ts-ignore
          const userId = req.user.id;
          const [{ postId, categoryId }] = body;
          const like = await likeService.removeLike(
            Number(postId),
            userId,
            Number(categoryId)
          );

          if (like instanceof Error) {
            throw new Error(like.message);
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: like, status: res.statusCode }));
          return;
        } catch (error) {
          if (error instanceof Error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: error.message, status: res.statusCode })
            );
            return;
          }
        }
      });
  },
};

export default likeController;

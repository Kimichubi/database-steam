import { IncomingMessage, ServerResponse } from "http";
import favoriteService from "../services/favoriteService";

const favoriteController = {
  newFavorite: async (req: IncomingMessage, res: ServerResponse) => {
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

          const favorite = await favoriteService.newFavorite(
            Number(postId),
            userId,
            Number(categoryId)
          );

          if (favorite instanceof Error) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: favorite.message,
                status: res.statusCode,
              })
            );
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: favorite, status: res.statusCode })
          );
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
  postWithMoreFavorites: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const posts = await favoriteService.postWithMoreFavorite();

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
  userMostFavoritedPost: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const posts = await favoriteService.userMostFavoritedPost(userId);
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
  removeFavorite: async (req: IncomingMessage, res: ServerResponse) => {
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
          const favorite = await favoriteService.removeFavorite(
            Number(postId),
            userId,
            Number(categoryId)
          );

          if (favorite instanceof Error) {
            throw new Error(favorite.message);
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: favorite, status: res.statusCode })
          );
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

export default favoriteController;

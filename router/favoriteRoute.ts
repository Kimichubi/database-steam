import { IncomingMessage, ServerResponse } from "http";
import prisma from "../prisma/prisma";
import { favoriteController } from "../controller/favoriteController";

export const favoriteRoute = {
  favoriteRoute: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      let body: any = [];
      req
        .on("error", (error) => {
          console.log(error);
        })
        .on("data", async (chunk) => {
          body.push(JSON.parse(chunk));
          const [{ postId }] = body;
          if (!postId) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: `Post Id não informado`,
                status: res.statusCode,
              })
            );
            return;
          }
          const post = await prisma.post.findUnique({
            where: {
              id: Number(postId),
            },
          });
          const favorite = await favoriteController.favorite(req, res, postId);

          if (favorite!) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: `Favorito adicionado no post ${post?.name}`,
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
  favoriteToRemove: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      let body: any = [];
      req
        .on("error", (error) => {
          console.log(error);
        })
        .on("data", async (chunk) => {
          body.push(JSON.parse(chunk));
          const [{ postId }] = body;
          const response = await favoriteController.removeFavorite(
            req,
            res,
            Number(postId)
          );
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
  getPostWithMoreFavorites: async (
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    try {
      const response = await favoriteController.postsWithMoreFavorites(
        req,
        res
      );

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
  getPostWithMoreFavoritesUser: async (
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    try {
      const response = await favoriteController.postsWithMoreFavoritesUser(
        req,
        res
      );
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

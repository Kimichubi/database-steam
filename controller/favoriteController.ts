import { IncomingMessage, ServerResponse } from "http";
import { favoriteService } from "../services/favoriteService";

export const favoriteController = {
  favorite: async (
    req: IncomingMessage,
    res: ServerResponse,
    postId: number | string
  ) => {
    try {
      //@ts-ignore
      const userId = req.user.id;

      if (!userId || !postId) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Post id ou user id não informados",
            status: res.statusCode,
          })
        );
        return;
      }

      const favorite = await favoriteService.favorite(
        Number(postId),
        userId,
        res
      );

      return favorite;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  removeFavorite: async (
    req: IncomingMessage,
    res: ServerResponse,
    postId: number
  ) => {
    try {
      //@ts-ignore
      const userId = req.user.id;

      const response = await favoriteService.deleteFavorite(
        postId,
        userId,
        res
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  postsWithMoreFavorites: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await favoriteService.getPostWithMoreFavorites(res);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  postsWithMoreFavoritesUser: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const response = await favoriteService.getPostWithMoreFavoritesUser(
        res,
        userId
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error }));
        return;
      }
    }
  },
};

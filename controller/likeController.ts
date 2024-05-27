import { IncomingMessage, ServerResponse } from "http";
import { likeService } from "../services/likeService";

export const likeController = {
  like: async (
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

      const like = await likeService.like(Number(postId), userId, res);

      return like;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  postsWithMoreLikes: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await likeService.getPostWithMoreLikes(res);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
};

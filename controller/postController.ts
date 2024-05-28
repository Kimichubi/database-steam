import { IncomingMessage, Server, ServerResponse } from "http";
import { postService } from "../services/postService";

export const postController = {
  newPost: async (
    name: string,
    imagePath: string | null,
    author: number,
    res: ServerResponse
  ) => {
    try {
      if (!imagePath || !name) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            message: "Imagem ou nome não foram providos!",
            status: res.statusCode,
          })
        );
        return;
      }
      // Pass both name and image path to the service
      await postService.newPost(name, imagePath, author);
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return;
      }
      return;
    }
  },
  postToRemove: async (
    req: IncomingMessage,
    res: ServerResponse,
    postId: number
  ) => {
    try {
      const postDeleted = await postService.postToRemove(postId, res);

      return postDeleted;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  allPosts: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const posts = await postService.getPosts();

      return posts;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return;
      }
    }
  },
};

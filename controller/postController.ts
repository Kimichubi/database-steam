import { IncomingMessage, ServerResponse } from "http";
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

      res.statusCode = 201;
      res.end(
        JSON.stringify({
          message: "Image uploaded successfully",
          status: res.statusCode,
        })
      );
      return;
    } catch (error) {
      console.error("Error creating post:", error);
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: error,
          status: res.statusCode,
        })
      );
      return;
    }
  },
  allPosts: async (req: IncomingMessage, res: ServerResponse) => {
    const posts = await postService.getPosts();
    try {
      req.on("end", () => {});
      res.end(JSON.stringify({ posts, status: res.statusCode }));
      return;
    } catch (error) {
      req.on("end", () => {});
      res.end(JSON.stringify({ message: error, status: res.statusCode }));
      return;
    }
  },
};

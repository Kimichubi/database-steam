import { IncomingMessage, ServerResponse } from "http";
import postService from "../services/postService";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const postController = {
  newPost: async (req: IncomingMessage, res: ServerResponse) => {
    const form = formidable({ multiples: true });

    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Failed to process upload",
            })
          );
          return;
        }

        const fanArtFile = files.fanArtUrl;
        if (!fanArtFile) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "No file uploaded" })
          );
          return;
        }
        //@ts-ignore
        const oldPath = fanArtFile[0].filepath;
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        } //@ts-ignore
        const newFileName = fanArtFile[0].newFilename;
        const originalName = fanArtFile[0].originalFilename;
        const newPath = path.join(uploadDir, newFileName! + originalName!);

        fs.rename(oldPath, newPath.replace(/\s+/g, ""), async (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ success: false, message: "Failed to save file" })
            );
            return;
          }

          const fanArtUrl = `/uploads/${newFileName}${originalName!.replace(
            /\s+/g,
            ""
          )}`;
          //@ts-ignore
          const name = fields.name[0];
          //@ts-ignore
          const authorId = req.user.id;
          //@ts-ignore
          const categoryId = fields.categoryId[0];
          //@ts-ignore
          const categoryToNumber = Number(categoryId);
          // Salvar as URLs dos arquivos no banco de dados

          const post = await postService.newPost(
            authorId,
            name,
            fanArtUrl,
            //@ts-ignore
            categoryToNumber
          );
          if (post instanceof Error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: post.message,
                status: res.statusCode,
              })
            );
            return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: post,
              status: res.statusCode,
            })
          );
          return;
        });
      });
    } catch (err) {
      if (err instanceof Error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: err.message,
            status: res.statusCode,
          })
        );
        return;
      }
    }
  },
  deletePost: async (req: IncomingMessage, res: ServerResponse) => {
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
          const [{ postId }] = body;

          const post = await postService.deletePost(userId, Number(postId));

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: post, status: res.statusCode }));
        } catch (error) {
          if (error instanceof Error) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: error.message, status: res.statusCode })
            );
          }
        }
      });
  },
  getPostsById: async (req: IncomingMessage, res: ServerResponse) => {
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
          const [{ postId }] = body;

          const post = await postService.getPostsById(Number(postId));
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: post, status: res.statusCode }));
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
        return;
      });
  },
  getAllPosts: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await postService.getAllPosts();

      if (response) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: response, status: res.statusCode }));
        return;
      }
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
  },
  getRecentPosts: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await postService.getMostRecentlyPosts();

      if (response) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: response, status: res.statusCode }));
        return;
      }
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
  },
};

export default postController;

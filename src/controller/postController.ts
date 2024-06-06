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
        const oldPath = fanArtFile[0].path; // Use 'path' instead of 'filepath'
        const uploadDir = path.join(__dirname, "../../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newFileName = fanArtFile[0].newFilename;
        const originalName = fanArtFile[0].originalFilename;
        const newPath = path.join(uploadDir, newFileName + originalName);

        // Verifica se o arquivo temporário existe antes de tentar copiá-lo
        if (!fs.existsSync(oldPath)) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Temporary file not found",
            })
          );
          return;
        }

        // Copia o arquivo temporário para o destino desejado
        fs.copyFile(oldPath, newPath.replace(/\s+/g, ""), async (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ success: false, message: "Failed to save file" })
            );
            return;
          }
          //@ts-ignore
          const fanArtUrl = `/uploads/${newFileName}${originalName.replace(
            /\s+/g,
            ""
          )}`;

          //@ts-ignore
          const name = fields.name[0];

          // Salvar as URLs dos arquivos no banco de dados
          //@ts-ignore
          const post = await postService.newPost(name, fanArtUrl);
          if (post instanceof Error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: post.message,
                message: "Failed to create post",
              })
            );
            return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "Post created successfully",
            })
          );
        });
      });
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: false, message: "Failed to create post" })
      );
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
          const [{ postId, categoryId }] = body;

          const post = await postService.deletePost(
            userId,
            Number(postId),
            Number(categoryId)
          );

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

          if (post instanceof Error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: post.message, status: res.statusCode })
            );
            return;
          }

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
  searchPostParams: async (
    req: IncomingMessage,
    res: ServerResponse,
    query: string,
    page: number
  ) => {
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
          const [{ categoryId }] = body;

          const response = await postService.searchPost(
            query,
            page,
            categoryId
          );
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: response, status: res.statusCode })
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
        return;
      });
  },
  getUserPosts: async (
    req: IncomingMessage,
    res: ServerResponse,
    page: number
  ) => {
    try {
      //@ts-ignore
      const userId = req.user.id;

      const posts = await postService.getUserPosts(userId, page);
      if (posts instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: posts.message, status: res.statusCode })
        );
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: posts, status: res.statusCode }));
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
  },
};

export default postController;

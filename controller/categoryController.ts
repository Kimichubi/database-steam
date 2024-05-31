import { IncomingMessage, ServerResponse } from "http";
import categoryService from "../services/categoryService";
import formidable from "formidable";
import path from "path";
import fs from "fs";
const categoryController = {
  newCategory: async (req: IncomingMessage, res: ServerResponse) => {
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

        const imagesUrl = files.imageUrl;
        if (!imagesUrl) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "No file uploaded" })
          );
          return;
        }
        //@ts-ignore
        const oldPath = imagesUrl[0].filepath;
        const uploadDir = path.join(__dirname, "../categoryImages");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        } //@ts-ignore
        const newFileName = imagesUrl[0].newFilename;
        const originalName = imagesUrl[0].originalFilename;
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

          const imagesUrl = `/categoryImages/${newFileName}${originalName!.replace(
            /\s+/g,
            ""
          )}`;
          //@ts-ignore
          const name = fields.name[0];
          //@ts-ignore

          // Salvar as URLs dos arquivos no banco de dados
          const category = await categoryService.newCategory(name, imagesUrl);
          console.log(category);

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
  getAllCategorys: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const response = await categoryService.getAllCategorys();

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
  getOneCategory: async (req: IncomingMessage, res: ServerResponse) => {
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
          //@ts-ignore
          const userId = req.user.id;

          const response = await categoryService.getOneCategory(categoryId);

          if (response instanceof Error) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: response.message,
                status: res.statusCode,
              })
            );
            return;
          }

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
      });
  },
  followCategory: async (req: IncomingMessage, res: ServerResponse) => {
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
          //@ts-ignore
          const userId = req.user.id;

          const follow = await categoryService.followCategory(
            userId,
            categoryId
          );

          if (follow instanceof Error) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: follow.message,
                status: res.statusCode,
              })
            );
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: follow, status: res.statusCode }));
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

export default categoryController;

import { IncomingMessage, ServerResponse } from "http";
import fs from "fs";

import path from "path";
import { postController } from "../controller/postController";
import formidable from "formidable";
import sharp from "sharp";

export const postPost = {
  newPost: async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === "/upload") {
      const form = formidable({
        uploadDir: path.join(__dirname, "..", "uploads"), // Configura o diretório de upload
        keepExtensions: true, //Mantém a extensão do arquivo original
      });
      //  @ts-ignore
      if (!fs.existsSync(form.uploadDir)) {
        //   @ts-ignore
        fs.mkdirSync(form.uploadDir);
      }

      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ message: "Erro ao processar o upload" }));
          console.error(err);
          return;
        }

        //    Verifica se existe algum arquivo enviado
        if (!files || !files.content) {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: "Nenhum arquivo foi enviado" }));
          return;
        }

        //   Obtém o arquivo enviado
        const file = Array.isArray(files.content)
          ? files.content[0]
          : files.content;

        //    Verifica se o caminho do arquivo está presente
        if (!file || !file.filepath) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "O caminho do arquivo não está disponível",
            })
          );
          return;
        }

        const oldPath = file.filepath;
        const newPath = path.join(
          //    @ts-ignore
          form.uploadDir,
          file.originalFilename || "uploaded_file.jpg"
        );

        fs.rename(oldPath, newPath, async (err) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: "Erro ao salvar o arquivo" }));
            console.error(err);
            return;
          }

          try {
            //      @ts-ignore
            await postController.newPost(
              //    @ts-ignore
              fields.name[0],
              newPath,
              //     @ts-ignore
              req.user.id,
              res
            ); // Verifique se req.user.id está sendo definido corretamente
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Arquivo salvo com sucesso" }));
            return;
          } catch (controllerError) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                message: "Erro no postController",
                error: controllerError,
              })
            );
            return;
          }
        });
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Rota não encontrada" }));
      return;
    }
  },
  getAllPost: async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET" && req.url === "/posts") {
      try {
        const posts = await postController.allPosts(req, res);
        res.statusCode = 200;
        res.end(JSON.stringify(posts));
        return;
      } catch (error) {
        if (error) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: error }));
          return;
        }
      }
    }
  },
};

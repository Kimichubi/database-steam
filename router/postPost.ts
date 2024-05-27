import { IncomingMessage, ServerResponse } from "http";
import fs, { stat } from "fs";
import path from "path";
import formidable from "formidable";
import { postController } from "../controller/postController";

// Função para criar uma URL acessível para a imagem
const getImageUrl = (req: IncomingMessage, imagePath: string) => {
  const { protocol, host } = new URL(`http://localhost:3000`);
  return `${protocol}//${host}/${imagePath}`;
};

export const postPost = {
  newPost: async (req: IncomingMessage, res: ServerResponse) => {
    const form = formidable({
      uploadDir: path.join(__dirname, "../", "uploads"), // Configura o diretório de upload
      keepExtensions: true, // Mantém a extensão do arquivo original
    });

    // Cria o diretório de upload se não existir
    //@ts-ignore
    if (!fs.existsSync(form.uploadDir)) {
      //@ts-ignore
      fs.mkdirSync(form.uploadDir);
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "Erro ao processar o upload",
            status: res.statusCode,
          })
        );
        console.error(err);
        return;
      }

      // Verifica se existe algum arquivo enviado
      if (!files || !files.content) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Nenhum arquivo foi enviado",
            status: res.statusCode,
          })
        );
        return;
      }

      // Obtém o arquivo enviado
      const file = Array.isArray(files.content)
        ? files.content[0]
        : files.content;

      // Verifica se o caminho do arquivo está presente
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
        //@ts-ignore
        form.uploadDir,
        file.newFilename || "uploaded_file.jpg"
      );

      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              message: "Erro ao salvar o arquivo",
              status: res.statusCode,
            })
          );
          console.error(err);
          return;
        }

        try {
          const imageUrl = getImageUrl(
            req,
            path.join("uploads", path.basename(newPath))
          );

          await postController.newPost(
            fields.name![0],
            imageUrl,
            //@ts-ignore
            req.user.id,
            res
          ); // Verifique se req.user.id está sendo definido corretamente

          res.statusCode = 200;
          req.on("end", () => {
            res.end(
              JSON.stringify({
                message: "Arquivo salvo com sucesso",
                imageUrl,
                status: res.statusCode,
              })
            );
          });

          return;
        } catch (controllerError) {
          req.on("end", () => {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                message: "Erro no postController",
                error: controllerError,
                status: res.statusCode,
              })
            );
          });

          return;
        }
      });
    });
  },
  postToDelete: async (
    req: IncomingMessage,
    res: ServerResponse,
    postId: number
  ) => {
    try {
      const response = await postController.postToRemove(req, res, postId);

      if (response) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: response, status: res.statusCode }));
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getAllPost: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const posts = await postController.allPosts(req, res);
      res.statusCode = 200;

      req.on("end", () => {
        res.end(JSON.stringify({ posts, status: res.statusCode }));
      });
      return;
    } catch (error) {
      res.statusCode = 400;
      req.on("end", () => {
        res.end(JSON.stringify({ message: error }));
      });

      return;
    }
  },
};

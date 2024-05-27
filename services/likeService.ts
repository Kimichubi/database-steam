import { ServerResponse } from "http";
import prisma from "../prisma/prisma";

export const likeService = {
  like: async (postId: number, userId: number, res: ServerResponse) => {
    try {
      const postExists = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!postExists) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Post não existe" }));
      }

      const existingLike = await prisma.likes.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      if (existingLike) {
        // Retorna uma mensagem se o like já existir
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Like já foi adicionado" }));
      }

      const like = await prisma.likes.create({
        data: {
          userId,
          postId,
        },
      });

      return like;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
};

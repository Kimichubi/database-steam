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

      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        res.statusCode = 404;
        res.end(
          JSON.stringify({
            message: "Por favor faça login",
            status: res.statusCode,
          })
        );
        return;
      }

      if (!postExists) {
        res.statusCode = 404;
        res.end(
          JSON.stringify({ message: "Post não existe", status: res.statusCode })
        );
        return;
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
        res.end(
          JSON.stringify({
            message: `Like já foi adicionado no post ${postExists.name}`,
          })
        );
        return;
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
  getPostWithMoreLikes: async (res: ServerResponse) => {
    try {
      const postsWithLikeCount = await prisma.likes.groupBy({
        by: ["postId"],
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: "desc",
          },
        },
      });

      const postIds = postsWithLikeCount.map((likeGroup) => likeGroup.postId);

      const posts = await prisma.post.findMany({
        where: {
          id: {
            in: postIds,
          },
        },
        orderBy: {
          id: "asc", // Você pode ordenar como preferir, ou até omitir se não for necessário
        },
      });
      const postsWithLikes = posts.map((post) => {
        const likeCount =
          postsWithLikeCount.find((likeGroup) => likeGroup.postId === post.id)
            ?._count.postId || 0;
        return { ...post, likeCount };
      });

      return postsWithLikes;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
};

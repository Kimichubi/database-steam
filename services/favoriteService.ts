import { ServerResponse } from "http";
import prisma from "../prisma/prisma";

export const favoriteService = {
  favorite: async (postId: number, userId: number, res: ServerResponse) => {
    try {
      if (!userId && !postId) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            message: "Usuario não informado ou Post não existe",
            status: res.statusCode,
          })
        );
        return;
      }
      const isFavorited = await prisma.favorites.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });

      if (isFavorited) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "O post já está favoritado!" }));
        return;
      }

      const favorite = await prisma.favorites.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });

      return favorite;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  deleteFavorite: async (
    postId: number,
    userId: number,
    res: ServerResponse
  ) => {
    try {
      if (!userId && !postId) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            message: "Usuario não informado ou Post não existe",
            status: res.statusCode,
          })
        );
        return;
      }
      const isFavorited = await prisma.favorites.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });

      if (!isFavorited) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "O post não está favoritado!" }));
        return;
      }

      const favorite = await prisma.favorites.delete({
        where: {
          id: isFavorited.id,
          userId: userId,
        },
      });

      return favorite;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getPostWithMoreFavorites: async (res: ServerResponse) => {
    try {
      const postsWithLikeCount = await prisma.favorites.groupBy({
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

      const postIds = postsWithLikeCount.map(
        (favoriteGroup) => favoriteGroup.postId
      );

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
      const postWithFavorites = posts.map((post) => {
        const favoriteCount =
          postsWithLikeCount.find(
            (favoriteGroup) => favoriteGroup.postId === post.id
          )?._count.postId || 0;
        return { ...post, favoriteCount };
      });

      return postWithFavorites;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getPostWithMoreFavoritesUser: async (
    res: ServerResponse,
    userId: string | number
  ) => {
    try {
      const userFavorites = await prisma.favorites.groupBy({
        by: ["postId"],
        where: {
          userId: Number(userId), // Filtramos pelos likes do usuário específico
        },
        _count: {
          postId: true,
        },
        orderBy: {
          _count: {
            postId: "desc",
          },
        },
      });
      const postIds = userFavorites.map(
        (favoriteGroup) => favoriteGroup.postId
      );

      // Buscar os posts completos com os IDs obtidos
      const posts = await prisma.post.findMany({
        where: {
          id: {
            in: postIds,
          },
        },
        orderBy: {
          id: "asc",
        },
      });

      // Combinar as contagens de likes com os posts
      const postsWithLikes = posts.map((post) => {
        const favoriteCount =
          userFavorites.find(
            (favoriteGroup) => favoriteGroup.postId === post.id
          )?._count.postId || 0;
        return { ...post, favoriteCount };
      });

      // Retornar os posts com a contagem de likes
      return postsWithLikes;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
};

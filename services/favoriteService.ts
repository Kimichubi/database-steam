import prisma from "../prisma/prisma";

const favoriteService = {
  newFavorite: async (postId: number, userId: number, categoryId: number) => {
    try {
      if (!postId) {
        throw new Error("Post não existe");
      }
      if (!userId) {
        throw new Error("User não existe");
      }

      const postExists = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!postExists) {
        throw new Error("Post não existe");
      }
      const favoriteAlready = await prisma.favorites.findMany({
        where: {
          postId,
          userId,
        },
      });
      if (favoriteAlready.length >= 1) {
        throw new Error("Voce já favoritou este post");
      }
      const favorite = await prisma.favorites.create({
        data: {
          postId,
          userId,
          categoryId,
        },
      });

      return favorite;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  postWithMoreFavorite: async () => {
    try {
      const postWithMoreFavorites = await prisma.post.findMany({
        include: {
          _count: true,
          author: {
            select: {
              name: true,
            },
          },
        },

        orderBy: {
          favorites: {
            _count: "desc",
          },
        },
        take: 10, // Limita o número de resultados retornados (por exemplo, 10)
      });
      return postWithMoreFavorites;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  categoryWithMoreFavorite: async () => {
    try {
      const categoryWithMoreFavorite = await prisma.category.findMany({
        include: {
          _count: true,
        },

        orderBy: {
          favorites: {
            _count: "desc",
          },
        },
        take: 10, // Limita o número de resultados retornados (por exemplo, 10)
      });
      return categoryWithMoreFavorite;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  userMostFavoritedPost: async (userId: number) => {
    try {
      if (!userId) {
        throw new Error("Usuario não cadastrado ou não encontrado!");
      }
      const post = await prisma.post.findMany({
        where: {
          favorites: {
            some: {
              userId,
            },
          },
        },
        orderBy: {
          favorites: {
            _count: "desc",
          },
        },
        take: 5,
        include: {
          _count: {
            select: { favorites: true },
          },
        },
      });
      return post;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  removeFavorite: async (
    postId: number,
    userId: number,
    categoryId: number
  ) => {
    try {
      if (!postId) {
        throw new Error("Post não foi encontrado!");
      }

      const favorite = await prisma.favorites.deleteMany({
        where: {
          postId,
          userId,
          categoryId,
        },
      });

      if (favorite.count < 1) {
        throw new Error("Favorito não foi encontrado!");
      }
      return favorite;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
};
export default favoriteService;

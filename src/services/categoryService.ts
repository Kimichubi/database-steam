import prisma from "../prisma/prisma";

const categoryService = {
  newCategory: async (name: string, imageUrl: string) => {
    try {
      if (!name) {
        throw new Error("Name não informado!");
      }

      const categoryExists = await prisma.category.findUnique({
        where: {
          name,
        },
      });
      if (categoryExists) {
        throw new Error("Categoria já existe!");
      }
      const category = await prisma.category.create({
        data: {
          name,
          imageUrl,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  deleteCategory: async (categoryId: number) => {
    try {
      if (!categoryId) {
        throw new Error("categoryId não informado!");
      }
      await prisma.likes.deleteMany({
        where: {
          categoryId,
        },
      });
      await prisma.favorites.deleteMany({
        where: {
          categoryId,
        },
      });

      await prisma.post.deleteMany({
        where: {
          categoryId,
        },
      });
      const category = await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  getAllCategorys: async (page: number) => {
    try {
      const take = 10;
      const skip = (page - 1) * take;

      const category = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          _count: true,
        },
        take,
        skip,
      });

      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },

  getOneCategory: async (categoryId: number, page: number) => {
    try {
      if (!categoryId) {
        throw new Error("Categoria não informada!");
      }
      const take = 6;
      const skip = (page - 1) * take;
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          posts: {
            select: {
              _count: {
                select: {
                  likes: true,
                  favorites: true,
                },
              },
              id: true,
              author: {
                select: {
                  name: true,
                },
              },
              name: true,
              fanArtUrl: true,
            },
            take,
            skip,
          },
          _count: true,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  followCategory: async (userId: number, categoryId: number) => {
    try {
      if (!userId) {
        throw new Error("Usuario não informado!");
      }
      if (!categoryId) {
        throw new Error("Categoria não informada!");
      }

      const follow = await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          followers: { connect: { id: userId } },
        },
      });
      return follow;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  searchCategory: async (query: string, page: number) => {
    try {
      if (!query) {
        throw new Error("Query não informada!");
      }
      const take = 6;
      const skip = (page - 1) * take;
      const searchCategoryParams = await prisma.category.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        include: {
          _count: true,
        },
        take,
        skip,
      });
      return searchCategoryParams;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
};
export default categoryService;

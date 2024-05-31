import prisma from "../prisma/prisma";

const categoryService = {
  newCategory: async (name: string, image: string) => {
    try {
      if (!name) {
        throw new Error("Name não informado!");
      }

      const category = await prisma.category.create({
        data: {
          name,
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

      const category = await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      await prisma.post.deleteMany({
        where: {
          categoryId,
        },
      });
      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  getAllCategorys: async () => {
    try {
      const category = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: true,
          posts: {
            select: {
              author: true,
              _count: true,
              fanArtUrl: true,
            },
          },
        },

        take: 10,
      });

      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  getFollowingCategorys: async (userId: number) => {
    try {
      const category = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: true,
          posts: {
            select: {
              author: true,
              _count: true,
              fanArtUrl: true,
            },
          },
        },

        take: 10,
      });

      return category;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  getOneCategory: async (categoryId: number) => {
    try {
      if (!categoryId) {
        throw new Error("Categoria não informada!");
      }
      const category = await prisma.category.findUnique({
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
};
export default categoryService;

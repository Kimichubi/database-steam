import { User } from "../interface/user";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userService = {
  findByEmail: async (email: string) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  },
  register: async ({ name, email, password }: User) => {
    try {
      const userAlready = await userService.findByEmail(email);
      if (userAlready) {
        throw new Error("Usuario já cadastrado!");
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      return user;
    } catch (err) {
      if (err) {
        console.error(err);
        return err;
      }
    }
  },
  login: async ({ email, password }: any) => {
    try {
      const user = await userService.findByEmail(email);
      if (!user) {
        throw new Error("Usuario não cadastrado");
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("As senhas não são iguais");
      }

      const token = jwt.sign(user, process.env.SECRET_KEY!, {
        expiresIn: "24h",
      });
      return token;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  infos: async (userId: number) => {
    try {
      if (!userId) {
        throw new Error("Usuario não cadastrado!");
      }
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  getFollowingCategorys: async (userId: number, page: number) => {
    const take = 10;
    const skip = (page - 1) * take;
    try {
      if (!userId) {
        throw new Error("userId não informado");
      }
      const userFollowing = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          followingCategories: {
            take,
            skip,
            select: {
              name: true,
              id: true,
              _count: true,
              imageUrl: true,
            },
          },
        },
      });

      return userFollowing;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  userFollowingOneCategory: async (userId: number, categoryId: number) => {
    try {
      if (!userId) {
        throw new Error("User não informado");
      } else if (!categoryId) {
        throw new Error("Category não informado");
      }
      const userIsFollowing = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          followers: {
            where: {
              id: userId,
            },
            select: {
              name: true,
            },
          },
        },
      });
      if (userIsFollowing?.followers.length! < 1) {
        throw new Error("Categoria não seguida");
      }
      return userIsFollowing;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  unFollowCategory: async (userId: number, categoryId: number) => {
    try {
      if (!userId) {
        throw new Error("Usuario não informado!");
      }
      if (!categoryId) {
        throw new Error("Categoria não informada!");
      }

      const unFollow = await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          followingCategories: {
            disconnect: {
              id: categoryId,
            },
          },
        },
        select: {
          name: true,
        },
      });
      return unFollow;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  userLikedPost: async (postId: number, categoryId: number, userId: number) => {
    try {
      if (!userId) {
        throw new Error("User não informado");
      } else if (!categoryId) {
        throw new Error("Category não informado");
      } else if (!postId) {
        throw new Error("Category não informado");
      }
      const userIsLiked = await prisma.likes.findMany({
        where: {
          postId,
          categoryId,
          userId,
        },
      });
      if (userIsLiked?.length! < 1) {
        throw new Error("Post não likado!");
      }
      return userIsLiked;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  userFavoritedPost: async (
    postId: number,
    categoryId: number,
    userId: number
  ) => {
    try {
      if (!userId) {
        throw new Error("User não informado");
      } else if (!categoryId) {
        throw new Error("Category não informado");
      } else if (!postId) {
        throw new Error("Category não informado");
      }
      const userIsFavorited = await prisma.favorites.findMany({
        where: {
          postId,
          categoryId,
          userId,
        },
      });
      if (userIsFavorited?.length! < 1) {
        throw new Error("Post não Favoritado!");
      }
      return userIsFavorited;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
};

export default userService;

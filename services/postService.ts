import prisma from "../prisma/prisma";

const postService = {
  newPost: async ({ authorId, name, fanArtUrl, categoryId }: any) => {
    try {
      const post = await prisma.post.create({
        data: {
          fanArtUrl,
          authorId,
          name,
          categoryId,
        },
      });
      return post;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  },
  deletePost: async (userId: number, postId: number) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error("Post não encontrado");
      }

      if (post.authorId !== userId) {
        throw new Error("Post não pode ser excluido, você não é o autor");
      }

      await prisma.likes.deleteMany({
        where: {
          postId: post.id,
        },
      });

      await prisma.favorites.deleteMany({
        where: {
          postId: post.id,
        },
      });
      const deletedPost = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return deletedPost;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
  },
  getPostsById: async (postId: number) => {
    try {
      if (!postId) {
        throw new Error("Por favor informe o ID do Post");
      }
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error("Post não existe!");
      }
      return post;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return error.message;
      }
    }
  },
  getAllPosts: async () => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: { select: { name: true } },
          _count: true,
        },
        take: 10,
      });

      if (!posts) {
        throw new Error("Nenhumo post foi encontrado!");
      }
      return posts;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return error.message;
      }
    }
  },
  getMostRecentlyPosts: async () => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          id: "desc",
        },
        include: {
          author: { select: { name: true } },
          _count: true,
        },
        take: 10,
      });

      if (!posts) {
        throw new Error("Nenhumo post foi encontrado!");
      }
      return posts;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return error.message;
      }
    }
  },
};

export default postService;

import { PrismaClient } from "@prisma/client";
import { ServerResponse } from "http";

const prisma = new PrismaClient();

export const postService = {
  newPost: async (name: string, imagePath: string | null, authorId: number) => {
    try {
      // Only create a post if both name and image path are provided
      if (name && imagePath) {
        const post = await prisma.post.create({
          //@ts-ignore
          data: {
            name,
            fanArtUrl: imagePath,
            authorId: authorId, // Use the image path as content
          },
        });
        return post;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return error;
      }
    }
  },
  postToRemove: async (postId: number, res: ServerResponse) => {
    try {
      //Verificar se o post existe
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      console.log(post);
      if (!post) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ message: "Post não existe", status: res.statusCode })
        );
        return;
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

      const postDeleted = await prisma.post.delete({
        where: {
          id: post.id,
        },
      });

      return postDeleted;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        console.error(error);
        return;
      }
    }
  },
  getPosts: async () => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: [
          {
            id: "asc",
          },
        ],
        select: {
          fanArtUrl: true, // Seleciona o atributo 'content'
          author: {
            select: {
              name: true,
            },
          }, // Seleciona o atributo 'author' do relacionamento
        },
      });
      return posts;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return error;
      }
    }
  },
};

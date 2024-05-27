import { PrismaClient } from "@prisma/client";

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

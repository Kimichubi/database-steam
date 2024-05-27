import { ServerResponse } from "http";
import { User } from "../interface/user";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserService<T> {
  register: (
    { email, name, password }: any,
    res: ServerResponse
  ) => Promise<any>;
  findByEmail: (...arg: any) => Promise<any>;
  login: ({ email, password }: any, res: ServerResponse) => Promise<any>;
}

export const userService: UserService<User | any> = {
  
  register: async (
    { email, name, password }: User,
    res: ServerResponse
  ): Promise<void | boolean | Error | User | string | any> => {
    const userAlreadyExists = await userService.findByEmail(email);
    if (userAlreadyExists) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Email já cadastrado!" }));
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { email, name, password: hashedPassword };

      const sucess = await prisma.users.create({
        data: user,
      });
      if (sucess) {
        return sucess;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return error;
      }
    }
  },
  findByEmail: async (email: string): Promise<any> => {
    try {
      const user = await prisma.users.findUnique({
        where: { email }, // Corrigido para garantir que o email seja passado corretamente
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return error;
      }
    }
  },
  login: async ({ email, password }: User, res: ServerResponse) => {
    try {
      const user = await userService.findByEmail(email);

      if (!user) {
        res.statusCode = 404;
        res.end(
          JSON.stringify({
            message: "Usuario não cadastrado por favor cadastre-se!",
          })
        );
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign(user, process.env.SECRET_KEY!, {
          expiresIn: "24h",
        });

        return token;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return error;
      }
    }
  },
};

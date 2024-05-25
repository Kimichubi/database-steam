import { User } from "../interface/user";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserService<T> {
  register: (...arg: any) => Promise<any>;
  findByEmail: (...arg: any) => Promise<any>;
  login: ({ email, password }: any) => Promise<any>;
}

export const userService: UserService<User | any> = {
  register: async ({
    email,
    name,
    password,
  }: User): Promise<void | boolean | Error> => {
    const userAlreadyExists = await userService.findByEmail(email);
    if (userAlreadyExists) {
      throw new Error("Email or password already exists");
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { email, name, password: hashedPassword };

      const sucess = await prisma.users.create({
        data: user,
      });
      if (sucess) {
        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        return new Error(`Erro:${error}`);
      }
    }
  },
  findByEmail: async (email: string): Promise<User | null> => {
    try {
      const user = await prisma.users.findUnique({
        where: { email }, // Corrigido para garantir que o email seja passado corretamente
      });
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw new Error("Erro ao buscar usuário por email");
    }
  },
  login: async ({ email, password }: User) => {
    try {
      const user = await userService.findByEmail(email);
      if (!user) {
        throw new Error("Cadastro não encontrado, por favor, registre-se  ");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(user, process.env.SECRET_KEY!, {
          expiresIn: "24h",
        });
        return JSON.stringify({ token, user: user.name });
      } else {
        return `Senha ou email errado.`;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  },
};

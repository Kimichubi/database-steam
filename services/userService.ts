import { User } from "../interface/user";
import prisma from "../prisma/prisma";

interface UserService<T> {
  register: (...arg: any) => Promise<any>;
  findByEmail: (...arg: any) => Promise<any>;
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

    const user = { email, name, password };

    try {
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
  findByEmail: async (email: string): Promise<User> => {
    const user = await prisma.users.findUnique({ where: { email } });

    return user!;
  },
};

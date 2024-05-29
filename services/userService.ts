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
};

export default userService;

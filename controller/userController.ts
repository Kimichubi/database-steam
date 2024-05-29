import { userService } from "../services/userService";
import { ServerResponse } from "http";

export const userController = {
  register: async (
    body: { email: string; password: string; name: string },
    res: ServerResponse
  ) => {
    const { email, password, name } = body;

    try {
      const user = await userService.register({ email, name, password }, res);

      if (user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            message: `Cadastro bem sucedido. Bem vindo ${name}`,
            status: res.statusCode,
          })
        );
        return;
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return error;
      }
    }
  },
  login: async (
    body: { email: string; password: string },
    res: ServerResponse
  ): Promise<any> => {
    try {
      const { email, password } = body;
      const token = await userService.login({ email, password }, res);
      if (token) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: token, status: res.statusCode }));
        return;
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return;
      }
    }
  },
  updatePassword: async (
    userId: number,
    currentPassword: string,
    newPassword: string,
    res: ServerResponse
  ) => {
    try {
      const response = await userService.updatePassword(
        userId,
        currentPassword,
        newPassword,
        res
      );

      if (response) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: response, status: res.statusCode }));
        return;
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  updateUser: async (
    email: string,
    name: string,
    userId: number,
    res: ServerResponse
  ) => {
    try {
      const response = await userService.updateUser(email, name, userId, res);

      if (response) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: response, status: res.statusCode }));
        return;
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  getUser: async (id: number) => {
    try {
      const user = await userService.getUserInfo(id);
      return user;
    } catch (error) {
      if (error) {
        console.error(error);
        return error;
      }
    }
  },
};

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
        res.end(`Cadastro bem sucedido. Bem vindo ${name}`);
        return;
      }

    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify(error));
        return;
      }
    }
  },
  login: async (
    body: { email: string; password: string },
    res: ServerResponse
  ): Promise<any> => {
    const { email, password } = await body;
    try {
      const token = await userService.login({ email, password }, res);

      if (token) {
        res.statusCode = 200;
        res.end(JSON.stringify({ token }));
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.end(JSON.stringify(error));
        return;
      }
    }
  },
};

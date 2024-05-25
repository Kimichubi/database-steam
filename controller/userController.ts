import { userService } from "../services/userService";
import { ServerResponse } from "http";

export const userController = {
  register: async (
    body: { email: string; password: string; name: string },
    res: ServerResponse
  ) => {
    const { email, password, name } = body;

    try {
      const success = await userService.register({ email, name, password });
      if (success) {
        res.writeHead(200, { "Content-Type": "text/plain" });
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
      const token = await userService.login({ email, password });
      if (token !== null) {
        res.statusCode = 200;
        res.end(JSON.stringify({ token }));
        return token;
      } else {
        res.statusCode = 400;
        res.end(`Email ou senha estão errados!`);
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

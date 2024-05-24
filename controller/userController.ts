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
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(`Cadastro não sucedido ${error}`);
        return;
      }
    }
  },
};

import { IncomingMessage, ServerResponse } from "http";
import { User } from "../interface/user";
import userService from "../services/userService";
import { error } from "console";

const userController = {
  register: async (req: IncomingMessage, res: ServerResponse) => {
    let body: any = [];

    req
      .on("error", (err) => {
        if (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: err, status: res.statusCode }));
        }
      })
      .on("data", (chunk) => {
        body.push(JSON.parse(chunk));
      })
      .on("end", async () => {
        try {
          const [{ name, email, password }] = body;
          if (!name) {
            throw new Error("Por favor informe o nome");
          } else if (!email) {
            throw new Error("Por favor informe o email");
          } else if (!password) {
            throw new Error("Por favor informe a senha");
          }
          const user = await userService.register({ name, email, password });

          if (user instanceof Error) {
            //@ts-ignore
            throw new Error(user.message);
          }
          console.log(name, email, password);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              message: "Usuario criado com sucesso",
              status: res.statusCode,
            })
          );
          return;
        } catch (error) {
          if (error instanceof Error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: error.message,
                status: res.statusCode,
              })
            );
          }
        }
      });
  },
  login: (req: IncomingMessage, res: ServerResponse) => {
    let body: any = [];
    req
      .on("error", (err) => {
        if (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: err, status: res.statusCode }));
          return;
        }
      })
      .on("data", (chunk) => {
        body.push(JSON.parse(chunk));
      })
      .on("end", async () => {
        try {
          const [{ email, password }] = body;
          const token = await userService.login({ email, password });
          if (token instanceof Error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: token.message, status: res.statusCode })
            );
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: token, status: res.statusCode }));
        } catch (error) {
          if (error instanceof Error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: error.message, status: res.statusCode })
            );
            return;
          }
        }
      });
  },
  infos: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const user = await userService.infos(userId);
      if (user instanceof Error) {
        throw new Error(user.message);
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: user, status: res.statusCode }));
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: error.message, status: res.statusCode })
        );
        return;
      }
    }
  },
  folloWingCategory: async (
    req: IncomingMessage,
    res: ServerResponse,
    page: number
  ) => {
    try {
      //@ts-ignore
      const userId = req.user.id;
      const user = await userService.getFollowingCategorys(
        userId,
        Number(page)
      );
      if (user instanceof Error) {
        throw new Error(user.message);
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: user, status: res.statusCode }));
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: error.message, status: res.statusCode })
        );
        return;
      }
    }
  },
};

export default userController;

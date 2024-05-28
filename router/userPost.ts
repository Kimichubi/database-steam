import { IncomingMessage, Server, ServerResponse } from "http";
import { userController } from "../controller/userController";

const userPost = {
  register: async (req: IncomingMessage, res: ServerResponse) => {
    let body: any = [];
    try {
      req
        .on("error", (err) => {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(err));
        })
        .on("data", (chunk) => {
          body.push(chunk.toString());
        })
        .on("end", async () => {
          body = await JSON.parse(body.join(""));
          await userController.register(body, res);
        });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  login: async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void | boolean | any> => {
    try {
      let body: any = [];

      req
        .on("error", (err) => {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: err, status: res.statusCode }));
          return;
        })
        .on("data", (chunk) => {
          body.push(chunk.toString());
        })

        .on("end", async () => {
          body = await JSON.parse(body.join(""));
          await userController.login(body, res);
          return;
        });
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  updatePassword: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      //@ts-ignore
      const userId = req.user.id;

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
        .on("data", async (chunk) => {
          await body.push(JSON.parse(chunk));
        })
        .on("end", async () => {
          const [{ currentPassword, newPassword }] = body;
          await userController.updatePassword(
            userId,
            currentPassword,
            newPassword,
            res
          );
        });
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
  updateUser: async (req: IncomingMessage, res: ServerResponse) => {
    try {
      //@ts-ignore
      const userId = req.user.id;

      let body: any = [];

      req
        .on("error", (err) => {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: err, status: res.statusCode }));
          return;
        })
        .on("data", async (chunk) => {
          await body.push(JSON.parse(chunk));
        })
        .on("end", async () => {
          const [{ email, name }] = body;
          await userController.updateUser(email, name, userId, res);
        });
    } catch (error) {
      if (error instanceof Error) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: error, status: res.statusCode }));
        return;
      }
    }
  },
};

export default userPost;

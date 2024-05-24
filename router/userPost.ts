import { IncomingMessage, ServerResponse } from "http";
import { userController } from "../controller/userController";

const userPost = {
  register: async (req: IncomingMessage, res: ServerResponse) => {
    const { statusCode, writeHead, end } = await res;
    if (req.method === "POST") {
      let body: any = [];
      if (req.url === "/register") {
        req
          .on("error", (err) => {
            console.log(err);
          })
          .on("data", (chunk) => {
            body.push(chunk.toString());
          })
          .on("end", async () => {
            body = await JSON.parse(body.join(""));
            await userController.register(body, res);
          });
      }
    }
  },
};

export default userPost;

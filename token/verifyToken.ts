import { IncomingMessage, Server, ServerResponse } from "http";
import jwt from "jsonwebtoken";

//Just a test key
const secretToken = "secret"; // Substitua por uma chave segura
//Function to resolve the Token
export const verifyToken = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function
) => {
  //Geting the headers = "authorization"
  const authHeader = req.headers["authorization"];

  //Separing the Bearer
  const token = authHeader && authHeader.split(" ")[1];

  //If you don't have any token, you can't request
  if (token == null) {
    res.statusCode = 401;
    res.end("Token não fornecido");
    return;
  }
  //If you have you go to the logic part
  jwt.verify(token, secretToken, (err: any, user: any) => {
    //If is not the same than the secretToken throw ERROR
    if (err) {
      res.statusCode = 403;
      res.end("Token inválido");
      return;
    }

    // Adiciona o usuário verificado ao objeto de requisição
    //User to req.user = user
    //@ts-ignore
    req.user = user;
    //Next midleware
    //@ts-ignore
    next();
  });
};

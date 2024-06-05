"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Just a test key
//Function to resolve the Token
const verifyToken = async (req, res, next) => {
    //Geting the headers = "authorization"
    const authHeader = req.headers["authorization"];
    //Separing the Bearer
    const token = authHeader && authHeader.split(" ")[1];
    //If you don't have any token, you can't request
    if (!token) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            message: "Nenhum token encontrado",
            status: res.statusCode,
        }));
        return;
    }
    //If you have you go to the logic part
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, user) => {
        //If is not the same than the secretToken throw ERROR
        if (err) {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ message: err, status: res.statusCode }));
            return;
        }
        // Adiciona o usuário verificado ao objeto de requisição
        //User to req.user = user
        //@ts-ignore
        req.user = user;
        //@ts-ignore
        //Next midleware
        //@ts-ignore
        next();
        return;
    });
};
exports.default = verifyToken;

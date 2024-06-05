"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const extractEmailProvider = (email) => {
    const match = email.match(/@([^@]+)$/);
    return match ? match[1].split(".")[0] : "";
};
const sendConfirmationEmail = async (code, email) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "outlook",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASS_USER,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirmation Code",
        text: `Hello Kimichubidev hear, this is your confirmation code ${code}`,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log(response);
};
exports.sendConfirmationEmail = sendConfirmationEmail;

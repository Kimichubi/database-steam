import nodemailer from "nodemailer";

const extractEmailProvider = (email: string): string => {
  const match = email.match(/@([^@]+)$/);
  return match ? match[1].split(".")[0] : "";
};

export const sendConfirmationEmail = async (code: number, email: string) => {
  const transporter = nodemailer.createTransport({
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

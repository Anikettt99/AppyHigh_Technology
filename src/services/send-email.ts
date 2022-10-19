import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { config } from "../config/config";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: config.SEND_GRID_KEY ? `${config.SEND_GRID_KEY}` : "",
  })
);

const sendMail = async (to: string, subject: string, body: string) => {
  try {
    await transport.sendMail({
      from: "aniketsinha99123490@gmail.com",
      to: to,
      subject: subject,
      html: body,
    });
  } catch (error) {
    throw error;
  }
};

export { sendMail };

import nodemailer from 'nodemailer';
import { envConfig } from './index';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: envConfig.SMTP_HOST,
      port: envConfig.SMTP_PORT,
      secure: envConfig.SMTP_PORT === 465,
      auth: {
        user: envConfig.SMTP_USER,
        pass: envConfig.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  const transport = getTransporter();
  await transport.sendMail({
    from: envConfig.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  transporter = createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
  constructor() {}

  sendMail({
    from,
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
    from: string;
  }) {
    return this.transporter.sendMail({ from, to, subject, text });
  }
}

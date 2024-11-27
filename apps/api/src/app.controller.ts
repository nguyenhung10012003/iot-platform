import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MailerService } from './mailer.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly mailService: MailerService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  mail() {
    return this.mailService.sendMail({
      to: 'nguyenhung1012003@gmail.com',
      from: process.env.SENDGRID_SENDER,
      subject: 'Test email',
      text: 'This is a test email',
    });
  } 
}

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {
  }
  async sendMailConfirmation(email: string, code: string){

    await this.mailerService.sendMail({
      to: email,
      from: 'yura5742248@gmail.com',
      html: `<h1>Thanks for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='http://localhost:3000/auth/confirm-email?code=${code}'>complete registration</a>
                 <div>Our code ${code}</div>
             </p>`
    })


  }
}
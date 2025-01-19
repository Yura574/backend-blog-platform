import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {
  }

  async sendMailConfirmation(email: string, code: string) {
    const confirmCode = email + '_' + code;
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'yura5742248@gmail.com',
        subject: 'Confirmation email',
        html: `<h1>Thanks for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='http://localhost:5000/auth/confirm-email?code=${confirmCode}'>complete registration</a>
                 <div>Our code ${confirmCode}</div>
             </p>`
      });
      return true;
    } catch (error) {
      return false;
    }

  }

  async sendEmailForRecoveryPassword(email: string, recoveryCode: string){
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'yura5742248@gmail.com',
        subject: 'Recovery password',
        html: `<h1>Recovery code</h1>
             <p>
                 <div> ${recoveryCode}</div>
             </p>`
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
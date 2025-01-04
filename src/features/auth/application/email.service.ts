import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {
  }
  async sendMailConfirmation(email: string, code: string){
    console.log(23);
try {
  await this.mailerService.sendMail({
    to: email,
    from: 'yura5742248@gmail.com',
    subject:'Восстанавление пороля',
    html: `<h1>Thanks for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='http://localhost:5000/auth/confirm-email?code=${code}'>complete registration</a>
                 <div>Our code ${code}</div>
             </p>`
  })
  return true
} catch (error) {
  console.log(error);
  return false
}

  }
}
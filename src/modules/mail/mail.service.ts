import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerifyEmail } from './interfaces/VerifyEmail';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  getMailConfirmationCode(email: string) {
    return this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.mailExpiresIn'),
      },
    );
  }

  sendVerifyMail(verifyEmail: VerifyEmail) {
    const { email } = verifyEmail;
    const confirmationCode =
      verifyEmail?.confirmationCode || this.getMailConfirmationCode(email);

    return this.mailerService.sendMail({
      to: email,
      subject: 'Dating: Verify Email',
      text: "This is a automated email verification request sent by the server.\
            Please don't reply.",
      html: `\
            <h1>Dating: Email Verification Request</h1>\
            <p>You recently requested to verify your email. If you don't\
            know about this then please delete this email.</p><br>\
<b><a href='${this.configService.get(
        'clientURL',
      )}/verify-account/${confirmationCode}'>\
            Click here to verify your email</a></b>`,
    });
  }
}

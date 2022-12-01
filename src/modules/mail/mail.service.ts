import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtVerifyMail } from './interfaces/JwtVerifyMail';
import { VerifyMail } from './interfaces/VerifyMail';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  encodeConfirmationCode(email: string) {
    return this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.mailExpiresIn'),
      },
    );
  }

  decodeConfirmationCode(token: string): JwtVerifyMail {
    return this.jwtService.verify(token, {
      secret: this.configService.get('jwt.accessSecret'),
      ignoreExpiration: true,
    });
  }

  sendVerifyMail(verifyEmail: VerifyMail) {
    const { email } = verifyEmail;
    const confirmationCode =
      verifyEmail?.confirmationCode || this.encodeConfirmationCode(email);

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
      )}/verify-mail/${confirmationCode}'>\
            Click here to verify your email</a></b>`,
    });
  }

  async verifyMail(decodedConfirmationCode: JwtVerifyMail) {
    try {
      const { email, exp } = decodedConfirmationCode;
      const user = await this.userService.getByEmail(email);

      const timestampCurrent = new Date().getTime() / 1000;

      if (!user || user.userLogin.confirmationTime || timestampCurrent > exp) {
        throw new BadRequestException(
          "You're email is already verified or the link is expired.",
        );
      }
      return this.userService.markEmailConfirmed(email);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

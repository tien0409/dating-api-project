import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { MAIL, SEND_VERIFY_MAIL, VERIFY_MAIL } from '../auth/utils/routes';
import { User } from '../users/schemas/user.schema';
import { MailService } from './mail.service';

@Controller(MAIL)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(SEND_VERIFY_MAIL)
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  async sendVerifyMail(@Req() req: Request) {
    const { user } = req;

    await this.mailService.sendVerifyMail({
      email: (user as User).email,
    });
    return;
  }

  @Post(VERIFY_MAIL)
  @HttpCode(HttpStatus.OK)
  async verifyMail(@Res() res: Response, @Param('token') token: string) {
    try {
      const decodedConfirmationCode =
        this.mailService.decodeConfirmationCode(token);
      await this.mailService.verifyMail(decodedConfirmationCode);

      res.json({ message: 'Verified mail successfully!' });
    } catch (err) {
      throw new HttpException(err.message, err?.response?.statusCode);
    }
  }
}

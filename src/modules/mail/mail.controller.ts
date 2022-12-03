import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import {
  MAIL_ROUTE,
  SEND_VERIFY_MAIL_ROUTE,
  VERIFY_MAIL_ROUTE,
} from 'src/configs/routes';
import { MailService } from './mail.service';
import { User } from '../users/schemas/user.schema';

@Controller(MAIL_ROUTE)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(SEND_VERIFY_MAIL_ROUTE)
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  async sendVerifyMail(@Req() req: Request) {
    const user = req.user as User;

    return await this.mailService.sendVerifyMail({
      email: user?.email,
    });
  }

  @Post(VERIFY_MAIL_ROUTE)
  @HttpCode(HttpStatus.OK)
  async verifyMail(@Res() res: Response, @Param('token') token: string) {
    const decodedConfirmationCode =
      this.mailService.decodeConfirmationCode(token);

    await this.mailService.verifyMail(decodedConfirmationCode);

    res.json({ message: 'Verified mail successfully!' });
  }
}

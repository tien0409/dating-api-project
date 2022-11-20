import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { MAIL, VERIFY_MAIL } from '../auth/utils/routes';
import { User } from '../users/schemas/user.schema';
import { MailService } from './mail.service';

@Controller(MAIL)
@UseGuards(JwtAuthenticationGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(VERIFY_MAIL)
  async sendVerifyMail(@Req() req: Request) {
    const { user } = req;
    return await this.mailService.sendVerifyMail({
      email: (user as User).email,
    });
  }
}

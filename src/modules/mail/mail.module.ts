import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mailer.host'),
          port: configService.get('mailer.port'),
          secure: false,
          auth: {
            user: configService.get('mailer.username'),
            pass: configService.get('mailer.password'),
          },
        },
        defaults: {
          from: `No Reply <noreply@dating.com>`,
        },
      }),
    }),
  ],
  exports: [MailerModule],
  providers: [MailService, ConfigService, JwtService],
  controllers: [MailController],
})
export class MailModule {}

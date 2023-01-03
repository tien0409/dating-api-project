import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import {
  NOTIFICATIONS_ACTIVE_ROUTE,
  NOTIFICATIONS_IN_ACTIVE_ROUTE,
  NOTIFICATIONS_ROUTE,
} from '../../configs/routes';
import { NotificationService } from './notification.service';
import { CreateNotificationDTO } from './dtos/create-notification.dto';
import { User } from '../users/schemas/user.schema';

@Controller(NOTIFICATIONS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createNotificationDTO: CreateNotificationDTO,
  ) {
    const user = req.user as User;

    return this.notificationService.create(user._id, createNotificationDTO);
  }

  @Patch(NOTIFICATIONS_ACTIVE_ROUTE + '/:id')
  active(@Param('id') id: string) {
    return this.notificationService.active(id);
  }

  @Patch(NOTIFICATIONS_IN_ACTIVE_ROUTE + '/:id')
  inActive(@Param('id') id: string) {
    return this.notificationService.inActive(id);
  }
}

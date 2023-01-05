import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import {
  NOTIFICATIONS_ACTIVE_ROUTE,
  NOTIFICATIONS_ADMIN_ROUTE,
  NOTIFICATIONS_IN_ACTIVE_ROUTE,
} from '../../configs/routes';
import { NotificationService } from './notification.service';
import { CreateNotificationDTO } from './dtos/create-notification.dto';
import { User } from '../users/schemas/user.schema';
import { GetNotificationsDTO } from './dtos/get-notifications.dto';
import { NOTIFICATION_EVENT_EMITTER } from '../gateway/utils/eventEmitterType';

@Controller(NOTIFICATIONS_ADMIN_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class NotificationAdminController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emitter: EventEmitter2,
  ) {}

  @Get()
  getAll(@Query() getNotificationsDTO: GetNotificationsDTO) {
    return this.notificationService.getAdminAll(getNotificationsDTO);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createNotificationDTO: CreateNotificationDTO,
  ) {
    const user = req.user as User;

    const { notification } = await this.notificationService.create(
      user._id,
      createNotificationDTO,
    );

    return notification;
  }

  @Patch(NOTIFICATIONS_ACTIVE_ROUTE + '/:id')
  async active(@Param('id') id: string) {
    const {
      recipientIds,
      notification,
    } = await this.notificationService.active(id);

    this.emitter.emit(NOTIFICATION_EVENT_EMITTER.CREATE, {
      notification,
      recipientIds,
    });
  }

  @Patch(NOTIFICATIONS_IN_ACTIVE_ROUTE + '/:id')
  inActive(@Param('id') id: string) {
    return this.notificationService.inActive(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}

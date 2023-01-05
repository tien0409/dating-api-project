import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import {
  NOTIFICATION_OBJECTS_DELETE_ALL_ROUTE,
  NOTIFICATION_OBJECTS_DELETE_ROUTE,
  NOTIFICATION_OBJECTS_READ_ALL_ROUTE,
  NOTIFICATION_OBJECTS_READ_ROUTE,
  NOTIFICATION_OBJECTS_ROUTE,
  NOTIFICATION_OBJECTS_UN_READ_ROUTE,
} from '../../configs/routes';
import { NotificationObjectService } from './notification-object.service';
import { User } from '../users/schemas/user.schema';

@Controller(NOTIFICATION_OBJECTS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class NotificationObjectController {
  constructor(
    private readonly notificationObjectService: NotificationObjectService,
  ) {}

  @Get()
  getAll(@Req() req: Request) {
    const user = req.user as User;

    return this.notificationObjectService.getByUserId(user._id);
  }

  @Patch(NOTIFICATION_OBJECTS_READ_ROUTE + '/:id')
  read(@Req() req: Request, @Param('id') notificationObjectId: string) {
    const user = req.user as User;

    return this.notificationObjectService.read(user._id, notificationObjectId);
  }

  @Patch(NOTIFICATION_OBJECTS_UN_READ_ROUTE + '/:id')
  unread(@Req() req: Request, @Param('id') notificationObjectId: string) {
    const user = req.user as User;

    return this.notificationObjectService.unread(
      user._id,
      notificationObjectId,
    );
  }

  @Patch(NOTIFICATION_OBJECTS_READ_ALL_ROUTE)
  readAll(@Req() req: Request) {
    const user = req.user as User;

    return this.notificationObjectService.readAll(user._id);
  }

  @Delete(NOTIFICATION_OBJECTS_DELETE_ROUTE + '/:id')
  delete(@Req() req: Request, @Param('id') notificationObjectId: string) {
    const user = req.user as User;

    return this.notificationObjectService.delete(
      user._id,
      notificationObjectId,
    );
  }

  @Delete(NOTIFICATION_OBJECTS_DELETE_ALL_ROUTE)
  deleteAll(@Req() req: Request) {
    const user = req.user as User;

    return this.notificationObjectService.deleteAll(user._id);
  }
}

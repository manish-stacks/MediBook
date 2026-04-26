// src/notifications/notifications.controller.ts
import { Controller, Get, Put, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  getNotifications(@CurrentUser('id') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.getUserNotifications(userId, page, limit);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAsRead(userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.notificationsService.markAsRead(userId, id);
  }
}

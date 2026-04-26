// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; title: string; message: string; type: string; relatedId?: string }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        data: data.relatedId ? { relatedId: data.relatedId } : undefined,
      },
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { message: 'Notifications fetched', data: { notifications, total, unreadCount } };
  }

  async markAsRead(userId: string, notificationId?: string) {
    if (notificationId) {
      await this.prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
    } else {
      await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    }
    return { message: 'Notifications marked as read' };
  }
}

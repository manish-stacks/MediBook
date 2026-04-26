import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string, page?: number, limit?: number): Promise<{
        message: string;
        data: {
            notifications: {
                data: import("@prisma/client/runtime/library").JsonValue | null;
                id: string;
                createdAt: Date;
                userId: string;
                type: string;
                title: string;
                message: string;
                isRead: boolean;
            }[];
            total: number;
            unreadCount: number;
        };
    }>;
    markAllRead(userId: string): Promise<{
        message: string;
    }>;
    markRead(userId: string, id: string): Promise<{
        message: string;
    }>;
}

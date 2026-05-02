import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        title: string;
        message: string;
        type: string;
        relatedId?: string;
    }): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
    }>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
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
    markAsRead(userId: string, notificationId?: string): Promise<{
        message: string;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllSettings(): Promise<{
        message: string;
        data: Record<string, any>;
    }>;
    updateSetting(key: string, value: string, group?: string, label?: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            label: string | null;
            value: string;
            key: string;
            group: string;
        };
    }>;
    bulkUpdateSettings(settings: {
        key: string;
        value: string;
        group?: string;
    }[]): Promise<{
        message: string;
    }>;
    getStaticPages(): Promise<{
        message: string;
        data: {
            id: string;
            slug: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
        }[];
    }>;
    getStaticPage(slug: string): Promise<{
        message: string;
        data: {
            id: string;
            slug: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
        };
    }>;
    upsertStaticPage(slug: string, dto: {
        title: string;
        content: string;
    }): Promise<{
        message: string;
        data: {
            id: string;
            slug: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
        };
    }>;
    getTestimonials(all?: boolean): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            avatar: string | null;
            rating: number;
            text: string;
            location: string | null;
        }[];
    }>;
    createTestimonial(dto: any): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            avatar: string | null;
            rating: number;
            text: string;
            location: string | null;
        };
    }>;
    updateTestimonial(id: string, dto: any): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            avatar: string | null;
            rating: number;
            text: string;
            location: string | null;
        };
    }>;
    deleteTestimonial(id: string): Promise<{
        message: string;
    }>;
}

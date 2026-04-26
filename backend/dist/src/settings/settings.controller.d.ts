import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<{
        message: string;
        data: Record<string, any>;
    }>;
    bulkUpdate(dto: {
        settings: any[];
    }): Promise<{
        message: string;
    }>;
    update(key: string, dto: {
        value: string;
        group?: string;
        label?: string;
    }): Promise<{
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
    getPages(): Promise<{
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
    getPage(slug: string): Promise<{
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
    upsertPage(slug: string, dto: {
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
    getTestimonials(admin: string): Promise<{
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

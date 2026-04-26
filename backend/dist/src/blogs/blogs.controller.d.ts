import { BlogsService } from './blogs.service';
export declare class BlogsController {
    private blogsService;
    constructor(blogsService: BlogsService);
    findAll(query: any): Promise<{
        message: string;
        data: {
            posts: ({
                author: {
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
            } & {
                id: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                tags: import("@prisma/client/runtime/library").JsonValue | null;
                excerpt: string | null;
                content: string;
                coverImage: string | null;
                authorId: string;
                isPublished: boolean;
                publishedAt: Date | null;
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(slug: string): Promise<{
        message: string;
        data: {
            author: {
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            tags: import("@prisma/client/runtime/library").JsonValue | null;
            excerpt: string | null;
            content: string;
            coverImage: string | null;
            authorId: string;
            isPublished: boolean;
            publishedAt: Date | null;
        };
    }>;
    create(userId: string, dto: any): Promise<{
        message: string;
        data: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            tags: import("@prisma/client/runtime/library").JsonValue | null;
            excerpt: string | null;
            content: string;
            coverImage: string | null;
            authorId: string;
            isPublished: boolean;
            publishedAt: Date | null;
        };
    }>;
    update(id: string, dto: any): Promise<{
        message: string;
        data: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            tags: import("@prisma/client/runtime/library").JsonValue | null;
            excerpt: string | null;
            content: string;
            coverImage: string | null;
            authorId: string;
            isPublished: boolean;
            publishedAt: Date | null;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    contact(dto: any): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            userId: string | null;
            subject: string;
            message: string;
            isRead: boolean;
        };
    }>;
}

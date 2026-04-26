import { SpecialitiesService } from './specialities.service';
export declare class SpecialitiesController {
    private specialitiesService;
    constructor(specialitiesService: SpecialitiesService);
    findAll(): Promise<{
        message: string;
        data: ({
            _count: {
                doctors: number;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    findOne(slug: string): Promise<{
        message: string;
        data: {
            doctors: ({
                user: {
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
                clinics: ({
                    clinic: {
                        name: string;
                        city: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    clinicId: string;
                    doctorId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                userId: string;
                registrationNo: string | null;
                experience: number;
                about: string | null;
                education: import("@prisma/client/runtime/library").JsonValue | null;
                languages: import("@prisma/client/runtime/library").JsonValue | null;
                consultationFee: import("@prisma/client/runtime/library").Decimal;
                followUpFee: import("@prisma/client/runtime/library").Decimal;
                rating: import("@prisma/client/runtime/library").Decimal;
                totalReviews: number;
                bookingUrl: string | null;
                isAvailable: boolean;
                specialityId: string;
            })[];
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    create(dto: any): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, dto: any): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            avatar: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
        };
    }>;
    updateProfile(userId: string, dto: any): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            avatar: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
        };
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    findAll(query: any): Promise<{
        message: string;
        data: {
            users: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                avatar: string;
                role: import(".prisma/client").$Enums.Role;
            }[];
            total: number;
        };
    }>;
    toggleStatus(userId: string): Promise<{
        message: string;
        data: {
            isActive: boolean;
        };
    }>;
}

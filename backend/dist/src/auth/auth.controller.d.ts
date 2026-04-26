import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                avatar: string;
            };
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
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
            doctor: {
                speciality: {
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
                clinics: ({
                    clinic: {
                        id: string;
                        name: string;
                        slug: string;
                        description: string | null;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string | null;
                        phone: string | null;
                        address: string;
                        city: string;
                        state: string;
                        pincode: string;
                        website: string | null;
                        logo: string | null;
                        images: import("@prisma/client/runtime/library").JsonValue | null;
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
            };
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}

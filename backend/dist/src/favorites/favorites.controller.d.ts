import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private favoritesService;
    constructor(favoritesService: FavoritesService);
    toggle(userId: string, doctorId: string): Promise<{
        message: string;
        data: {
            isFavorite: boolean;
        };
    }>;
    getMyFavorites(userId: string): Promise<{
        message: string;
        data: ({
            doctor: {
                speciality: {
                    name: string;
                    icon: string;
                };
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
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            doctorId: string;
        })[];
    }>;
    check(userId: string, doctorId: string): Promise<{
        message: string;
        data: {
            isFavorite: boolean;
        };
    }>;
}

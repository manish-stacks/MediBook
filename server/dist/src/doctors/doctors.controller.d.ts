import { DoctorsService } from './doctors.service';
import { DoctorFilterDto, UpdateDoctorDto } from './dto/doctor.dto';
export declare class DoctorsController {
    private doctorsService;
    constructor(doctorsService: DoctorsService);
    findAll(filter: DoctorFilterDto): Promise<{
        message: string;
        data: {
            doctors: ({
                speciality: {
                    id: string;
                    name: string;
                    slug: string;
                    icon: string;
                };
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
                clinics: ({
                    clinic: {
                        id: string;
                        name: string;
                        city: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    clinicId: string;
                    doctorId: string;
                })[];
                _count: {
                    appointments: number;
                    reviews: number;
                };
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
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    getMyStats(userId: string): Promise<{
        message: string;
        data: {
            totalAppointments: number;
            completedAppointments: number;
            pendingAppointments: number;
            todayAppointments: number;
            totalEarnings: number | import("@prisma/client/runtime/library").Decimal;
            monthRevenue: number | import("@prisma/client/runtime/library").Decimal;
            totalPatients: number;
            rating: number | import("@prisma/client/runtime/library").Decimal;
            totalReviews: number;
        };
    }>;
    getTodayAppointments(userId: string): Promise<{
        message: string;
        data: ({
            clinic: {
                name: string;
            };
            patient: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                address: string | null;
                userId: string;
                bloodGroup: string | null;
                relation: import(".prisma/client").$Enums.RelationType;
            };
            payment: {
                status: import(".prisma/client").$Enums.PaymentStatus;
                paymentMode: import(".prisma/client").$Enums.PaymentMode;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            clinicId: string;
            doctorId: string;
            appointmentNo: string;
            scheduledDate: Date;
            scheduledTime: string;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            paymentMode: import(".prisma/client").$Enums.PaymentMode;
            notes: string | null;
            cancelReason: string | null;
            isRescheduled: boolean;
            patientId: string;
            timeSlotId: string | null;
        })[];
    }>;
    getEarnings(userId: string, period: 'week' | 'month' | 'year'): Promise<{
        message: string;
        data: {
            earnings: ({
                appointment: {
                    patient: {
                        firstName: string;
                        lastName: string;
                    };
                    scheduledDate: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                paymentMode: import(".prisma/client").$Enums.PaymentMode;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                razorpayOrderId: string | null;
                razorpayPaymentId: string | null;
                razorpaySignature: string | null;
                stripePaymentId: string | null;
                receiptUrl: string | null;
                paidAt: Date | null;
                appointmentId: string;
            })[];
            total: number;
            period: "week" | "month" | "year";
            monthly: any[];
        };
    }>;
    findByUrl(bookingUrl: string): Promise<{
        message: string;
        data: {
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
            reviews: ({
                user: {
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number;
                doctorId: string;
                appointmentId: string;
                comment: string | null;
                isApproved: boolean;
            })[];
            user: {
                firstName: string;
                lastName: string;
                avatar: string;
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
            slots: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                day: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                duration: number;
                doctorId: string;
            }[];
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
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
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
            reviews: ({
                user: {
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number;
                doctorId: string;
                appointmentId: string;
                comment: string | null;
                isApproved: boolean;
            })[];
            user: {
                email: string;
                phone: string;
                firstName: string;
                lastName: string;
                avatar: string;
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
            slots: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                day: import(".prisma/client").$Enums.DayOfWeek;
                startTime: string;
                endTime: string;
                duration: number;
                doctorId: string;
            }[];
            _count: {
                appointments: number;
                reviews: number;
            };
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
    }>;
    updateProfile(userId: string, dto: UpdateDoctorDto): Promise<{
        message: string;
        data: {
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
            user: {
                firstName: string;
                lastName: string;
                avatar: string;
            };
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
    }>;
    private getDoctorByUserId;
}

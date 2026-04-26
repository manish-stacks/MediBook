import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto, RescheduleAppointmentDto } from './dto/appointment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
export declare class AppointmentsService {
    private prisma;
    private notifications;
    private mail;
    constructor(prisma: PrismaService, notifications: NotificationsService, mail: MailService);
    create(userId: string, dto: CreateAppointmentDto): Promise<{
        message: string;
        data: {
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
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
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
        };
    }>;
    findAll(userId: string, role: string, query: any): Promise<{
        message: string;
        data: {
            appointments: ({
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
                clinic: {
                    name: string;
                    city: string;
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
                    amount: import("@prisma/client/runtime/library").Decimal;
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
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    findOne(id: string, userId: string, role: string): Promise<{
        message: string;
        data: {
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
            patient: {
                vitals: {
                    id: string;
                    createdAt: Date;
                    notes: string | null;
                    patientId: string;
                    recordedAt: Date;
                    bloodPressure: string | null;
                    height: import("@prisma/client/runtime/library").Decimal | null;
                    weight: import("@prisma/client/runtime/library").Decimal | null;
                    temperature: import("@prisma/client/runtime/library").Decimal | null;
                    heartRate: number | null;
                    oxygenSaturation: import("@prisma/client/runtime/library").Decimal | null;
                    pulse: number | null;
                }[];
            } & {
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
            };
            prescription: {
                medicines: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    duration: number | null;
                    prescriptionId: string;
                    dosage: string | null;
                    morning: boolean;
                    afternoon: boolean;
                    evening: boolean;
                    instructions: string | null;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                notes: string | null;
                patientId: string;
                appointmentId: string;
                diagnosis: string | null;
                followUpDate: Date | null;
                pdfUrl: string | null;
            };
            review: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number;
                doctorId: string;
                appointmentId: string;
                comment: string | null;
                isApproved: boolean;
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
        };
    }>;
    updateStatus(id: string, userId: string, role: string, dto: UpdateAppointmentStatusDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    reschedule(id: string, userId: string, dto: RescheduleAppointmentDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getStats(role: string, userId: string): Promise<{
        message: string;
        data: {
            total: number;
            pending: number;
            confirmed: number;
            completed: number;
            cancelled: number;
        };
    }>;
}

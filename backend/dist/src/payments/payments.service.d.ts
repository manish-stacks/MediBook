import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class PaymentsService {
    private prisma;
    private mail;
    private razorpay;
    constructor(prisma: PrismaService, mail: MailService);
    createOrder(userId: string, appointmentId: string): Promise<{
        message: string;
        data: {
            orderId: any;
            amount: any;
            currency: any;
            key: string;
            isMock: boolean;
        };
    }>;
    verifyPayment(dto: {
        orderId: string;
        paymentId: string;
        signature: string;
        appointmentId: string;
    }): Promise<{
        message: string;
        data: {
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
    }>;
    getPaymentHistory(userId: string): Promise<{
        message: string;
        data: {
            payments: ({
                appointment: {
                    doctor: {
                        user: {
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
                    patient: {
                        firstName: string;
                        lastName: string;
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
        };
    }>;
    getPaymentById(id: string): Promise<{
        message: string;
        data: {
            appointment: {
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
        };
    }>;
}

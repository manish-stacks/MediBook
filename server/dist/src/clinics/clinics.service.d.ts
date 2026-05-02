import { PrismaService } from '../prisma/prisma.service';
export declare class ClinicsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        message: string;
        data: {
            clinics: ({
                _count: {
                    doctors: number;
                    appointments: number;
                };
            } & {
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
            })[];
            total: number;
        };
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            doctors: ({
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
                        avatar: string;
                    };
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
            } & {
                id: string;
                createdAt: Date;
                clinicId: string;
                doctorId: string;
            })[];
            _count: {
                appointments: number;
            };
        } & {
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
    }>;
    create(dto: any): Promise<{
        message: string;
        data: {
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
    }>;
    update(id: string, dto: any): Promise<{
        message: string;
        data: {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignDoctor(clinicId: string, doctorId: string): Promise<{
        message: string;
    }>;
    getMyClinic(userId: string): Promise<{
        message: string;
        data: {
            _count: {
                doctors: number;
                appointments: number;
            };
        } & {
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
    }>;
    getClinicDashboard(userId: string): Promise<{
        message: string;
        data: {
            clinicId: string;
            totalAppointments: number;
            todayAppointments: number;
            totalDoctors: number;
            totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
            monthRevenue: number | import("@prisma/client/runtime/library").Decimal;
            pending: number;
            confirmed: number;
            completed: number;
            doctors: ({
                speciality: {
                    name: string;
                };
                user: {
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
                _count: {
                    appointments: number;
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
        };
    }>;
    getClinicAppointments(userId: string, query: any): Promise<{
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
            total: number;
        };
    }>;
    rescheduleAppointment(appointmentId: string, userId: string, dto: {
        scheduledDate: string;
        scheduledTime: string;
    }): Promise<{
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
    acceptPayment(appointmentId: string, userId: string): Promise<{
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
    getPatientHistory(patientId: string, userId: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
}

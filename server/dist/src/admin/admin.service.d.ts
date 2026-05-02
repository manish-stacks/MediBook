import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        message: string;
        data: {
            overview: {
                totalUsers: number;
                totalDoctors: number;
                totalClinics: number;
                totalAppointments: number;
                todayAppointments: number;
                totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
                monthRevenue: number | import("@prisma/client/runtime/library").Decimal;
                activeUsers: number;
                verifiedDoctors: number;
            };
            appointments: {
                pending: number;
                completed: number;
                cancelled: number;
                monthly: number;
            };
            growth: {
                appointments: string;
            };
            charts: {
                monthly: any[];
            };
            recent: {
                appointments: ({
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
                    clinic: {
                        name: string;
                    };
                    patient: {
                        firstName: string;
                        lastName: string;
                    };
                    payment: {
                        status: import(".prisma/client").$Enums.PaymentStatus;
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
            };
            topDoctors: ({
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
    private getMonthlyAppointments;
    getAllDoctors(query: any): Promise<{
        message: string;
        data: {
            doctors: ({
                speciality: {
                    name: string;
                };
                user: {
                    isActive: boolean;
                    email: string;
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
                clinics: ({
                    clinic: {
                        name: string;
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
            total: number;
        };
    }>;
    verifyDoctor(doctorId: string): Promise<{
        message: string;
        data: {
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
    getAllAppointments(query: any): Promise<{
        message: string;
        data: {
            appointments: ({
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
                clinic: {
                    name: string;
                    city: string;
                };
                patient: {
                    firstName: string;
                    lastName: string;
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
            total: number;
        };
    }>;
    exportAppointmentsExcel(query: any): Promise<Buffer>;
    createDoctor(dto: any): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                password: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                role: import(".prisma/client").$Enums.Role;
                isVerified: boolean;
                refreshToken: string | null;
                otp: string | null;
                otpExpiry: Date | null;
            };
            doctor: {
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
    getRevenueStats(): Promise<{
        message: string;
        data: {
            monthly: any[];
            bySpeciality: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AppointmentGroupByOutputType, "doctorId"[]> & {
                _count: {
                    id: number;
                };
            })[];
        };
    }>;
    updateDoctor(doctorId: string, dto: any): Promise<{
        message: string;
        data: {
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
    deleteDoctor(doctorId: string): Promise<{
        message: string;
    }>;
    getAllPatients(query: any): Promise<{
        message: string;
        data: {
            patients: ({
                user: {
                    email: string;
                };
                _count: {
                    appointments: number;
                };
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
            })[];
            total: number;
        };
    }>;
    getPatientMedicalHistory(patientId: string): Promise<{
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
                clinic: {
                    name: string;
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
    getAllUsers(query: any): Promise<{
        message: string;
        data: {
            users: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                email: string;
                phone: string;
                firstName: string;
                lastName: string;
                avatar: string;
                role: import(".prisma/client").$Enums.Role;
            }[];
            total: number;
        };
    }>;
    createUser(dto: any): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            password: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
            dateOfBirth: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            refreshToken: string | null;
            otp: string | null;
            otpExpiry: Date | null;
        };
    }>;
    updateUser(userId: string, dto: any): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            password: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
            dateOfBirth: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            refreshToken: string | null;
            otp: string | null;
            otpExpiry: Date | null;
        };
    }>;
    deleteUser(userId: string): Promise<{
        message: string;
    }>;
    toggleUserStatus(userId: string): Promise<{
        message: string;
        data: {
            isActive: boolean;
        };
    }>;
    getAllSpecialities(): Promise<{
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
    createSpeciality(dto: any): Promise<{
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
    updateSpeciality(id: string, dto: any): Promise<{
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
    deleteSpeciality(id: string): Promise<{
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
    toggleSpeciality(id: string): Promise<{
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
    getAllBlogs(query: any): Promise<{
        message: string;
        data: {
            posts: ({
                author: {
                    firstName: string;
                    lastName: string;
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
        };
    }>;
    getAllNotifications(query: any): Promise<{
        message: string;
        data: ({
            user: {
                email: string;
                firstName: string;
            };
        } & {
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            userId: string;
            type: string;
            title: string;
            message: string;
            isRead: boolean;
        })[];
    }>;
    broadcastNotification(dto: {
        title: string;
        message: string;
        type?: string;
    }): Promise<{
        message: string;
    }>;
    deleteNotification(id: string): Promise<{
        message: string;
    }>;
    getContactForms(query: any): Promise<{
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
        }[];
    }>;
}

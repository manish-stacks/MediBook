import { PrescriptionsService } from './prescriptions.service';
import { Response } from 'express';
export declare class PrescriptionsController {
    private prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    create(userId: string, dto: any): Promise<{
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
    }>;
    update(userId: string, id: string, dto: any): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
            appointment: {
                clinic: {
                    name: string;
                    address: string;
                };
                scheduledDate: Date;
            };
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
    }>;
    getByAppointment(appointmentId: string): Promise<{
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
    }>;
    downloadPdf(id: string, res: Response): Promise<void>;
}

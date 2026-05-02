import { PatientsService } from './patients.service';
export declare class PatientsController {
    private patientsService;
    constructor(patientsService: PatientsService);
    getMyPatients(userId: string): Promise<{
        message: string;
        data: ({
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
    }>;
    create(userId: string, dto: any): Promise<{
        message: string;
        data: {
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
    }>;
    update(userId: string, id: string, dto: any): Promise<{
        message: string;
        data: {
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
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    getMedicalHistory(id: string): Promise<{
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
            prescriptions: ({
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
    addVitals(id: string, userId: string, dto: any): Promise<{
        message: string;
        data: {
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
        };
    }>;
}

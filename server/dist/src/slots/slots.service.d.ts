import { PrismaService } from '../prisma/prisma.service';
import { CreateSlotDto } from './dto/slot.dto';
export declare class SlotsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDoctorSlot(doctorId: string, dto: CreateSlotDto): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            day: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            duration: number;
            doctorId: string;
        };
    }>;
    getDoctorSlots(doctorId: string): Promise<{
        message: string;
        data: {
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
    }>;
    getAvailableSlots(doctorId: string, date: string): Promise<{
        message: string;
        data: any[];
    }>;
    getAvailableDates(doctorId: string, fromDate?: string): Promise<{
        message: string;
        data: any[];
    }>;
    updateSlot(slotId: string, doctorId: string, dto: Partial<CreateSlotDto>): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            day: import(".prisma/client").$Enums.DayOfWeek;
            startTime: string;
            endTime: string;
            duration: number;
            doctorId: string;
        };
    }>;
    deleteSlot(slotId: string, doctorId: string): Promise<{
        message: string;
    }>;
    private generateTimeSlots;
}

import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/slot.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SlotsController {
    private slotsService;
    private prisma;
    constructor(slotsService: SlotsService, prisma: PrismaService);
    create(userId: string, dto: CreateSlotDto): Promise<{
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
    getMySlots(userId: string): Promise<{
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
    getAvailableDates(doctorId: string, from?: string): Promise<{
        message: string;
        data: any[];
    }>;
    update(id: string, userId: string, dto: Partial<CreateSlotDto>): Promise<{
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
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}

import { DayOfWeek } from '@prisma/client';
export declare class CreateSlotDto {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDuration?: number;
    clinicId?: string;
    isActive?: boolean;
}
export declare class GenerateTimeSlotsDto {
    date: string;
}

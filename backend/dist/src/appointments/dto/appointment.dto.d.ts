import { AppointmentStatus, PaymentMode } from '@prisma/client';
export declare class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    clinicId: string;
    scheduledDate: string;
    scheduledTime: string;
    timeSlotId?: string;
    paymentMode?: PaymentMode;
    notes?: string;
}
export declare class UpdateAppointmentStatusDto {
    status: AppointmentStatus;
    cancelReason?: string;
}
export declare class RescheduleAppointmentDto {
    scheduledDate: string;
    scheduledTime: string;
    timeSlotId?: string;
}

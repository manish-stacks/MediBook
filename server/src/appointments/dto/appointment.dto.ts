// src/appointments/dto/appointment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AppointmentStatus, PaymentMode } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty() @IsString() patientId: string;
  @ApiProperty() @IsString() doctorId: string;
  @ApiProperty() @IsString() clinicId: string;
  @ApiProperty({ example: '2024-12-25' }) @IsDateString() scheduledDate: string;
  @ApiProperty({ example: '10:00' }) @IsString() scheduledTime: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timeSlotId?: string;
  @ApiPropertyOptional({ enum: PaymentMode }) @IsOptional() @IsEnum(PaymentMode) paymentMode?: PaymentMode;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: AppointmentStatus })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancelReason?: string;
}

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2024-12-26' }) @IsDateString() scheduledDate: string;
  @ApiProperty({ example: '11:00' }) @IsString() scheduledTime: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timeSlotId?: string;
}

// src/slots/dto/slot.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class CreateSlotDto {
  @ApiProperty({ enum: DayOfWeek }) @IsEnum(DayOfWeek) dayOfWeek: DayOfWeek;
  @ApiProperty({ example: '10:00' }) @IsString() startTime: string;
  @ApiProperty({ example: '13:00' }) @IsString() endTime: string;
  @ApiPropertyOptional({ example: 30 }) @IsOptional() @IsNumber() slotDuration?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() clinicId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

export class GenerateTimeSlotsDto {
  @ApiProperty({ example: '2024-12-25' }) @IsString() date: string;
}

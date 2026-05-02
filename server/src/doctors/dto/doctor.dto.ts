// src/doctors/dto/doctor.dto.ts
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsDecimal, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class DoctorFilterDto {
  @ApiPropertyOptional() @IsOptional() specialityId?: string;
  @ApiPropertyOptional() @IsOptional() clinicId?: string;
  @ApiPropertyOptional() @IsOptional() city?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) minFee?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) maxFee?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) minExperience?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) rating?: number;
  @ApiPropertyOptional() @IsOptional() search?: string;
  @ApiPropertyOptional({ enum: ['rating', 'fee', 'experience'] }) @IsOptional() sortBy?: string;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] }) @IsOptional() sortOrder?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) limit?: number;
}

export class CreateDoctorDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() specialityId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() registrationNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() experience?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() about?: string;
  @ApiPropertyOptional() @IsOptional() education?: any[];
  @ApiPropertyOptional() @IsOptional() languages?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() consultationFee?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() followUpFee?: number;
}

export class UpdateDoctorDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() experience?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() about?: string;
  @ApiPropertyOptional() @IsOptional() education?: any[];
  @ApiPropertyOptional() @IsOptional() languages?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() consultationFee?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() followUpFee?: number;
}

// src/auth/dto/auth.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsDateString, IsMobilePhone } from 'class-validator';
import { Gender } from '@prisma/client';

export class LoginDto {
  @ApiProperty({ example: 'user@demo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'User@123' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

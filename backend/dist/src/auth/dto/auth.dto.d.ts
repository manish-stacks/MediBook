import { Gender } from '@prisma/client';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    gender?: Gender;
    dateOfBirth?: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

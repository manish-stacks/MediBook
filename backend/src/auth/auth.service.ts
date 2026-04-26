// src/auth/auth.service.ts
import {
  Injectable, BadRequestException, UnauthorizedException, ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existingPhone) throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        role: Role.PATIENT,
        isVerified: true, // Auto verify for demo
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    // Create default self patient profile
    await this.prisma.patient.create({
      data: {
        userId: user.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : new Date('1990-01-01'),
        gender: dto.gender || 'MALE',
        relation: 'SELF',
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { message: 'Registration successful', data: { user, ...tokens } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Save refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
        },
        ...tokens,
      },
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'medibook-refresh-secret',
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) throw new UnauthorizedException('Access denied');

      const isValid = await bcrypt.compare(dto.refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });

      return { message: 'Tokens refreshed', data: tokens };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, gender: true, dateOfBirth: true,
        role: true, isVerified: true, createdAt: true,
        doctor: {
          include: { speciality: true, clinics: { include: { clinic: true } } },
        },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return { message: 'Profile fetched', data: user };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET || 'medibook-secret-key', expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_REFRESH_SECRET || 'medibook-refresh-secret', expiresIn: '7d' },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}

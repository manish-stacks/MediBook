// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        avatar: true, gender: true, dateOfBirth: true, role: true, isVerified: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Profile fetched', data: user };
  }

  async updateProfile(userId: string, dto: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName, lastName: dto.lastName,
        phone: dto.phone, gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        avatar: dto.avatar,
      },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, gender: true, dateOfBirth: true },
    });
    return { message: 'Profile updated', data: user };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
    return { message: 'Account deactivated' };
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, role, search } = query;
    const where: any = {};
    if (role) where.role = role;
    if (search) where.OR = [{ firstName: { contains: search } }, { email: { contains: search } }];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: Number(limit),
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true, avatar: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { message: 'Users fetched', data: { users, total } };
  }

  async toggleStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
    return { message: `User ${updated.isActive ? 'activated' : 'deactivated'}`, data: { isActive: updated.isActive } };
  }
}

// src/specialities/specialities.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpecialitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const specialities = await this.prisma.speciality.findMany({
      where: { isActive: true },
      include: { _count: { select: { doctors: true } } },
      orderBy: { name: 'asc' },
    });
    return { message: 'Specialities fetched', data: specialities };
  }

  async findOne(slug: string) {
    const spec = await this.prisma.speciality.findUnique({
      where: { slug },
      include: {
        doctors: {
          where: { isVerified: true, isAvailable: true },
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            clinics: { include: { clinic: { select: { name: true, city: true } } }, take: 1 },
          },
          take: 12,
        },
      },
    });
    if (!spec) throw new NotFoundException('Speciality not found');
    return { message: 'Speciality fetched', data: spec };
  }

  async create(dto: any) {
    const speciality = await this.prisma.speciality.create({ data: dto });
    return { message: 'Speciality created', data: speciality };
  }

  async update(id: string, dto: any) {
    const speciality = await this.prisma.speciality.update({ where: { id }, data: dto });
    return { message: 'Speciality updated', data: speciality };
  }

  async remove(id: string) {
    await this.prisma.speciality.update({ where: { id }, data: { isActive: false } });
    return { message: 'Speciality deactivated' };
  }
}

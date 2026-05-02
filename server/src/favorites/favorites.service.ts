// src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, doctorId: string) {
    const existing = await this.prisma.favoriteDoctor.findUnique({
      where: { userId_doctorId: { userId, doctorId } },
    });

    if (existing) {
      await this.prisma.favoriteDoctor.delete({ where: { id: existing.id } });
      return { message: 'Removed from favorites', data: { isFavorite: false } };
    } else {
      await this.prisma.favoriteDoctor.create({ data: { userId, doctorId } });
      return { message: 'Added to favorites', data: { isFavorite: true } };
    }
  }

  async getMyFavorites(userId: string) {
    const favorites = await this.prisma.favoriteDoctor.findMany({
      where: { userId },
      include: {
        doctor: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            speciality: { select: { name: true, icon: true } },
            clinics: { include: { clinic: { select: { name: true, city: true } } }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { message: 'Favorites fetched', data: favorites };
  }

  async checkFavorite(userId: string, doctorId: string) {
    const fav = await this.prisma.favoriteDoctor.findUnique({
      where: { userId_doctorId: { userId, doctorId } },
    });
    return { message: 'Checked', data: { isFavorite: !!fav } };
  }
}

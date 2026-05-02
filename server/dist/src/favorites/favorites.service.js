"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoritesService = class FavoritesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggle(userId, doctorId) {
        const existing = await this.prisma.favoriteDoctor.findUnique({
            where: { userId_doctorId: { userId, doctorId } },
        });
        if (existing) {
            await this.prisma.favoriteDoctor.delete({ where: { id: existing.id } });
            return { message: 'Removed from favorites', data: { isFavorite: false } };
        }
        else {
            await this.prisma.favoriteDoctor.create({ data: { userId, doctorId } });
            return { message: 'Added to favorites', data: { isFavorite: true } };
        }
    }
    async getMyFavorites(userId) {
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
    async checkFavorite(userId, doctorId) {
        const fav = await this.prisma.favoriteDoctor.findUnique({
            where: { userId_doctorId: { userId, doctorId } },
        });
        return { message: 'Checked', data: { isFavorite: !!fav } };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map
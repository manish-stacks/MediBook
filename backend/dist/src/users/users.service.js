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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, email: true, firstName: true, lastName: true, phone: true,
                avatar: true, gender: true, dateOfBirth: true, role: true, isVerified: true, createdAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { message: 'Profile fetched', data: user };
    }
    async updateProfile(userId, dto) {
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
    async deleteAccount(userId) {
        await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
        return { message: 'Account deactivated' };
    }
    async findAll(query) {
        const { page = 1, limit = 20, role, search } = query;
        const where = {};
        if (role)
            where.role = role;
        if (search)
            where.OR = [{ firstName: { contains: search } }, { email: { contains: search } }];
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
    async toggleStatus(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updated = await this.prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
        return { message: `User ${updated.isActive ? 'activated' : 'deactivated'}`, data: { isActive: updated.isActive } };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map
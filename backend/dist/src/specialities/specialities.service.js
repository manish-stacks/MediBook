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
exports.SpecialitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SpecialitiesService = class SpecialitiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const specialities = await this.prisma.speciality.findMany({
            where: { isActive: true },
            include: { _count: { select: { doctors: true } } },
            orderBy: { name: 'asc' },
        });
        return { message: 'Specialities fetched', data: specialities };
    }
    async findOne(slug) {
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
        if (!spec)
            throw new common_1.NotFoundException('Speciality not found');
        return { message: 'Speciality fetched', data: spec };
    }
    async create(dto) {
        const speciality = await this.prisma.speciality.create({ data: dto });
        return { message: 'Speciality created', data: speciality };
    }
    async update(id, dto) {
        const speciality = await this.prisma.speciality.update({ where: { id }, data: dto });
        return { message: 'Speciality updated', data: speciality };
    }
    async remove(id) {
        await this.prisma.speciality.update({ where: { id }, data: { isActive: false } });
        return { message: 'Speciality deactivated' };
    }
};
exports.SpecialitiesService = SpecialitiesService;
exports.SpecialitiesService = SpecialitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecialitiesService);
//# sourceMappingURL=specialities.service.js.map
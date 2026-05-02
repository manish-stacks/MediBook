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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllSettings() {
        const settings = await this.prisma.setting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
        const grouped = {};
        for (const s of settings) {
            if (!grouped[s.group])
                grouped[s.group] = {};
            grouped[s.group][s.key] = s.value;
        }
        return { message: 'Settings fetched', data: grouped };
    }
    async updateSetting(key, value, group = 'general', label) {
        const setting = await this.prisma.setting.upsert({
            where: { key },
            create: { key, value, group, label },
            update: { value },
        });
        return { message: 'Setting updated', data: setting };
    }
    async bulkUpdateSettings(settings) {
        for (const s of settings) {
            await this.prisma.setting.upsert({
                where: { key: s.key },
                create: { key: s.key, value: s.value, group: s.group || 'general' },
                update: { value: s.value },
            });
        }
        return { message: 'Settings updated' };
    }
    async getStaticPages() {
        const pages = await this.prisma.staticPage.findMany({ orderBy: { slug: 'asc' } });
        return { message: 'Pages fetched', data: pages };
    }
    async getStaticPage(slug) {
        const page = await this.prisma.staticPage.findUnique({ where: { slug } });
        return { message: 'Page fetched', data: page };
    }
    async upsertStaticPage(slug, dto) {
        const page = await this.prisma.staticPage.upsert({
            where: { slug },
            create: { slug, title: dto.title, content: dto.content },
            update: { title: dto.title, content: dto.content },
        });
        return { message: 'Page saved', data: page };
    }
    async getTestimonials(all = false) {
        const where = all ? {} : { isActive: true };
        const items = await this.prisma.testimonial.findMany({ where, orderBy: { createdAt: 'desc' } });
        return { message: 'Testimonials fetched', data: items };
    }
    async createTestimonial(dto) {
        const t = await this.prisma.testimonial.create({ data: dto });
        return { message: 'Testimonial created', data: t };
    }
    async updateTestimonial(id, dto) {
        const t = await this.prisma.testimonial.update({ where: { id }, data: dto });
        return { message: 'Testimonial updated', data: t };
    }
    async deleteTestimonial(id) {
        await this.prisma.testimonial.delete({ where: { id } });
        return { message: 'Testimonial deleted' };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map
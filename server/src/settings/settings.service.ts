// src/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // ── General Settings ──
  async getAllSettings() {
    const settings = await this.prisma.setting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
    const grouped: Record<string, any> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = {};
      grouped[s.group][s.key] = s.value;
    }
    return { message: 'Settings fetched', data: grouped };
  }

  async updateSetting(key: string, value: string, group = 'general', label?: string) {
    const setting = await this.prisma.setting.upsert({
      where: { key },
      create: { key, value, group, label },
      update: { value },
    });
    return { message: 'Setting updated', data: setting };
  }

  async bulkUpdateSettings(settings: { key: string; value: string; group?: string }[]) {
    for (const s of settings) {
      await this.prisma.setting.upsert({
        where: { key: s.key },
        create: { key: s.key, value: s.value, group: s.group || 'general' },
        update: { value: s.value },
      });
    }
    return { message: 'Settings updated' };
  }

  // ── Static Pages ──
  async getStaticPages() {
    const pages = await this.prisma.staticPage.findMany({ orderBy: { slug: 'asc' } });
    return { message: 'Pages fetched', data: pages };
  }

  async getStaticPage(slug: string) {
    const page = await this.prisma.staticPage.findUnique({ where: { slug } });
    return { message: 'Page fetched', data: page };
  }

  async upsertStaticPage(slug: string, dto: { title: string; content: string }) {
    const page = await this.prisma.staticPage.upsert({
      where: { slug },
      create: { slug, title: dto.title, content: dto.content },
      update: { title: dto.title, content: dto.content },
    });
    return { message: 'Page saved', data: page };
  }

  // ── Testimonials ──
  async getTestimonials(all = false) {
    const where = all ? {} : { isActive: true };
    const items = await this.prisma.testimonial.findMany({ where, orderBy: { createdAt: 'desc' } });
    return { message: 'Testimonials fetched', data: items };
  }

  async createTestimonial(dto: any) {
    const t = await this.prisma.testimonial.create({ data: dto });
    return { message: 'Testimonial created', data: t };
  }

  async updateTestimonial(id: string, dto: any) {
    const t = await this.prisma.testimonial.update({ where: { id }, data: dto });
    return { message: 'Testimonial updated', data: t };
  }

  async deleteTestimonial(id: string) {
    await this.prisma.testimonial.delete({ where: { id } });
    return { message: 'Testimonial deleted' };
  }
}

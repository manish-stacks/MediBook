// src/settings/settings.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get() @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  getAll() { return this.settingsService.getAllSettings(); }

  @Put('bulk') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  bulkUpdate(@Body() dto: { settings: any[] }) { return this.settingsService.bulkUpdateSettings(dto.settings); }

  @Put(':key') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  update(@Param('key') key: string, @Body() dto: { value: string; group?: string; label?: string }) {
    return this.settingsService.updateSetting(key, dto.value, dto.group, dto.label);
  }

  // Static Pages
  @Get('pages/all') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  getPages() { return this.settingsService.getStaticPages(); }

  @Get('pages/:slug') @Public()
  getPage(@Param('slug') slug: string) { return this.settingsService.getStaticPage(slug); }

  @Put('pages/:slug') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  upsertPage(@Param('slug') slug: string, @Body() dto: { title: string; content: string }) {
    return this.settingsService.upsertStaticPage(slug, dto);
  }

  // Testimonials
  @Get('testimonials/all') @Public()
  getTestimonials(@Query('admin') admin: string) { return this.settingsService.getTestimonials(admin === 'true'); }

  @Post('testimonials') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  createTestimonial(@Body() dto: any) { return this.settingsService.createTestimonial(dto); }

  @Put('testimonials/:id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  updateTestimonial(@Param('id') id: string, @Body() dto: any) { return this.settingsService.updateTestimonial(id, dto); }

  @Delete('testimonials/:id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  deleteTestimonial(@Param('id') id: string) { return this.settingsService.deleteTestimonial(id); }
}

// src/specialities/specialities.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SpecialitiesService } from './specialities.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Specialities')
@Controller('specialities')
export class SpecialitiesController {
  constructor(private specialitiesService: SpecialitiesService) {}

  @Get() @Public() @ApiOperation({ summary: 'List all specialities' })
  findAll() { return this.specialitiesService.findAll(); }

  @Get(':slug') @Public() @ApiOperation({ summary: 'Get speciality by slug' })
  findOne(@Param('slug') slug: string) { return this.specialitiesService.findOne(slug); }

  @Post() @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: any) { return this.specialitiesService.create(dto); }

  @Put(':id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() dto: any) { return this.specialitiesService.update(id, dto); }

  @Delete(':id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) { return this.specialitiesService.remove(id); }
}

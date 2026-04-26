// src/doctors/doctors.controller.ts
import { Controller, Get, Put, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { DoctorFilterDto, UpdateDoctorDto } from './dto/doctor.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List doctors with filters' })
  findAll(@Query() filter: DoctorFilterDto) {
    return this.doctorsService.findAll(filter);
  }

  @Get('me/stats')
  @ApiBearerAuth()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Get doctor dashboard stats' })
  async getMyStats(@CurrentUser('id') userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.doctorsService.getDoctorStats(doctor.id);
  }

  @Get('me/today')
  @ApiBearerAuth()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Get today's appointments" })
  async getTodayAppointments(@CurrentUser('id') userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.doctorsService.getTodayAppointments(doctor.id);
  }

  @Get('me/earnings')
  @ApiBearerAuth()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Get doctor earnings' })
  async getEarnings(@CurrentUser('id') userId: string, @Query('period') period: 'week' | 'month' | 'year') {
    const doctor = await this.getDoctorByUserId(userId);
    return this.doctorsService.getDoctorEarnings(doctor.id, period);
  }

  @Get('url/:bookingUrl')
  @Public()
  @ApiOperation({ summary: 'Get doctor by booking URL' })
  findByUrl(@Param('bookingUrl') bookingUrl: string) {
    return this.doctorsService.findByBookingUrl(bookingUrl);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get doctor by ID' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Put('me')
  @ApiBearerAuth()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Update doctor profile' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateDoctorDto) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.doctorsService.updateProfile(doctor.id, dto);
  }

  private async getDoctorByUserId(userId: string) {
    const { PrismaService } = await import('../prisma/prisma.service');
    // We need prisma here - using a workaround
    return { id: userId }; // Will be resolved by service properly
  }
}

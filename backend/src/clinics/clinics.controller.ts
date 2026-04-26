// src/clinics/clinics.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicsService } from './clinics.service';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private clinicsService: ClinicsService) {}

  @Get() @Public() findAll(@Query() query: any) { return this.clinicsService.findAll(query); }
  @Get('me/clinic') @ApiBearerAuth() @Roles(Role.CLINIC_ADMIN) getMyClinic(@CurrentUser('id') userId: string) { return this.clinicsService.getMyClinic(userId); }
  @Get('me/dashboard') @ApiBearerAuth() @Roles(Role.CLINIC_ADMIN) getDashboard(@CurrentUser('id') userId: string) { return this.clinicsService.getClinicDashboard(userId); }
  @Get('me/appointments') @ApiBearerAuth() @Roles(Role.CLINIC_ADMIN) getAppointments(@CurrentUser('id') userId: string, @Query() query: any) { return this.clinicsService.getClinicAppointments(userId, query); }
  @Get('me/patients/:patientId/history') @ApiBearerAuth() @Roles(Role.CLINIC_ADMIN) getPatientHistory(@Param('patientId') patientId: string, @CurrentUser('id') userId: string) { return this.clinicsService.getPatientHistory(patientId, userId); }
  @Put('me/appointments/:appointmentId/reschedule') @ApiBearerAuth() @Roles(Role.CLINIC_ADMIN) reschedule(@Param('appointmentId') id: string, @CurrentUser('id') userId: string, @Body() dto: any) { return this.clinicsService.rescheduleAppointment(id, userId, dto); }
  @Post('me/appointments/:appointmentId/accept-payment') @ApiBearerAuth() @Roles(Role.CLINIC_ADMIN) acceptPayment(@Param('appointmentId') id: string, @CurrentUser('id') userId: string) { return this.clinicsService.acceptPayment(id, userId); }
  @Get(':id') @Public() findOne(@Param('id') id: string) { return this.clinicsService.findOne(id); }
  @Post() @ApiBearerAuth() @Roles(Role.SUPER_ADMIN) create(@Body() dto: any) { return this.clinicsService.create(dto); }
  @Put(':id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN, Role.CLINIC_ADMIN) update(@Param('id') id: string, @Body() dto: any) { return this.clinicsService.update(id, dto); }
  @Delete(':id') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN) remove(@Param('id') id: string) { return this.clinicsService.remove(id); }
  @Post(':clinicId/doctors/:doctorId') @ApiBearerAuth() @Roles(Role.SUPER_ADMIN, Role.CLINIC_ADMIN) assignDoctor(@Param('clinicId') clinicId: string, @Param('doctorId') doctorId: string) { return this.clinicsService.assignDoctor(clinicId, doctorId); }
}

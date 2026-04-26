// src/admin/admin.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard
  @Get('dashboard') getDashboard() { return this.adminService.getDashboardStats(); }

  // Doctors
  @Get('doctors') getDoctors(@Query() query: any) { return this.adminService.getAllDoctors(query); }
  @Post('doctors') createDoctor(@Body() dto: any) { return this.adminService.createDoctor(dto); }
  @Put('doctors/:id') updateDoctor(@Param('id') id: string, @Body() dto: any) { return this.adminService.updateDoctor(id, dto); }
  @Delete('doctors/:id') deleteDoctor(@Param('id') id: string) { return this.adminService.deleteDoctor(id); }
  @Put('doctors/:id/verify') verifyDoctor(@Param('id') id: string) { return this.adminService.verifyDoctor(id); }

  // Appointments
  @Get('appointments') getAppointments(@Query() query: any) { return this.adminService.getAllAppointments(query); }
  @Get('appointments/export') async exportAppointments(@Query() query: any, @Res() res: Response) {
    const buffer = await this.adminService.exportAppointmentsExcel(query);
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="appointments.xlsx"', 'Content-Length': buffer.length });
    res.end(buffer);
  }

  // Patients
  @Get('patients') getPatients(@Query() query: any) { return this.adminService.getAllPatients(query); }
  @Get('patients/:patientId/history') getPatientHistory(@Param('patientId') id: string) { return this.adminService.getPatientMedicalHistory(id); }

  // Users
  @Get('users') getUsers(@Query() query: any) { return this.adminService.getAllUsers(query); }
  @Post('users') createUser(@Body() dto: any) { return this.adminService.createUser(dto); }
  @Put('users/:id') updateUser(@Param('id') id: string, @Body() dto: any) { return this.adminService.updateUser(id, dto); }
  @Delete('users/:id') deleteUser(@Param('id') id: string) { return this.adminService.deleteUser(id); }
  @Put('users/:id/toggle-status') toggleUser(@Param('id') id: string) { return this.adminService.toggleUserStatus(id); }

  // Specialities (Categories)
  @Get('specialities') getSpecialities() { return this.adminService.getAllSpecialities(); }
  @Post('specialities') createSpeciality(@Body() dto: any) { return this.adminService.createSpeciality(dto); }
  @Put('specialities/:id') updateSpeciality(@Param('id') id: string, @Body() dto: any) { return this.adminService.updateSpeciality(id, dto); }
  @Delete('specialities/:id') deleteSpeciality(@Param('id') id: string) { return this.adminService.deleteSpeciality(id); }
  @Put('specialities/:id/toggle') toggleSpeciality(@Param('id') id: string) { return this.adminService.toggleSpeciality(id); }

  // Blog
  @Get('blogs') getBlogs(@Query() query: any) { return this.adminService.getAllBlogs(query); }

  // Notifications
  @Get('notifications') getNotifications(@Query() query: any) { return this.adminService.getAllNotifications(query); }
  @Post('notifications/broadcast') broadcast(@Body() dto: any) { return this.adminService.broadcastNotification(dto); }
  @Delete('notifications/:id') deleteNotification(@Param('id') id: string) { return this.adminService.deleteNotification(id); }

  // Revenue
  @Get('revenue') getRevenue() { return this.adminService.getRevenueStats(); }

  // Contact Forms
  @Get('contacts') getContacts(@Query() query: any) { return this.adminService.getContactForms(query); }
}

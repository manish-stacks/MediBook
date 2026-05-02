// src/appointments/appointments.controller.ts
import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto, RescheduleAppointmentDto } from './dto/appointment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Book an appointment' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  findAll(@CurrentUser('id') userId: string, @CurrentUser('role') role: string, @Query() query: any) {
    return this.appointmentsService.findAll(userId, role, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get appointment statistics' })
  getStats(@CurrentUser('id') userId: string, @CurrentUser('role') role: string) {
    return this.appointmentsService.getStats(role, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single appointment details' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: string) {
    return this.appointmentsService.findOne(id, userId, role);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, userId, role, dto);
  }

  @Put(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule appointment' })
  reschedule(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: RescheduleAppointmentDto) {
    return this.appointmentsService.reschedule(id, userId, dto);
  }
}

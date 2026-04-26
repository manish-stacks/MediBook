// src/slots/slots.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/slot.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Slots')
@Controller('slots')
export class SlotsController {
  constructor(private slotsService: SlotsService, private prisma: PrismaService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a doctor slot (Doctor only)' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateSlotDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error('Doctor profile not found');
    return this.slotsService.createDoctorSlot(doctor.id, dto);
  }

  @Get('my-slots')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my slots (Doctor only)' })
  async getMySlots(@CurrentUser('id') userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error('Doctor profile not found');
    return this.slotsService.getDoctorSlots(doctor.id);
  }

  @Get('doctor/:doctorId/available')
  @Public()
  @ApiOperation({ summary: 'Get available slots for a doctor on a date' })
  getAvailableSlots(@Param('doctorId') doctorId: string, @Query('date') date: string) {
    return this.slotsService.getAvailableSlots(doctorId, date);
  }

  @Get('doctor/:doctorId/dates')
  @Public()
  @ApiOperation({ summary: 'Get available dates for a doctor' })
  getAvailableDates(@Param('doctorId') doctorId: string, @Query('from') from?: string) {
    return this.slotsService.getAvailableDates(doctorId, from);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a slot' })
  async update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: Partial<CreateSlotDto>) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error('Doctor profile not found');
    return this.slotsService.updateSlot(id, doctor.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a slot' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error('Doctor profile not found');
    return this.slotsService.deleteSlot(id, doctor.id);
  }
}

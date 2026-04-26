// src/prescriptions/prescriptions.controller.ts
import { Controller, Get, Post, Put, Body, Param, Res, Header } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Response } from 'express';

@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create prescription (Doctor only)' })
  create(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.prescriptionsService.create(userId, dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update prescription (Doctor only)' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: any) {
    return this.prescriptionsService.update(userId, id, dto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get prescription by ID' })
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Get('appointment/:appointmentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get prescription by appointment ID' })
  getByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.prescriptionsService.getByAppointment(appointmentId);
  }

  // ✅ PUBLIC - no auth required for PDF download
  @Get(':id/pdf')
  @Public()
  @ApiOperation({ summary: 'Download prescription as PDF (Public)' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.prescriptionsService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="prescription-${id}.pdf"`,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(buffer);
  }
}

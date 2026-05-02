// src/patients/patients.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Patients')
@Controller('patients')
@ApiBearerAuth()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my patients/family members' })
  getMyPatients(@CurrentUser('id') userId: string) {
    return this.patientsService.getMyPatients(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add family member' })
  create(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.patientsService.createPatient(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient/family member' })
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: any) {
    return this.patientsService.updatePatient(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove family member' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.patientsService.deletePatient(userId, id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get patient medical history' })
  getMedicalHistory(@Param('id') id: string) {
    return this.patientsService.getMedicalHistory(id);
  }

  @Post(':id/vitals')
  @ApiOperation({ summary: 'Add patient vitals (Doctor only)' })
  addVitals(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.patientsService.addVitals(id, userId, dto);
  }
}

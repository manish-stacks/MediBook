// src/patients/patients.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getMyPatients(userId: string) {
    const patients = await this.prisma.patient.findMany({
      where: { userId, isActive: true },
      include: {
        _count: { select: { appointments: true } },
      },
    });
    return { message: 'Patients fetched', data: patients };
  }

  async createPatient(userId: string, dto: any) {
    const patient = await this.prisma.patient.create({
      data: {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        relation: dto.relation || 'OTHER',
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
      },
    });
    return { message: 'Patient created', data: patient };
  }

  async updatePatient(userId: string, patientId: string, dto: any) {
    const patient = await this.prisma.patient.findFirst({ where: { id: patientId, userId } });
    if (!patient) throw new NotFoundException('Patient not found');

    const updated = await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
      },
    });
    return { message: 'Patient updated', data: updated };
  }

  async deletePatient(userId: string, patientId: string) {
    const patient = await this.prisma.patient.findFirst({ where: { id: patientId, userId } });
    if (!patient) throw new NotFoundException('Patient not found');
    if (patient.relation === 'SELF') throw new ForbiddenException('Cannot delete primary profile');

    await this.prisma.patient.update({ where: { id: patientId }, data: { isActive: false } });
    return { message: 'Patient removed' };
  }

  async addVitals(patientId: string, doctorUserId: string, dto: any) {
    const vital = await this.prisma.patientVital.create({
      data: {
        patientId,
        bloodPressure: dto.bloodPressure || null,
        height: dto.height ? parseFloat(dto.height) : null,
        weight: dto.weight ? parseFloat(dto.weight) : null,
        temperature: dto.temperature ? parseFloat(dto.temperature) : null,
        heartRate: dto.heartRate ? parseInt(dto.heartRate) : null,
        oxygenSaturation: dto.oxygenSaturation ? parseFloat(dto.oxygenSaturation) : null,
        pulse: dto.pulse ? parseInt(dto.pulse) : null,
        notes: dto.notes || null,
      },
    });
    return { message: 'Vitals added', data: vital };
  }

  async getMedicalHistory(patientId: string) {
    const [appointments, prescriptions, vitals] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { patientId },
        include: {
          doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } },
          clinic: { select: { name: true } },
        },
        orderBy: { scheduledDate: 'desc' },
      }),
      this.prisma.prescription.findMany({
        where: { patientId },
        include: {
          medicines: true,
          doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patientVital.findMany({
        where: { patientId },
        orderBy: { recordedAt: 'desc' },
        take: 10,
      }),
    ]);

    return { message: 'Medical history fetched', data: { appointments, prescriptions, vitals } };
  }
}

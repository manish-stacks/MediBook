// src/clinics/clinics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any = {}) {
    const { city, search, page = 1, limit = 12 } = query;
    const where: any = { isActive: true };
    if (city) where.city = { contains: city };
    if (search) where.name = { contains: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [clinics, total] = await Promise.all([
      this.prisma.clinic.findMany({
        where, skip, take: Number(limit),
        include: { _count: { select: { doctors: true, appointments: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.clinic.count({ where }),
    ]);
    return { message: 'Clinics fetched', data: { clinics, total } };
  }

  async findOne(id: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id },
      include: {
        doctors: {
          include: {
            doctor: {
              include: {
                user: { select: { firstName: true, lastName: true, avatar: true, email: true } },
                speciality: true,
                slots: { where: { isActive: true } },
                _count: { select: { appointments: true, reviews: true } },
              },
            },
          },
        },
        _count: { select: { appointments: true } },
      },
    });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return { message: 'Clinic fetched', data: clinic };
  }

  async create(dto: any) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const clinic = await this.prisma.clinic.create({ data: { ...dto, slug } });
    return { message: 'Clinic created', data: clinic };
  }

  async update(id: string, dto: any) {
    const clinic = await this.prisma.clinic.update({ where: { id }, data: dto });
    return { message: 'Clinic updated', data: clinic };
  }

  async remove(id: string) {
    await this.prisma.clinic.update({ where: { id }, data: { isActive: false } });
    return { message: 'Clinic deactivated' };
  }

  async assignDoctor(clinicId: string, doctorId: string) {
    await this.prisma.doctorClinic.upsert({
      where: { doctorId_clinicId: { doctorId, clinicId } },
      create: { doctorId, clinicId },
      update: {},
    });
    return { message: 'Doctor assigned to clinic' };
  }

  // Clinic Admin: get own clinic info
  async getMyClinic(userId: string) {
    const clinicAdmin = await this.prisma.clinicAdmin.findUnique({
      where: { userId },
      include: { clinic: { include: { _count: { select: { doctors: true, appointments: true } } } } },
    });
    if (!clinicAdmin) throw new NotFoundException('Clinic admin not found');
    return { message: 'Clinic fetched', data: clinicAdmin.clinic };
  }

  // Clinic Admin: dashboard stats
  async getClinicDashboard(userId: string) {
    const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
    if (!clinicAdmin) throw new NotFoundException('Clinic admin not found');
    const clinicId = clinicAdmin.clinicId;

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalAppointments, todayAppointments, totalDoctors, totalRevenue, monthRevenue,
      pendingApts, confirmedApts, completedApts] = await Promise.all([
      this.prisma.appointment.count({ where: { clinicId } }),
      this.prisma.appointment.count({ where: { clinicId, scheduledDate: { gte: today, lte: todayEnd } } }),
      this.prisma.doctorClinic.count({ where: { clinicId } }),
      this.prisma.payment.aggregate({ where: { appointment: { clinicId }, status: 'PAID' }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { appointment: { clinicId }, status: 'PAID', paidAt: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.appointment.count({ where: { clinicId, status: 'PENDING' } }),
      this.prisma.appointment.count({ where: { clinicId, status: 'CONFIRMED' } }),
      this.prisma.appointment.count({ where: { clinicId, status: 'COMPLETED' } }),
    ]);

    // Per-doctor appointment counts
    const doctorsWithCounts = await this.prisma.doctorClinic.findMany({
      where: { clinicId },
      include: {
        doctor: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            speciality: { select: { name: true } },
            _count: { select: { appointments: true } },
          },
        },
      },
    });

    return {
      message: 'Dashboard fetched', data: {
        clinicId, totalAppointments, todayAppointments, totalDoctors,
        totalRevenue: totalRevenue._sum.amount || 0,
        monthRevenue: monthRevenue._sum.amount || 0,
        pending: pendingApts, confirmed: confirmedApts, completed: completedApts,
        doctors: doctorsWithCounts.map(d => d.doctor),
      },
    };
  }

  // Clinic Admin: get all appointments with filters
  async getClinicAppointments(userId: string, query: any) {
    const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
    if (!clinicAdmin) throw new NotFoundException();
    const { status, doctorId, date, page = 1, limit = 20 } = query;
    const where: any = { clinicId: clinicAdmin.clinicId };
    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (date) {
      const d = new Date(date); d.setHours(0, 0, 0, 0);
      const dEnd = new Date(date); dEnd.setHours(23, 59, 59, 999);
      where.scheduledDate = { gte: d, lte: dEnd };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where, skip, take: Number(limit),
        include: {
          patient: { include: { vitals: { orderBy: { recordedAt: 'desc' }, take: 1 } } },
          doctor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } }, speciality: true } },
          payment: true,
          prescription: { include: { medicines: true } },
        },
        orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
      }),
      this.prisma.appointment.count({ where }),
    ]);
    return { message: 'Appointments fetched', data: { appointments, total } };
  }

  // Clinic Admin: reschedule appointment
  async rescheduleAppointment(appointmentId: string, userId: string, dto: { scheduledDate: string; scheduledTime: string }) {
    const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
    if (!clinicAdmin) throw new NotFoundException();
    const apt = await this.prisma.appointment.findFirst({ where: { id: appointmentId, clinicId: clinicAdmin.clinicId } });
    if (!apt) throw new NotFoundException('Appointment not found');

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, isRescheduled: true, status: 'CONFIRMED' },
    });
    return { message: 'Appointment rescheduled', data: updated };
  }

  // Clinic Admin: accept payment (mark as paid for PAY_AT_CLINIC)
  async acceptPayment(appointmentId: string, userId: string) {
    const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
    if (!clinicAdmin) throw new NotFoundException();
    const payment = await this.prisma.payment.findUnique({ where: { appointmentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID', paidAt: new Date() },
    });
    await this.prisma.appointment.update({ where: { id: appointmentId }, data: { status: 'CONFIRMED' } });
    return { message: 'Payment accepted', data: updated };
  }

  // Clinic Admin: get patient history
  async getPatientHistory(patientId: string, userId: string) {
    const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
    if (!clinicAdmin) throw new NotFoundException();
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId, clinicId: clinicAdmin.clinicId },
      include: {
        doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } },
        prescription: { include: { medicines: true } },
        payment: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });
    const vitals = await this.prisma.patientVital.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    return { message: 'Patient history fetched', data: { patient, appointments, vitals } };
  }
}

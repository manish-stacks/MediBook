// src/appointments/appointments.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto, RescheduleAppointmentDto } from './dto/appointment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private mail: MailService,
  ) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    const patient = await this.prisma.patient.findFirst({ where: { id: dto.patientId, userId } });
    if (!patient) throw new ForbiddenException('Patient not found or not authorized');

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
      include: { user: { select: { firstName: true, lastName: true, email: true } }, speciality: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    // Check slot conflict
    const conflicting = await this.prisma.appointment.findFirst({
      where: { doctorId: dto.doctorId, scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, status: { notIn: ['CANCELLED'] } },
    });
    if (conflicting) throw new BadRequestException('This time slot is already booked. Please choose another slot.');

    const appointmentNo = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const appointment = await this.prisma.appointment.create({
      data: {
        id: uuidv4(), appointmentNo, userId,
        patientId: dto.patientId, doctorId: dto.doctorId, clinicId: dto.clinicId,
        scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime,
        paymentMode: dto.paymentMode || 'PAY_AT_CLINIC',
        notes: dto.notes, status: 'CONFIRMED',
      },
      include: {
        patient: true,
        doctor: { include: { user: { select: { firstName: true, lastName: true, email: true } }, speciality: true } },
        clinic: true,
      },
    });

    // Create payment record
    await this.prisma.payment.create({
      data: {
        appointmentId: appointment.id, userId,
        amount: doctor.consultationFee,
        status: dto.paymentMode === 'ONLINE' ? 'PENDING' : 'PENDING',
        paymentMode: dto.paymentMode || 'PAY_AT_CLINIC',
      },
    });

    // In-app notification
    await this.notifications.create({
      userId, title: 'Appointment Booked!',
      message: `Your appointment with Dr. ${doctor.user.firstName} ${doctor.user.lastName} on ${format(new Date(dto.scheduledDate), 'dd MMM')} at ${dto.scheduledTime} is confirmed.`,
      type: 'appointment',
    });

    // Send confirmation email
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } });
    if (user) {
      await this.mail.sendBookingConfirmation({
        patientEmail: user.email, patientName: user.firstName,
        doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
        speciality: doctor.speciality?.name || '',
        clinicName: appointment.clinic?.name || 'Clinic',
        clinicAddress: (appointment.clinic as any)?.address || '',
        date: format(new Date(dto.scheduledDate), 'EEEE, dd MMM yyyy'),
        time: dto.scheduledTime,
        appointmentNo,
        fee: `₹${Number(doctor.consultationFee)}`,
        paymentMode: dto.paymentMode === 'ONLINE' ? 'Online Payment' : 'Pay at Clinic',
      });
    }

    return { message: 'Appointment booked successfully', data: appointment };
  }

  async findAll(userId: string, role: string, query: any) {
    const { status, page = 1, limit = 10 } = query;
    const where: any = {};

    if (role === 'PATIENT') where.userId = userId;
    else if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (doctor) where.doctorId = doctor.id;
    } else if (role === 'CLINIC_ADMIN') {
      const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
      if (clinicAdmin) where.clinicId = clinicAdmin.clinicId;
    }

    if (status) where.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          patient: true,
          doctor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } }, speciality: true } },
          clinic: { select: { name: true, city: true } },
          payment: { select: { status: true, paymentMode: true, amount: true } },
        },
        orderBy: { scheduledDate: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      message: 'Appointments fetched',
      data: { appointments, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } },
    };
  }

  async findOne(id: string, userId: string, role: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { vitals: { orderBy: { recordedAt: 'desc' }, take: 5 } } },
        doctor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } }, speciality: true } },
        clinic: true,
        payment: true,
        prescription: { include: { medicines: true } },
        review: true,
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (role === 'PATIENT' && appointment.userId !== userId) throw new ForbiddenException('Access denied');

    return { message: 'Appointment fetched', data: appointment };
  }

  async updateStatus(id: string, userId: string, role: string, dto: UpdateAppointmentStatusDto) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id }, include: { doctor: { include: { user: true } } } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    if (dto.status === 'CANCELLED' && role === 'PATIENT' && appointment.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status, cancelReason: dto.cancelReason },
    });

    // Notify
    await this.notifications.create({
      userId: appointment.userId,
      title: 'Appointment Status Updated',
      message: `Your appointment #${appointment.appointmentNo} status: ${dto.status}`,
      type: 'appointment',
    });

    return { message: 'Appointment status updated', data: updated };
  }

  async reschedule(id: string, userId: string, dto: RescheduleAppointmentDto) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, userId } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) throw new BadRequestException('Cannot reschedule');

    const conflicting = await this.prisma.appointment.findFirst({
      where: { doctorId: appointment.doctorId, scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, status: { notIn: ['CANCELLED'] }, id: { not: id } },
    });
    if (conflicting) throw new BadRequestException('This slot is not available');

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, isRescheduled: true, status: 'CONFIRMED' },
    });
    return { message: 'Appointment rescheduled', data: updated };
  }

  async getStats(role: string, userId: string) {
    const where: any = {};
    if (role === 'PATIENT') where.userId = userId;
    else if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (doctor) where.doctorId = doctor.id;
    }

    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.appointment.count({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.appointment.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);
    return { message: 'Stats fetched', data: { total, pending, confirmed, completed, cancelled } };
  }
}

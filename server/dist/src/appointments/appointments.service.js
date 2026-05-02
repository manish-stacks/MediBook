"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const mail_service_1 = require("../mail/mail.service");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, notifications, mail) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.mail = mail;
    }
    async create(userId, dto) {
        const patient = await this.prisma.patient.findFirst({ where: { id: dto.patientId, userId } });
        if (!patient)
            throw new common_1.ForbiddenException('Patient not found or not authorized');
        const doctor = await this.prisma.doctor.findUnique({
            where: { id: dto.doctorId },
            include: { user: { select: { firstName: true, lastName: true, email: true } }, speciality: true },
        });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor not found');
        const conflicting = await this.prisma.appointment.findFirst({
            where: { doctorId: dto.doctorId, scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, status: { notIn: ['CANCELLED'] } },
        });
        if (conflicting)
            throw new common_1.BadRequestException('This time slot is already booked. Please choose another slot.');
        const appointmentNo = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const appointment = await this.prisma.appointment.create({
            data: {
                id: (0, uuid_1.v4)(), appointmentNo, userId,
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
        await this.prisma.payment.create({
            data: {
                appointmentId: appointment.id, userId,
                amount: doctor.consultationFee,
                status: dto.paymentMode === 'ONLINE' ? 'PENDING' : 'PENDING',
                paymentMode: dto.paymentMode || 'PAY_AT_CLINIC',
            },
        });
        await this.notifications.create({
            userId, title: 'Appointment Booked!',
            message: `Your appointment with Dr. ${doctor.user.firstName} ${doctor.user.lastName} on ${(0, date_fns_1.format)(new Date(dto.scheduledDate), 'dd MMM')} at ${dto.scheduledTime} is confirmed.`,
            type: 'appointment',
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } });
        if (user) {
            await this.mail.sendBookingConfirmation({
                patientEmail: user.email, patientName: user.firstName,
                doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
                speciality: doctor.speciality?.name || '',
                clinicName: appointment.clinic?.name || 'Clinic',
                clinicAddress: appointment.clinic?.address || '',
                date: (0, date_fns_1.format)(new Date(dto.scheduledDate), 'EEEE, dd MMM yyyy'),
                time: dto.scheduledTime,
                appointmentNo,
                fee: `₹${Number(doctor.consultationFee)}`,
                paymentMode: dto.paymentMode === 'ONLINE' ? 'Online Payment' : 'Pay at Clinic',
            });
        }
        return { message: 'Appointment booked successfully', data: appointment };
    }
    async findAll(userId, role, query) {
        const { status, page = 1, limit = 10 } = query;
        const where = {};
        if (role === 'PATIENT')
            where.userId = userId;
        else if (role === 'DOCTOR') {
            const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
            if (doctor)
                where.doctorId = doctor.id;
        }
        else if (role === 'CLINIC_ADMIN') {
            const clinicAdmin = await this.prisma.clinicAdmin.findUnique({ where: { userId } });
            if (clinicAdmin)
                where.clinicId = clinicAdmin.clinicId;
        }
        if (status)
            where.status = status;
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
    async findOne(id, userId, role) {
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
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (role === 'PATIENT' && appointment.userId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return { message: 'Appointment fetched', data: appointment };
    }
    async updateStatus(id, userId, role, dto) {
        const appointment = await this.prisma.appointment.findUnique({ where: { id }, include: { doctor: { include: { user: true } } } });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (dto.status === 'CANCELLED' && role === 'PATIENT' && appointment.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: dto.status, cancelReason: dto.cancelReason },
        });
        await this.notifications.create({
            userId: appointment.userId,
            title: 'Appointment Status Updated',
            message: `Your appointment #${appointment.appointmentNo} status: ${dto.status}`,
            type: 'appointment',
        });
        return { message: 'Appointment status updated', data: updated };
    }
    async reschedule(id, userId, dto) {
        const appointment = await this.prisma.appointment.findFirst({ where: { id, userId } });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (['COMPLETED', 'CANCELLED'].includes(appointment.status))
            throw new common_1.BadRequestException('Cannot reschedule');
        const conflicting = await this.prisma.appointment.findFirst({
            where: { doctorId: appointment.doctorId, scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, status: { notIn: ['CANCELLED'] }, id: { not: id } },
        });
        if (conflicting)
            throw new common_1.BadRequestException('This slot is not available');
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { scheduledDate: new Date(dto.scheduledDate), scheduledTime: dto.scheduledTime, isRescheduled: true, status: 'CONFIRMED' },
        });
        return { message: 'Appointment rescheduled', data: updated };
    }
    async getStats(role, userId) {
        const where = {};
        if (role === 'PATIENT')
            where.userId = userId;
        else if (role === 'DOCTOR') {
            const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
            if (doctor)
                where.doctorId = doctor.id;
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map
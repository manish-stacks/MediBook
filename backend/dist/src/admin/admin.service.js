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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = require("exceljs");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const [totalUsers, totalDoctors, totalClinics, totalAppointments, todayAppointments, monthAppointments, lastMonthAppointments, totalRevenue, monthRevenue, pendingAppointments, completedAppointments, cancelledAppointments, activeUsers, verifiedDoctors,] = await Promise.all([
            this.prisma.user.count({ where: { role: 'PATIENT' } }),
            this.prisma.doctor.count(),
            this.prisma.clinic.count({ where: { isActive: true } }),
            this.prisma.appointment.count(),
            this.prisma.appointment.count({ where: { scheduledDate: { gte: todayStart, lte: todayEnd } } }),
            this.prisma.appointment.count({ where: { createdAt: { gte: thisMonthStart } } }),
            this.prisma.appointment.count({ where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
            this.prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
            this.prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: thisMonthStart } }, _sum: { amount: true } }),
            this.prisma.appointment.count({ where: { status: 'PENDING' } }),
            this.prisma.appointment.count({ where: { status: 'COMPLETED' } }),
            this.prisma.appointment.count({ where: { status: 'CANCELLED' } }),
            this.prisma.user.count({ where: { isActive: true, role: 'PATIENT' } }),
            this.prisma.doctor.count({ where: { isVerified: true } }),
        ]);
        const monthlyData = await this.getMonthlyAppointments();
        const recentAppointments = await this.prisma.appointment.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { firstName: true, lastName: true } },
                doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
                clinic: { select: { name: true } },
                payment: { select: { amount: true, status: true } },
            },
        });
        const topDoctors = await this.prisma.doctor.findMany({
            take: 5,
            orderBy: { totalReviews: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true } },
                speciality: { select: { name: true } },
                _count: { select: { appointments: true } },
            },
        });
        const appointmentGrowth = lastMonthAppointments > 0
            ? (((monthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100).toFixed(1)
            : '100';
        return {
            message: 'Dashboard stats fetched',
            data: {
                overview: {
                    totalUsers, totalDoctors, totalClinics, totalAppointments,
                    todayAppointments, totalRevenue: totalRevenue._sum.amount || 0,
                    monthRevenue: monthRevenue._sum.amount || 0,
                    activeUsers, verifiedDoctors,
                },
                appointments: { pending: pendingAppointments, completed: completedAppointments, cancelled: cancelledAppointments, monthly: monthAppointments },
                growth: { appointments: appointmentGrowth },
                charts: { monthly: monthlyData },
                recent: { appointments: recentAppointments },
                topDoctors,
            },
        };
    }
    async getMonthlyAppointments() {
        const results = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const count = await this.prisma.appointment.count({ where: { createdAt: { gte: start, lte: end } } });
            const revenue = await this.prisma.payment.aggregate({
                where: { status: 'PAID', paidAt: { gte: start, lte: end } },
                _sum: { amount: true },
            });
            results.push({
                month: start.toLocaleString('default', { month: 'short' }),
                year: start.getFullYear(),
                appointments: count,
                revenue: Number(revenue._sum.amount || 0),
            });
        }
        return results;
    }
    async getAllDoctors(query) {
        const { page = 1, limit = 20, search, isVerified } = query;
        const where = {};
        if (isVerified !== undefined)
            where.isVerified = isVerified === 'true';
        if (search)
            where.user = { OR: [{ firstName: { contains: search } }, { email: { contains: search } }] };
        const skip = (Number(page) - 1) * Number(limit);
        const [doctors, total] = await Promise.all([
            this.prisma.doctor.findMany({
                where, skip, take: Number(limit),
                include: {
                    user: { select: { firstName: true, lastName: true, email: true, avatar: true, isActive: true } },
                    speciality: { select: { name: true } },
                    clinics: { include: { clinic: { select: { name: true } } }, take: 1 },
                    _count: { select: { appointments: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.doctor.count({ where }),
        ]);
        return { message: 'Doctors fetched', data: { doctors, total } };
    }
    async verifyDoctor(doctorId) {
        const doctor = await this.prisma.doctor.update({ where: { id: doctorId }, data: { isVerified: true } });
        return { message: 'Doctor verified', data: doctor };
    }
    async getAllAppointments(query) {
        const { page = 1, limit = 20, status, doctorId, clinicId, startDate, endDate } = query;
        const where = {};
        if (status)
            where.status = status;
        if (doctorId)
            where.doctorId = doctorId;
        if (clinicId)
            where.clinicId = clinicId;
        if (startDate || endDate) {
            where.scheduledDate = {};
            if (startDate)
                where.scheduledDate.gte = new Date(startDate);
            if (endDate)
                where.scheduledDate.lte = new Date(endDate);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [appointments, total] = await Promise.all([
            this.prisma.appointment.findMany({
                where, skip, take: Number(limit),
                include: {
                    patient: { select: { firstName: true, lastName: true } },
                    doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
                    clinic: { select: { name: true, city: true } },
                    payment: { select: { amount: true, status: true, paymentMode: true } },
                },
                orderBy: { scheduledDate: 'desc' },
            }),
            this.prisma.appointment.count({ where }),
        ]);
        return { message: 'Appointments fetched', data: { appointments, total } };
    }
    async exportAppointmentsExcel(query) {
        const { data } = await this.getAllAppointments({ ...query, limit: 10000 });
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Appointments');
        sheet.columns = [
            { header: 'Appointment No', key: 'no', width: 20 },
            { header: 'Patient', key: 'patient', width: 20 },
            { header: 'Doctor', key: 'doctor', width: 20 },
            { header: 'Clinic', key: 'clinic', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Time', key: 'time', width: 10 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Payment', key: 'payment', width: 12 },
            { header: 'Amount', key: 'amount', width: 12 },
        ];
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D8ABC' } };
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        for (const apt of data.appointments) {
            sheet.addRow({
                no: apt.appointmentNo,
                patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
                doctor: `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
                clinic: apt.clinic.name,
                date: new Date(apt.scheduledDate).toLocaleDateString('en-IN'),
                time: apt.scheduledTime,
                status: apt.status,
                payment: apt.payment?.paymentMode || '-',
                amount: apt.payment?.amount || 0,
            });
        }
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async createDoctor(dto) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(dto.password || 'Doctor@123', 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: 'DOCTOR',
                isVerified: true,
                isActive: true,
                gender: dto.gender,
                avatar: dto.avatar,
            },
        });
        const doctor = await this.prisma.doctor.create({
            data: {
                userId: user.id,
                specialityId: dto.specialityId,
                registrationNo: dto.registrationNo,
                experience: dto.experience || 0,
                about: dto.about,
                consultationFee: dto.consultationFee || 0,
                followUpFee: dto.followUpFee || 0,
                bookingUrl: `dr-${dto.firstName.toLowerCase()}-${dto.lastName.toLowerCase()}-${Date.now()}`,
                isVerified: true,
            },
        });
        if (dto.clinicId) {
            await this.prisma.doctorClinic.create({ data: { doctorId: doctor.id, clinicId: dto.clinicId } });
        }
        return { message: 'Doctor created', data: { user, doctor } };
    }
    async getRevenueStats() {
        const monthly = await this.getMonthlyAppointments();
        const bySpeciality = await this.prisma.appointment.groupBy({
            by: ['doctorId'],
            where: { status: 'COMPLETED' },
            _count: { id: true },
        });
        return { message: 'Revenue stats fetched', data: { monthly, bySpeciality } };
    }
    async updateDoctor(doctorId, dto) {
        const doctor = await this.prisma.doctor.update({
            where: { id: doctorId },
            data: {
                experience: dto.experience, about: dto.about,
                consultationFee: dto.consultationFee, followUpFee: dto.followUpFee,
                isAvailable: dto.isAvailable, isVerified: dto.isVerified,
                specialityId: dto.specialityId,
            },
        });
        return { message: 'Doctor updated', data: doctor };
    }
    async deleteDoctor(doctorId) {
        await this.prisma.doctor.update({ where: { id: doctorId }, data: { isAvailable: false } });
        const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (doctor)
            await this.prisma.user.update({ where: { id: doctor.userId }, data: { isActive: false } });
        return { message: 'Doctor deactivated' };
    }
    async getAllPatients(query) {
        const { page = 1, limit = 20, search } = query;
        const where = { isActive: true };
        if (search)
            where.OR = [{ firstName: { contains: search } }, { lastName: { contains: search } }];
        const skip = (Number(page) - 1) * Number(limit);
        const [patients, total] = await Promise.all([
            this.prisma.patient.findMany({
                where, skip, take: Number(limit),
                include: { user: { select: { email: true } }, _count: { select: { appointments: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.patient.count({ where }),
        ]);
        return { message: 'Patients fetched', data: { patients, total } };
    }
    async getPatientMedicalHistory(patientId) {
        const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
        const appointments = await this.prisma.appointment.findMany({
            where: { patientId },
            include: {
                doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } },
                clinic: { select: { name: true } },
                prescription: { include: { medicines: true } },
                payment: true,
            },
            orderBy: { scheduledDate: 'desc' },
        });
        const vitals = await this.prisma.patientVital.findMany({ where: { patientId }, orderBy: { recordedAt: 'desc' } });
        return { message: 'Patient history fetched', data: { patient, appointments, vitals } };
    }
    async getAllUsers(query) {
        const { page = 1, limit = 20, role, search } = query;
        const where = {};
        if (role)
            where.role = role;
        if (search)
            where.OR = [{ firstName: { contains: search } }, { email: { contains: search } }];
        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({ where, skip, take: Number(limit), select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true, avatar: true, phone: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.user.count({ where }),
        ]);
        return { message: 'Users fetched', data: { users, total } };
    }
    async createUser(dto) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(dto.password || 'User@123', 12);
        const user = await this.prisma.user.create({
            data: { email: dto.email, password: hashedPassword, firstName: dto.firstName, lastName: dto.lastName, role: dto.role || 'PATIENT', phone: dto.phone, isActive: true },
        });
        return { message: 'User created', data: user };
    }
    async updateUser(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { firstName: dto.firstName, lastName: dto.lastName, phone: dto.phone, role: dto.role, isActive: dto.isActive },
        });
        return { message: 'User updated', data: user };
    }
    async deleteUser(userId) {
        await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
        return { message: 'User deactivated' };
    }
    async toggleUserStatus(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const updated = await this.prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
        return { message: `User ${updated.isActive ? 'activated' : 'deactivated'}`, data: { isActive: updated.isActive } };
    }
    async getAllSpecialities() {
        const specialities = await this.prisma.speciality.findMany({ include: { _count: { select: { doctors: true } } }, orderBy: { name: 'asc' } });
        return { message: 'Specialities fetched', data: specialities };
    }
    async createSpeciality(dto) {
        const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const spec = await this.prisma.speciality.create({ data: { ...dto, slug } });
        return { message: 'Speciality created', data: spec };
    }
    async updateSpeciality(id, dto) {
        const spec = await this.prisma.speciality.update({ where: { id }, data: dto });
        return { message: 'Speciality updated', data: spec };
    }
    async deleteSpeciality(id) {
        const spec = await this.prisma.speciality.update({ where: { id }, data: { isActive: false } });
        return { message: 'Speciality deleted', data: spec };
    }
    async toggleSpeciality(id) {
        const spec = await this.prisma.speciality.findUnique({ where: { id } });
        if (!spec)
            throw new Error('Not found');
        const updated = await this.prisma.speciality.update({ where: { id }, data: { isActive: !spec.isActive } });
        return { message: 'Speciality toggled', data: updated };
    }
    async getAllBlogs(query) {
        const { page = 1, limit = 20, isPublished } = query;
        const where = {};
        if (isPublished !== undefined)
            where.isPublished = isPublished === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const [posts, total] = await Promise.all([
            this.prisma.blogPost.findMany({ where, skip, take: Number(limit), include: { author: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.blogPost.count({ where }),
        ]);
        return { message: 'Blogs fetched', data: { posts, total } };
    }
    async getAllNotifications(query) {
        const { page = 1, limit = 30 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const notifications = await this.prisma.notification.findMany({ skip, take: Number(limit), include: { user: { select: { firstName: true, email: true } } }, orderBy: { createdAt: 'desc' } });
        return { message: 'Notifications fetched', data: notifications };
    }
    async broadcastNotification(dto) {
        const users = await this.prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
        await this.prisma.notification.createMany({
            data: users.map(u => ({ userId: u.id, title: dto.title, message: dto.message, type: dto.type || 'system' })),
        });
        return { message: `Notification sent to ${users.length} users` };
    }
    async deleteNotification(id) {
        await this.prisma.notification.delete({ where: { id } });
        return { message: 'Notification deleted' };
    }
    async getContactForms(query) {
        const { page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const forms = await this.prisma.contactForm.findMany({ skip, take: Number(limit), orderBy: { createdAt: 'desc' } });
        return { message: 'Contact forms fetched', data: forms };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map
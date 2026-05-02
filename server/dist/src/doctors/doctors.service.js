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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DoctorsService = class DoctorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        const { specialityId, clinicId, city, minFee, maxFee, minExperience, rating, search, sortBy = 'rating', sortOrder = 'desc', page = 1, limit = 12, } = filter;
        const where = { isVerified: true, isAvailable: true };
        if (specialityId)
            where.specialityId = specialityId;
        if (minExperience)
            where.experience = { gte: Number(minExperience) };
        if (rating)
            where.rating = { gte: Number(rating) };
        if (minFee || maxFee) {
            where.consultationFee = {};
            if (minFee)
                where.consultationFee.gte = Number(minFee);
            if (maxFee)
                where.consultationFee.lte = Number(maxFee);
        }
        if (clinicId) {
            where.clinics = { some: { clinicId } };
        }
        if (city) {
            where.clinics = { some: { clinic: { city: { contains: city } } } };
        }
        const userFilter = { isActive: true };
        if (search) {
            userFilter.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
            ];
        }
        where.user = userFilter;
        const orderBy = {};
        if (sortBy === 'fee')
            orderBy.consultationFee = sortOrder;
        else if (sortBy === 'experience')
            orderBy.experience = sortOrder;
        else
            orderBy.rating = sortOrder;
        const skip = (page - 1) * limit;
        const [doctors, total] = await Promise.all([
            this.prisma.doctor.findMany({
                where,
                include: {
                    user: { select: { firstName: true, lastName: true, avatar: true, email: true } },
                    speciality: { select: { id: true, name: true, slug: true, icon: true } },
                    clinics: { include: { clinic: { select: { id: true, name: true, city: true } } } },
                    _count: { select: { appointments: true, reviews: true } },
                },
                orderBy,
                skip,
                take: Number(limit),
            }),
            this.prisma.doctor.count({ where }),
        ]);
        return {
            message: 'Doctors fetched',
            data: {
                doctors,
                pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            },
        };
    }
    async findOne(id) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true, email: true, phone: true } },
                speciality: true,
                clinics: { include: { clinic: true } },
                slots: { where: { isActive: true } },
                reviews: {
                    where: { isApproved: true },
                    include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: { select: { appointments: true, reviews: true } },
            },
        });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor not found');
        return { message: 'Doctor fetched', data: doctor };
    }
    async findByBookingUrl(bookingUrl) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { bookingUrl },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true } },
                speciality: true,
                clinics: { include: { clinic: true } },
                slots: { where: { isActive: true } },
                reviews: {
                    where: { isApproved: true },
                    include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
                    take: 5,
                },
            },
        });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor profile not found');
        return { message: 'Doctor profile fetched', data: doctor };
    }
    async getDoctorStats(doctorId) {
        const [totalAppointments, completedAppointments, totalEarnings, pendingAppointments] = await Promise.all([
            this.prisma.appointment.count({ where: { doctorId } }),
            this.prisma.appointment.count({ where: { doctorId, status: 'COMPLETED' } }),
            this.prisma.payment.aggregate({
                where: { appointment: { doctorId }, status: 'PAID' },
                _sum: { amount: true },
            }),
            this.prisma.appointment.count({ where: { doctorId, status: 'PENDING' } }),
        ]);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const todayAppointments = await this.prisma.appointment.count({
            where: {
                doctorId,
                scheduledDate: { gte: todayStart, lte: todayEnd },
                status: { notIn: ['CANCELLED'] },
            },
        });
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        const monthRevenue = await this.prisma.payment.aggregate({
            where: { appointment: { doctorId }, status: 'PAID', paidAt: { gte: thisMonthStart } },
            _sum: { amount: true },
        });
        const totalPatients = await this.prisma.appointment.groupBy({
            by: ['patientId'],
            where: { doctorId },
            _count: true,
        });
        const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId }, select: { rating: true, totalReviews: true } });
        return {
            message: 'Doctor stats fetched',
            data: {
                totalAppointments,
                completedAppointments,
                pendingAppointments,
                todayAppointments,
                totalEarnings: totalEarnings._sum.amount || 0,
                monthRevenue: monthRevenue._sum.amount || 0,
                totalPatients: totalPatients.length,
                rating: doctor?.rating || 0,
                totalReviews: doctor?.totalReviews || 0,
            },
        };
    }
    async getTodayAppointments(doctorId) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const appointments = await this.prisma.appointment.findMany({
            where: {
                doctorId,
                scheduledDate: { gte: todayStart, lte: todayEnd },
                status: { notIn: ['CANCELLED'] },
            },
            include: {
                patient: true,
                clinic: { select: { name: true } },
                payment: { select: { status: true, paymentMode: true } },
            },
            orderBy: { scheduledTime: 'asc' },
        });
        return { message: 'Today appointments fetched', data: appointments };
    }
    async updateProfile(doctorId, dto) {
        const doctor = await this.prisma.doctor.update({
            where: { id: doctorId },
            data: {
                experience: dto.experience,
                about: dto.about,
                education: dto.education ? JSON.stringify(dto.education) : undefined,
                languages: dto.languages ? JSON.stringify(dto.languages) : undefined,
                consultationFee: dto.consultationFee,
                followUpFee: dto.followUpFee,
            },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true } },
                speciality: true,
            },
        });
        return { message: 'Profile updated', data: doctor };
    }
    async getDoctorEarnings(doctorId, period = 'month') {
        const now = new Date();
        let startDate = new Date();
        if (period === 'week')
            startDate.setDate(now.getDate() - 7);
        else if (period === 'month')
            startDate.setMonth(now.getMonth() - 1);
        else
            startDate.setFullYear(now.getFullYear() - 1);
        const earnings = await this.prisma.payment.findMany({
            where: { appointment: { doctorId }, status: 'PAID', paidAt: { gte: startDate } },
            include: {
                appointment: {
                    select: { scheduledDate: true, patient: { select: { firstName: true, lastName: true } } },
                },
            },
            orderBy: { paidAt: 'desc' },
        });
        const total = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
        const monthly = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const rev = await this.prisma.payment.aggregate({
                where: { appointment: { doctorId }, status: 'PAID', paidAt: { gte: start, lte: end } },
                _sum: { amount: true },
            });
            const apts = await this.prisma.appointment.count({ where: { doctorId, createdAt: { gte: start, lte: end } } });
            monthly.push({ month: start.toLocaleString('default', { month: 'short' }), revenue: Number(rev._sum.amount || 0), appointments: apts });
        }
        return { message: 'Earnings fetched', data: { earnings, total, period, monthly } };
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map
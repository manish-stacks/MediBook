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
exports.SlotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let SlotsService = class SlotsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDoctorSlot(doctorId, dto) {
        const slot = await this.prisma.doctorSlot.create({
            data: {
                doctorId,
                day: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                duration: dto.slotDuration || 30,
            },
        });
        return { message: 'Slot created', data: slot };
    }
    async getDoctorSlots(doctorId) {
        const slots = await this.prisma.doctorSlot.findMany({
            where: { doctorId, isActive: true },
            orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
        });
        return { message: 'Slots fetched', data: slots };
    }
    async getAvailableSlots(doctorId, date) {
        if (!date)
            return { message: 'Date required', data: [] };
        let targetDate;
        try {
            targetDate = (0, date_fns_1.parseISO)(date);
        }
        catch {
            return { message: 'Invalid date', data: [] };
        }
        const dayMap = {
            Monday: 'MONDAY', Tuesday: 'TUESDAY', Wednesday: 'WEDNESDAY',
            Thursday: 'THURSDAY', Friday: 'FRIDAY', Saturday: 'SATURDAY', Sunday: 'SUNDAY',
        };
        const dayName = dayMap[(0, date_fns_1.format)(targetDate, 'EEEE')];
        const doctorSlots = await this.prisma.doctorSlot.findMany({
            where: { doctorId, day: dayName, isActive: true },
        });
        if (doctorSlots.length === 0)
            return { message: 'No slots available', data: [] };
        const dayStart = (0, date_fns_1.startOfDay)(targetDate);
        const dayEnd = (0, date_fns_1.addDays)(dayStart, 1);
        const bookedAppointments = await this.prisma.appointment.findMany({
            where: { doctorId, scheduledDate: { gte: dayStart, lt: dayEnd }, status: { notIn: ['CANCELLED'] } },
            select: { scheduledTime: true },
        });
        const bookedTimes = new Set(bookedAppointments.map((a) => a.scheduledTime));
        const availableSlots = [];
        for (const slot of doctorSlots) {
            const times = this.generateTimeSlots(slot.startTime, slot.endTime, slot.duration);
            for (const time of times) {
                availableSlots.push({ time, isAvailable: !bookedTimes.has(time), slotId: slot.id, window: `${slot.startTime}–${slot.endTime}` });
            }
        }
        return { message: 'Available slots fetched', data: availableSlots };
    }
    async getAvailableDates(doctorId, fromDate) {
        const start = fromDate ? (0, date_fns_1.parseISO)(fromDate) : new Date();
        const doctorSlots = await this.prisma.doctorSlot.findMany({ where: { doctorId, isActive: true }, select: { day: true } });
        const availableDays = new Set(doctorSlots.map((s) => s.day));
        const dates = [];
        const dayMap = {
            Monday: 'MONDAY', Tuesday: 'TUESDAY', Wednesday: 'WEDNESDAY',
            Thursday: 'THURSDAY', Friday: 'FRIDAY', Saturday: 'SATURDAY', Sunday: 'SUNDAY',
        };
        for (let i = 0; i < 30; i++) {
            const date = (0, date_fns_1.addDays)(start, i);
            const dayName = dayMap[(0, date_fns_1.format)(date, 'EEEE')];
            if (availableDays.has(dayName)) {
                dates.push({ date: (0, date_fns_1.format)(date, 'yyyy-MM-dd'), day: (0, date_fns_1.format)(date, 'EEEE'), isToday: i === 0 });
            }
        }
        return { message: 'Available dates fetched', data: dates };
    }
    async updateSlot(slotId, doctorId, dto) {
        const slot = await this.prisma.doctorSlot.findFirst({ where: { id: slotId, doctorId } });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        const updated = await this.prisma.doctorSlot.update({ where: { id: slotId }, data: { startTime: dto.startTime, endTime: dto.endTime, duration: dto.slotDuration, isActive: dto.isActive } });
        return { message: 'Slot updated', data: updated };
    }
    async deleteSlot(slotId, doctorId) {
        const slot = await this.prisma.doctorSlot.findFirst({ where: { id: slotId, doctorId } });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        await this.prisma.doctorSlot.update({ where: { id: slotId }, data: { isActive: false } });
        return { message: 'Slot deactivated' };
    }
    generateTimeSlots(startTime, endTime, duration) {
        const times = [];
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        let currentMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        while (currentMinutes + duration <= endMinutes) {
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;
            times.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
            currentMinutes += duration;
        }
        return times;
    }
};
exports.SlotsService = SlotsService;
exports.SlotsService = SlotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SlotsService);
//# sourceMappingURL=slots.service.js.map
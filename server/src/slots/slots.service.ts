// src/slots/slots.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSlotDto } from './dto/slot.dto';
import { DayOfWeek } from '@prisma/client';
import { addDays, format, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {}

  async createDoctorSlot(doctorId: string, dto: CreateSlotDto) {
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

  async getDoctorSlots(doctorId: string) {
    const slots = await this.prisma.doctorSlot.findMany({
      where: { doctorId, isActive: true },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    });
    return { message: 'Slots fetched', data: slots };
  }

  async getAvailableSlots(doctorId: string, date: string) {
    if (!date) return { message: 'Date required', data: [] };
    let targetDate: Date;
    try { targetDate = parseISO(date); } catch { return { message: 'Invalid date', data: [] }; }

    const dayMap: Record<string, DayOfWeek> = {
      Monday: 'MONDAY', Tuesday: 'TUESDAY', Wednesday: 'WEDNESDAY',
      Thursday: 'THURSDAY', Friday: 'FRIDAY', Saturday: 'SATURDAY', Sunday: 'SUNDAY',
    };
    const dayName = dayMap[format(targetDate, 'EEEE')] as DayOfWeek;

    const doctorSlots = await this.prisma.doctorSlot.findMany({
      where: { doctorId, day: dayName, isActive: true },
    });
    if (doctorSlots.length === 0) return { message: 'No slots available', data: [] };

    const dayStart = startOfDay(targetDate);
    const dayEnd = addDays(dayStart, 1);
    const bookedAppointments = await this.prisma.appointment.findMany({
      where: { doctorId, scheduledDate: { gte: dayStart, lt: dayEnd }, status: { notIn: ['CANCELLED'] } },
      select: { scheduledTime: true },
    });
    const bookedTimes = new Set(bookedAppointments.map((a) => a.scheduledTime));

    const availableSlots: any[] = [];
    for (const slot of doctorSlots) {
      const times = this.generateTimeSlots(slot.startTime, slot.endTime, slot.duration);
      for (const time of times) {
        availableSlots.push({ time, isAvailable: !bookedTimes.has(time), slotId: slot.id, window: `${slot.startTime}–${slot.endTime}` });
      }
    }
    return { message: 'Available slots fetched', data: availableSlots };
  }

  async getAvailableDates(doctorId: string, fromDate?: string) {
    const start = fromDate ? parseISO(fromDate) : new Date();
    const doctorSlots = await this.prisma.doctorSlot.findMany({ where: { doctorId, isActive: true }, select: { day: true } });
    const availableDays = new Set(doctorSlots.map((s) => s.day));
    const dates = [];
    const dayMap: Record<string, DayOfWeek> = {
      Monday: 'MONDAY', Tuesday: 'TUESDAY', Wednesday: 'WEDNESDAY',
      Thursday: 'THURSDAY', Friday: 'FRIDAY', Saturday: 'SATURDAY', Sunday: 'SUNDAY',
    };
    for (let i = 0; i < 30; i++) {
      const date = addDays(start, i);
      const dayName = dayMap[format(date, 'EEEE')] as DayOfWeek;
      if (availableDays.has(dayName)) {
        dates.push({ date: format(date, 'yyyy-MM-dd'), day: format(date, 'EEEE'), isToday: i === 0 });
      }
    }
    return { message: 'Available dates fetched', data: dates };
  }

  async updateSlot(slotId: string, doctorId: string, dto: Partial<CreateSlotDto>) {
    const slot = await this.prisma.doctorSlot.findFirst({ where: { id: slotId, doctorId } });
    if (!slot) throw new NotFoundException('Slot not found');
    const updated = await this.prisma.doctorSlot.update({ where: { id: slotId }, data: { startTime: dto.startTime, endTime: dto.endTime, duration: dto.slotDuration, isActive: dto.isActive } });
    return { message: 'Slot updated', data: updated };
  }

  async deleteSlot(slotId: string, doctorId: string) {
    const slot = await this.prisma.doctorSlot.findFirst({ where: { id: slotId, doctorId } });
    if (!slot) throw new NotFoundException('Slot not found');
    await this.prisma.doctorSlot.update({ where: { id: slotId }, data: { isActive: false } });
    return { message: 'Slot deactivated' };
  }

  private generateTimeSlots(startTime: string, endTime: string, duration: number): string[] {
    const times: string[] = [];
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
}

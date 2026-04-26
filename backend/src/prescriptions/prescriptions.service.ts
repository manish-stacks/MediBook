// src/prescriptions/prescriptions.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async create(doctorUserId: string, dto: any) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorUserId },
      include: { user: true, speciality: true },
    });
    if (!doctor) throw new ForbiddenException('Doctor profile not found');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { patient: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.doctorId !== doctor.id) throw new ForbiddenException('Access denied');

    const prescription = await this.prisma.prescription.create({
      data: {
        appointmentId: dto.appointmentId,
        doctorId: doctor.id,
        patientId: appointment.patientId,
        diagnosis: dto.diagnosis,
        notes: dto.notes,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
        medicines: {
          create: dto.medicines?.map((m: any) => ({
            name: m.name, dosage: m.dosage,
            morning: m.morning || false, afternoon: m.afternoon || false, evening: m.evening || false,
            duration: m.duration, instructions: m.instructions,
          })) || [],
        },
      },
      include: {
        medicines: true,
        doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } },
        patient: true,
      },
    });

    // Mark appointment completed
    await this.prisma.appointment.update({ where: { id: dto.appointmentId }, data: { status: 'COMPLETED' } });

    // Send visit complete email to patient's account user
    const patientUser = await this.prisma.user.findUnique({ where: { id: appointment.userId }, select: { email: true } });
    if (patientUser) {
      await this.mail.sendVisitComplete({
        email: patientUser.email,
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
        speciality: doctor.speciality?.name || '',
        date: format(new Date(appointment.scheduledDate), 'dd MMM yyyy'),
        diagnosis: dto.diagnosis || 'General Consultation',
        prescriptionId: prescription.id,
      });
    }

    return { message: 'Prescription created', data: prescription };
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        medicines: true,
        doctor: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            speciality: true,
            clinics: { include: { clinic: true }, take: 1 },
          },
        },
        patient: true,
        appointment: { select: { scheduledDate: true, clinic: { select: { name: true, address: true } } } },
      },
    });

    if (!prescription) throw new NotFoundException('Prescription not found');
    return { message: 'Prescription fetched', data: prescription };
  }

  async getByAppointment(appointmentId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { appointmentId },
      include: {
        medicines: true,
        doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } },
        patient: true,
      },
    });
    return { message: 'Prescription fetched', data: prescription };
  }

  async update(doctorUserId: string, id: string, dto: any) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) throw new Error('Doctor not found');

    const prescription = await this.prisma.prescription.findUnique({ where: { id } });
    if (!prescription || prescription.doctorId !== doctor.id) throw new Error('Not authorized');

    // Delete existing medicines and re-create
    await this.prisma.medicine.deleteMany({ where: { prescriptionId: id } });

    const updated = await this.prisma.prescription.update({
      where: { id },
      data: {
        diagnosis: dto.diagnosis,
        notes: dto.notes,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
        medicines: {
          create: dto.medicines?.map((m: any) => ({
            name: m.name, dosage: m.dosage,
            morning: m.morning || false, afternoon: m.afternoon || false, evening: m.evening || false,
            duration: m.duration, instructions: m.instructions,
          })) || [],
        },
      },
      include: { medicines: true, patient: true, doctor: { include: { user: true, speciality: true } } },
    });
    return { message: 'Prescription updated', data: updated };
  }

  async generatePdf(id: string): Promise<Buffer> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        medicines: true,
        doctor: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            speciality: true,
            clinics: { include: { clinic: true }, take: 1 },
          },
        },
        patient: true,
        appointment: { select: { scheduledDate: true, clinic: { select: { name: true, address: true, phone: true } } } },
      },
    });

    if (!prescription) throw new NotFoundException('Prescription not found');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primaryColor = rgb(0.02, 0.51, 0.75);
    const grayColor = rgb(0.5, 0.5, 0.5);
    const darkColor = rgb(0.1, 0.1, 0.1);

    // Header background
    page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: primaryColor });

    // Clinic/Doctor name
    page.drawText('MediBook', { x: 40, y: height - 40, size: 28, font: boldFont, color: rgb(1, 1, 1) });
    page.drawText('Digital Prescription', { x: 40, y: height - 65, size: 14, font, color: rgb(0.9, 0.9, 0.9) });

    // Doctor info
    const docName = `Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`;
    const specialty = prescription.doctor.speciality?.name || '';
    page.drawText(docName, { x: width - 250, y: height - 40, size: 14, font: boldFont, color: rgb(1, 1, 1) });
    page.drawText(specialty, { x: width - 250, y: height - 60, size: 11, font, color: rgb(0.9, 0.9, 0.9) });

    const clinic = prescription.appointment?.clinic;
    if (clinic) {
      page.drawText(clinic.name, { x: width - 250, y: height - 78, size: 10, font, color: rgb(0.85, 0.85, 0.85) });
      page.drawText(clinic.address || '', { x: width - 250, y: height - 94, size: 9, font, color: rgb(0.8, 0.8, 0.8) });
    }

    // Patient info section
    let y = height - 150;
    page.drawText('PATIENT INFORMATION', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
    page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });

    y -= 25;
    const patName = `${prescription.patient.firstName} ${prescription.patient.lastName}`;
    page.drawText(`Patient: ${patName}`, { x: 40, y, size: 11, font: boldFont, color: darkColor });
    page.drawText(`Date: ${new Date(prescription.appointment?.scheduledDate || '').toLocaleDateString('en-IN')}`, {
      x: width - 200, y, size: 11, font, color: darkColor,
    });

    y -= 18;
    const dob = prescription.patient.dateOfBirth;
    const age = dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A';
    page.drawText(`Age: ${age} years  |  Gender: ${prescription.patient.gender}`, { x: 40, y, size: 10, font, color: grayColor });

    // Diagnosis
    y -= 35;
    page.drawText('DIAGNOSIS', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
    page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });
    y -= 22;
    page.drawText(prescription.diagnosis || 'General Consultation', { x: 40, y, size: 11, font, color: darkColor });

    // Medicines
    y -= 35;
    page.drawText('PRESCRIBED MEDICINES', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
    page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });

    y -= 15;
    // Table header
    page.drawRectangle({ x: 40, y: y - 5, width: width - 80, height: 20, color: rgb(0.93, 0.97, 1) });
    page.drawText('Medicine', { x: 50, y, size: 9, font: boldFont, color: darkColor });
    page.drawText('Dosage', { x: 210, y, size: 9, font: boldFont, color: darkColor });
    page.drawText('Timing', { x: 310, y, size: 9, font: boldFont, color: darkColor });
    page.drawText('Duration', { x: 430, y, size: 9, font: boldFont, color: darkColor });

    for (const med of prescription.medicines) {
      y -= 25;
      const timing = [med.morning && 'Morning', med.afternoon && 'Afternoon', med.evening && 'Evening']
        .filter(Boolean).join(', ') || 'As directed';

      page.drawText(`• ${med.name}`, { x: 50, y, size: 10, font: boldFont, color: darkColor });
      page.drawText(med.dosage || '-', { x: 210, y, size: 10, font, color: darkColor });
      page.drawText(timing, { x: 310, y, size: 10, font, color: darkColor });
      page.drawText(med.duration ? `${med.duration} days` : '-', { x: 430, y, size: 10, font, color: darkColor });

      if (med.instructions) {
        y -= 14;
        page.drawText(`  Instructions: ${med.instructions}`, { x: 50, y, size: 9, font, color: grayColor });
      }
    }

    // Notes
    if (prescription.notes) {
      y -= 35;
      page.drawText('DOCTOR\'S NOTES', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
      page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });
      y -= 22;
      page.drawText(prescription.notes, { x: 40, y, size: 10, font, color: darkColor, maxWidth: width - 80 });
    }

    // Follow-up
    if (prescription.followUpDate) {
      y -= 35;
      page.drawText(`Follow-up Date: ${new Date(prescription.followUpDate).toLocaleDateString('en-IN')}`, {
        x: 40, y, size: 11, font: boldFont, color: primaryColor,
      });
    }

    // Footer
    page.drawLine({ start: { x: 40, y: 80 }, end: { x: width - 40, y: 80 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    page.drawText(`Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`, { x: 40, y: 60, size: 11, font: boldFont, color: darkColor });
    page.drawText(specialty, { x: 40, y: 44, size: 9, font, color: grayColor });
    page.drawText('Signature & Stamp', { x: 40, y: 28, size: 9, font, color: grayColor });
    page.drawText(`Generated by MediBook | ${new Date().toLocaleDateString('en-IN')}`, {
      x: width - 250, y: 28, size: 9, font, color: grayColor,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const pdf_lib_1 = require("pdf-lib");
const date_fns_1 = require("date-fns");
let PrescriptionsService = class PrescriptionsService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async create(doctorUserId, dto) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: doctorUserId },
            include: { user: true, speciality: true },
        });
        if (!doctor)
            throw new common_1.ForbiddenException('Doctor profile not found');
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
            include: { patient: true },
        });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (appointment.doctorId !== doctor.id)
            throw new common_1.ForbiddenException('Access denied');
        const prescription = await this.prisma.prescription.create({
            data: {
                appointmentId: dto.appointmentId,
                doctorId: doctor.id,
                patientId: appointment.patientId,
                diagnosis: dto.diagnosis,
                notes: dto.notes,
                followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
                medicines: {
                    create: dto.medicines?.map((m) => ({
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
        await this.prisma.appointment.update({ where: { id: dto.appointmentId }, data: { status: 'COMPLETED' } });
        const patientUser = await this.prisma.user.findUnique({ where: { id: appointment.userId }, select: { email: true } });
        if (patientUser) {
            await this.mail.sendVisitComplete({
                email: patientUser.email,
                patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
                speciality: doctor.speciality?.name || '',
                date: (0, date_fns_1.format)(new Date(appointment.scheduledDate), 'dd MMM yyyy'),
                diagnosis: dto.diagnosis || 'General Consultation',
                prescriptionId: prescription.id,
            });
        }
        return { message: 'Prescription created', data: prescription };
    }
    async findOne(id) {
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
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        return { message: 'Prescription fetched', data: prescription };
    }
    async getByAppointment(appointmentId) {
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
    async update(doctorUserId, id, dto) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorUserId } });
        if (!doctor)
            throw new Error('Doctor not found');
        const prescription = await this.prisma.prescription.findUnique({ where: { id } });
        if (!prescription || prescription.doctorId !== doctor.id)
            throw new Error('Not authorized');
        await this.prisma.medicine.deleteMany({ where: { prescriptionId: id } });
        const updated = await this.prisma.prescription.update({
            where: { id },
            data: {
                diagnosis: dto.diagnosis,
                notes: dto.notes,
                followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
                medicines: {
                    create: dto.medicines?.map((m) => ({
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
    async generatePdf(id) {
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
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        const pdfDoc = await pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const primaryColor = (0, pdf_lib_1.rgb)(0.02, 0.51, 0.75);
        const grayColor = (0, pdf_lib_1.rgb)(0.5, 0.5, 0.5);
        const darkColor = (0, pdf_lib_1.rgb)(0.1, 0.1, 0.1);
        page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: primaryColor });
        page.drawText('MediBook', { x: 40, y: height - 40, size: 28, font: boldFont, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
        page.drawText('Digital Prescription', { x: 40, y: height - 65, size: 14, font, color: (0, pdf_lib_1.rgb)(0.9, 0.9, 0.9) });
        const docName = `Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`;
        const specialty = prescription.doctor.speciality?.name || '';
        page.drawText(docName, { x: width - 250, y: height - 40, size: 14, font: boldFont, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
        page.drawText(specialty, { x: width - 250, y: height - 60, size: 11, font, color: (0, pdf_lib_1.rgb)(0.9, 0.9, 0.9) });
        const clinic = prescription.appointment?.clinic;
        if (clinic) {
            page.drawText(clinic.name, { x: width - 250, y: height - 78, size: 10, font, color: (0, pdf_lib_1.rgb)(0.85, 0.85, 0.85) });
            page.drawText(clinic.address || '', { x: width - 250, y: height - 94, size: 9, font, color: (0, pdf_lib_1.rgb)(0.8, 0.8, 0.8) });
        }
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
        y -= 35;
        page.drawText('DIAGNOSIS', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
        page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });
        y -= 22;
        page.drawText(prescription.diagnosis || 'General Consultation', { x: 40, y, size: 11, font, color: darkColor });
        y -= 35;
        page.drawText('PRESCRIBED MEDICINES', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
        page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });
        y -= 15;
        page.drawRectangle({ x: 40, y: y - 5, width: width - 80, height: 20, color: (0, pdf_lib_1.rgb)(0.93, 0.97, 1) });
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
        if (prescription.notes) {
            y -= 35;
            page.drawText('DOCTOR\'S NOTES', { x: 40, y, size: 10, font: boldFont, color: primaryColor });
            page.drawLine({ start: { x: 40, y: y - 5 }, end: { x: width - 40, y: y - 5 }, thickness: 1, color: primaryColor });
            y -= 22;
            page.drawText(prescription.notes, { x: 40, y, size: 10, font, color: darkColor, maxWidth: width - 80 });
        }
        if (prescription.followUpDate) {
            y -= 35;
            page.drawText(`Follow-up Date: ${new Date(prescription.followUpDate).toLocaleDateString('en-IN')}`, {
                x: 40, y, size: 11, font: boldFont, color: primaryColor,
            });
        }
        page.drawLine({ start: { x: 40, y: 80 }, end: { x: width - 40, y: 80 }, thickness: 1, color: (0, pdf_lib_1.rgb)(0.8, 0.8, 0.8) });
        page.drawText(`Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`, { x: 40, y: 60, size: 11, font: boldFont, color: darkColor });
        page.drawText(specialty, { x: 40, y: 44, size: 9, font, color: grayColor });
        page.drawText('Signature & Stamp', { x: 40, y: 28, size: 9, font, color: grayColor });
        page.drawText(`Generated by MediBook | ${new Date().toLocaleDateString('en-IN')}`, {
            x: width - 250, y: 28, size: 9, font, color: grayColor,
        });
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map
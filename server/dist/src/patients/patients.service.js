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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PatientsService = class PatientsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyPatients(userId) {
        const patients = await this.prisma.patient.findMany({
            where: { userId, isActive: true },
            include: {
                _count: { select: { appointments: true } },
            },
        });
        return { message: 'Patients fetched', data: patients };
    }
    async createPatient(userId, dto) {
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
    async updatePatient(userId, patientId, dto) {
        const patient = await this.prisma.patient.findFirst({ where: { id: patientId, userId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
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
    async deletePatient(userId, patientId) {
        const patient = await this.prisma.patient.findFirst({ where: { id: patientId, userId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        if (patient.relation === 'SELF')
            throw new common_1.ForbiddenException('Cannot delete primary profile');
        await this.prisma.patient.update({ where: { id: patientId }, data: { isActive: false } });
        return { message: 'Patient removed' };
    }
    async addVitals(patientId, doctorUserId, dto) {
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
    async getMedicalHistory(patientId) {
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
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map
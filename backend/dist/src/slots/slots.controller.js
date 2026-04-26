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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const slots_service_1 = require("./slots.service");
const slot_dto_1 = require("./dto/slot.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let SlotsController = class SlotsController {
    constructor(slotsService, prisma) {
        this.slotsService = slotsService;
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor)
            throw new Error('Doctor profile not found');
        return this.slotsService.createDoctorSlot(doctor.id, dto);
    }
    async getMySlots(userId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor)
            throw new Error('Doctor profile not found');
        return this.slotsService.getDoctorSlots(doctor.id);
    }
    getAvailableSlots(doctorId, date) {
        return this.slotsService.getAvailableSlots(doctorId, date);
    }
    getAvailableDates(doctorId, from) {
        return this.slotsService.getAvailableDates(doctorId, from);
    }
    async update(id, userId, dto) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor)
            throw new Error('Doctor profile not found');
        return this.slotsService.updateSlot(id, doctor.id, dto);
    }
    async remove(id, userId) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor)
            throw new Error('Doctor profile not found');
        return this.slotsService.deleteSlot(id, doctor.id);
    }
};
exports.SlotsController = SlotsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a doctor slot (Doctor only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, slot_dto_1.CreateSlotDto]),
    __metadata("design:returntype", Promise)
], SlotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-slots'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my slots (Doctor only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SlotsController.prototype, "getMySlots", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/available'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get available slots for a doctor on a date' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/dates'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get available dates for a doctor' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('from')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "getAvailableDates", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a slot' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SlotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a slot' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SlotsController.prototype, "remove", null);
exports.SlotsController = SlotsController = __decorate([
    (0, swagger_1.ApiTags)('Slots'),
    (0, common_1.Controller)('slots'),
    __metadata("design:paramtypes", [slots_service_1.SlotsService, prisma_service_1.PrismaService])
], SlotsController);
//# sourceMappingURL=slots.controller.js.map
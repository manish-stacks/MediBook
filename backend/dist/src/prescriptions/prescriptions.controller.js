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
exports.PrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prescriptions_service_1 = require("./prescriptions.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PrescriptionsController = class PrescriptionsController {
    constructor(prescriptionsService) {
        this.prescriptionsService = prescriptionsService;
    }
    create(userId, dto) {
        return this.prescriptionsService.create(userId, dto);
    }
    update(userId, id, dto) {
        return this.prescriptionsService.update(userId, id, dto);
    }
    findOne(id) {
        return this.prescriptionsService.findOne(id);
    }
    getByAppointment(appointmentId) {
        return this.prescriptionsService.getByAppointment(appointmentId);
    }
    async downloadPdf(id, res) {
        const buffer = await this.prescriptionsService.generatePdf(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="prescription-${id}.pdf"`,
            'Content-Length': buffer.length,
            'Cache-Control': 'public, max-age=3600',
        });
        res.end(buffer);
    }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create prescription (Doctor only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription (Doctor only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('appointment/:appointmentId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription by appointment ID' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "getByAppointment", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Download prescription as PDF (Public)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "downloadPdf", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Prescriptions'),
    (0, common_1.Controller)('prescriptions'),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService])
], PrescriptionsController);
//# sourceMappingURL=prescriptions.controller.js.map
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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const patients_service_1 = require("./patients.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PatientsController = class PatientsController {
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    getMyPatients(userId) {
        return this.patientsService.getMyPatients(userId);
    }
    create(userId, dto) {
        return this.patientsService.createPatient(userId, dto);
    }
    update(userId, id, dto) {
        return this.patientsService.updatePatient(userId, id, dto);
    }
    remove(userId, id) {
        return this.patientsService.deletePatient(userId, id);
    }
    getMedicalHistory(id) {
        return this.patientsService.getMedicalHistory(id);
    }
    addVitals(id, userId, dto) {
        return this.patientsService.addVitals(id, userId, dto);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my patients/family members' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getMyPatients", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add family member' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient/family member' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove family member' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient medical history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getMedicalHistory", null);
__decorate([
    (0, common_1.Post)(':id/vitals'),
    (0, swagger_1.ApiOperation)({ summary: 'Add patient vitals (Doctor only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "addVitals", null);
exports.PatientsController = PatientsController = __decorate([
    (0, swagger_1.ApiTags)('Patients'),
    (0, common_1.Controller)('patients'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map
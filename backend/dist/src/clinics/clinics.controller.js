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
exports.ClinicsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinics_service_1 = require("./clinics.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ClinicsController = class ClinicsController {
    constructor(clinicsService) {
        this.clinicsService = clinicsService;
    }
    findAll(query) { return this.clinicsService.findAll(query); }
    getMyClinic(userId) { return this.clinicsService.getMyClinic(userId); }
    getDashboard(userId) { return this.clinicsService.getClinicDashboard(userId); }
    getAppointments(userId, query) { return this.clinicsService.getClinicAppointments(userId, query); }
    getPatientHistory(patientId, userId) { return this.clinicsService.getPatientHistory(patientId, userId); }
    reschedule(id, userId, dto) { return this.clinicsService.rescheduleAppointment(id, userId, dto); }
    acceptPayment(id, userId) { return this.clinicsService.acceptPayment(id, userId); }
    findOne(id) { return this.clinicsService.findOne(id); }
    create(dto) { return this.clinicsService.create(dto); }
    update(id, dto) { return this.clinicsService.update(id, dto); }
    remove(id) { return this.clinicsService.remove(id); }
    assignDoctor(clinicId, doctorId) { return this.clinicsService.assignDoctor(clinicId, doctorId); }
};
exports.ClinicsController = ClinicsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me/clinic'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.CLINIC_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "getMyClinic", null);
__decorate([
    (0, common_1.Get)('me/dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.CLINIC_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('me/appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.CLINIC_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('me/patients/:patientId/history'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.CLINIC_ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "getPatientHistory", null);
__decorate([
    (0, common_1.Put)('me/appointments/:appointmentId/reschedule'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.CLINIC_ADMIN),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Post)('me/appointments/:appointmentId/accept-payment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.CLINIC_ADMIN),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "acceptPayment", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.CLINIC_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':clinicId/doctors/:doctorId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.CLINIC_ADMIN),
    __param(0, (0, common_1.Param)('clinicId')),
    __param(1, (0, common_1.Param)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClinicsController.prototype, "assignDoctor", null);
exports.ClinicsController = ClinicsController = __decorate([
    (0, swagger_1.ApiTags)('Clinics'),
    (0, common_1.Controller)('clinics'),
    __metadata("design:paramtypes", [clinics_service_1.ClinicsService])
], ClinicsController);
//# sourceMappingURL=clinics.controller.js.map
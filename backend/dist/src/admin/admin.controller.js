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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboard() { return this.adminService.getDashboardStats(); }
    getDoctors(query) { return this.adminService.getAllDoctors(query); }
    createDoctor(dto) { return this.adminService.createDoctor(dto); }
    updateDoctor(id, dto) { return this.adminService.updateDoctor(id, dto); }
    deleteDoctor(id) { return this.adminService.deleteDoctor(id); }
    verifyDoctor(id) { return this.adminService.verifyDoctor(id); }
    getAppointments(query) { return this.adminService.getAllAppointments(query); }
    async exportAppointments(query, res) {
        const buffer = await this.adminService.exportAppointmentsExcel(query);
        res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="appointments.xlsx"', 'Content-Length': buffer.length });
        res.end(buffer);
    }
    getPatients(query) { return this.adminService.getAllPatients(query); }
    getPatientHistory(id) { return this.adminService.getPatientMedicalHistory(id); }
    getUsers(query) { return this.adminService.getAllUsers(query); }
    createUser(dto) { return this.adminService.createUser(dto); }
    updateUser(id, dto) { return this.adminService.updateUser(id, dto); }
    deleteUser(id) { return this.adminService.deleteUser(id); }
    toggleUser(id) { return this.adminService.toggleUserStatus(id); }
    getSpecialities() { return this.adminService.getAllSpecialities(); }
    createSpeciality(dto) { return this.adminService.createSpeciality(dto); }
    updateSpeciality(id, dto) { return this.adminService.updateSpeciality(id, dto); }
    deleteSpeciality(id) { return this.adminService.deleteSpeciality(id); }
    toggleSpeciality(id) { return this.adminService.toggleSpeciality(id); }
    getBlogs(query) { return this.adminService.getAllBlogs(query); }
    getNotifications(query) { return this.adminService.getAllNotifications(query); }
    broadcast(dto) { return this.adminService.broadcastNotification(dto); }
    deleteNotification(id) { return this.adminService.deleteNotification(id); }
    getRevenue() { return this.adminService.getRevenueStats(); }
    getContacts(query) { return this.adminService.getContactForms(query); }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('doctors'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDoctors", null);
__decorate([
    (0, common_1.Post)('doctors'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createDoctor", null);
__decorate([
    (0, common_1.Put)('doctors/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateDoctor", null);
__decorate([
    (0, common_1.Delete)('doctors/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteDoctor", null);
__decorate([
    (0, common_1.Put)('doctors/:id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyDoctor", null);
__decorate([
    (0, common_1.Get)('appointments'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportAppointments", null);
__decorate([
    (0, common_1.Get)('patients'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPatients", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/history'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPatientHistory", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)('users/:id/toggle-status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleUser", null);
__decorate([
    (0, common_1.Get)('specialities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSpecialities", null);
__decorate([
    (0, common_1.Post)('specialities'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createSpeciality", null);
__decorate([
    (0, common_1.Put)('specialities/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateSpeciality", null);
__decorate([
    (0, common_1.Delete)('specialities/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteSpeciality", null);
__decorate([
    (0, common_1.Put)('specialities/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleSpeciality", null);
__decorate([
    (0, common_1.Get)('blogs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getBlogs", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Post)('notifications/broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Delete)('notifications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Get)('revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getContacts", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map
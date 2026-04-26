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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getAll() { return this.settingsService.getAllSettings(); }
    bulkUpdate(dto) { return this.settingsService.bulkUpdateSettings(dto.settings); }
    update(key, dto) {
        return this.settingsService.updateSetting(key, dto.value, dto.group, dto.label);
    }
    getPages() { return this.settingsService.getStaticPages(); }
    getPage(slug) { return this.settingsService.getStaticPage(slug); }
    upsertPage(slug, dto) {
        return this.settingsService.upsertStaticPage(slug, dto);
    }
    getTestimonials(admin) { return this.settingsService.getTestimonials(admin === 'true'); }
    createTestimonial(dto) { return this.settingsService.createTestimonial(dto); }
    updateTestimonial(id, dto) { return this.settingsService.updateTestimonial(id, dto); }
    deleteTestimonial(id) { return this.settingsService.deleteTestimonial(id); }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Put)('bulk'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Put)(':key'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('pages/all'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getPages", null);
__decorate([
    (0, common_1.Get)('pages/:slug'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getPage", null);
__decorate([
    (0, common_1.Put)('pages/:slug'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "upsertPage", null);
__decorate([
    (0, common_1.Get)('testimonials/all'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getTestimonials", null);
__decorate([
    (0, common_1.Post)('testimonials'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "createTestimonial", null);
__decorate([
    (0, common_1.Put)('testimonials/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateTestimonial", null);
__decorate([
    (0, common_1.Delete)('testimonials/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "deleteTestimonial", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map
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
exports.RescheduleAppointmentDto = exports.UpdateAppointmentStatusDto = exports.CreateAppointmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-25' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "timeSlotId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PaymentMode }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PaymentMode),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "paymentMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "notes", void 0);
class UpdateAppointmentStatusDto {
}
exports.UpdateAppointmentStatusDto = UpdateAppointmentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AppointmentStatus }),
    (0, class_validator_1.IsEnum)(client_1.AppointmentStatus),
    __metadata("design:type", String)
], UpdateAppointmentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentStatusDto.prototype, "cancelReason", void 0);
class RescheduleAppointmentDto {
}
exports.RescheduleAppointmentDto = RescheduleAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-26' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RescheduleAppointmentDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '11:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RescheduleAppointmentDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RescheduleAppointmentDto.prototype, "timeSlotId", void 0);
//# sourceMappingURL=appointment.dto.js.map
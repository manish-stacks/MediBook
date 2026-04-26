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
exports.GenerateTimeSlotsDto = exports.CreateSlotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateSlotDto {
}
exports.CreateSlotDto = CreateSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DayOfWeek }),
    (0, class_validator_1.IsEnum)(client_1.DayOfWeek),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '13:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSlotDto.prototype, "slotDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSlotDto.prototype, "isActive", void 0);
class GenerateTimeSlotsDto {
}
exports.GenerateTimeSlotsDto = GenerateTimeSlotsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateTimeSlotsDto.prototype, "date", void 0);
//# sourceMappingURL=slot.dto.js.map
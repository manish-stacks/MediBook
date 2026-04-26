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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        if (dto.phone) {
            const existingPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
            if (existingPhone)
                throw new common_1.ConflictException('Phone number already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                id: (0, uuid_1.v4)(),
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                gender: dto.gender,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                role: client_1.Role.PATIENT,
                isVerified: true,
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });
        await this.prisma.patient.create({
            data: {
                userId: user.id,
                firstName: dto.firstName,
                lastName: dto.lastName,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : new Date('1990-01-01'),
                gender: dto.gender || 'MALE',
                relation: 'SELF',
            },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return { message: 'Registration successful', data: { user, ...tokens } };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid email or password');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Account is deactivated');
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid email or password');
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });
        return {
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatar: user.avatar,
                },
                ...tokens,
            },
        };
    }
    async refreshTokens(dto) {
        try {
            const payload = this.jwtService.verify(dto.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'medibook-refresh-secret',
            });
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user || !user.refreshToken)
                throw new common_1.UnauthorizedException('Access denied');
            const isValid = await bcrypt.compare(dto.refreshToken, user.refreshToken);
            if (!isValid)
                throw new common_1.UnauthorizedException('Invalid refresh token');
            const tokens = await this.generateTokens(user.id, user.email, user.role);
            const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
            await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefreshToken } });
            return { message: 'Tokens refreshed', data: tokens };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, email: true, firstName: true, lastName: true,
                phone: true, avatar: true, gender: true, dateOfBirth: true,
                role: true, isVerified: true, createdAt: true,
                doctor: {
                    include: { speciality: true, clinics: { include: { clinic: true } } },
                },
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return { message: 'Profile fetched', data: user };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid)
            throw new common_1.BadRequestException('Current password is incorrect');
        const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
        return { message: 'Password changed successfully' };
    }
    async generateTokens(userId, email, role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role }, { secret: process.env.JWT_SECRET || 'medibook-secret-key', expiresIn: '15m' }),
            this.jwtService.signAsync({ sub: userId, email, role }, { secret: process.env.JWT_REFRESH_SECRET || 'medibook-refresh-secret', expiresIn: '7d' }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
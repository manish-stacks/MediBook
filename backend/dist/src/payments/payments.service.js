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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const crypto = require("crypto");
const date_fns_1 = require("date-fns");
let PaymentsService = class PaymentsService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
            !process.env.RAZORPAY_KEY_ID.includes('dummy') && !process.env.RAZORPAY_KEY_ID.includes('test_dummy')) {
            const Razorpay = require('razorpay');
            this.razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        }
    }
    async createOrder(userId, appointmentId) {
        const payment = await this.prisma.payment.findUnique({ where: { appointmentId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        if (!this.razorpay) {
            return {
                message: 'Order created (demo mode)',
                data: {
                    orderId: `order_demo_${Date.now()}`,
                    amount: Number(payment.amount) * 100,
                    currency: 'INR',
                    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
                    isMock: true,
                },
            };
        }
        const order = await this.razorpay.orders.create({
            amount: Number(payment.amount) * 100,
            currency: 'INR',
            receipt: payment.id,
        });
        await this.prisma.payment.update({ where: { id: payment.id }, data: { razorpayOrderId: order.id } });
        return {
            message: 'Order created',
            data: { orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID, isMock: false },
        };
    }
    async verifyPayment(dto) {
        if (this.razorpay && !dto.orderId.startsWith('order_demo_')) {
            const body = dto.orderId + '|' + dto.paymentId;
            const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
            if (expected !== dto.signature)
                throw new common_1.BadRequestException('Invalid payment signature');
        }
        const payment = await this.prisma.payment.findUnique({ where: { appointmentId: dto.appointmentId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        const updated = await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'PAID', razorpayOrderId: dto.orderId, razorpayPaymentId: dto.paymentId, paidAt: new Date() },
        });
        const appointment = await this.prisma.appointment.update({
            where: { id: dto.appointmentId },
            data: { status: 'CONFIRMED' },
            include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } } },
        });
        const user = await this.prisma.user.findUnique({ where: { id: payment.userId }, select: { email: true, firstName: true } });
        if (user) {
            await this.mail.sendPaymentReceipt({
                email: user.email,
                name: user.firstName,
                amount: `₹${Number(payment.amount)}`,
                paymentId: dto.paymentId || `DEMO-${Date.now()}`,
                appointmentNo: appointment.appointmentNo,
                doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
                date: (0, date_fns_1.format)(new Date(appointment.scheduledDate), 'dd MMM yyyy'),
                mode: 'Online Payment',
            });
        }
        return { message: 'Payment verified successfully', data: updated };
    }
    async getPaymentHistory(userId) {
        const payments = await this.prisma.payment.findMany({
            where: { userId },
            include: {
                appointment: {
                    include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } }, patient: { select: { firstName: true, lastName: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Payment history fetched', data: { payments, total: payments.length } };
    }
    async getPaymentById(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { appointment: { include: { doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } }, patient: true, clinic: true } } },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return { message: 'Payment fetched', data: payment };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
// src/payments/payments.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { format } from 'date-fns';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(private prisma: PrismaService, private mail: MailService) {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
        !process.env.RAZORPAY_KEY_ID.includes('dummy') && !process.env.RAZORPAY_KEY_ID.includes('test_dummy')) {
      const Razorpay = require('razorpay');
      this.razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    }
  }

  async createOrder(userId: string, appointmentId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { appointmentId } });
    if (!payment) throw new NotFoundException('Payment record not found');

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

  async verifyPayment(dto: { orderId: string; paymentId: string; signature: string; appointmentId: string }) {
    // Verify signature if real Razorpay
    if (this.razorpay && !dto.orderId.startsWith('order_demo_')) {
      const body = dto.orderId + '|' + dto.paymentId;
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');
      if (expected !== dto.signature) throw new BadRequestException('Invalid payment signature');
    }

    const payment = await this.prisma.payment.findUnique({ where: { appointmentId: dto.appointmentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PAID', razorpayOrderId: dto.orderId, razorpayPaymentId: dto.paymentId, paidAt: new Date() },
    });

    const appointment = await this.prisma.appointment.update({
      where: { id: dto.appointmentId },
      data: { status: 'CONFIRMED' },
      include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    // Send payment receipt email
    const user = await this.prisma.user.findUnique({ where: { id: payment.userId }, select: { email: true, firstName: true } });
    if (user) {
      await this.mail.sendPaymentReceipt({
        email: user.email,
        name: user.firstName,
        amount: `₹${Number(payment.amount)}`,
        paymentId: dto.paymentId || `DEMO-${Date.now()}`,
        appointmentNo: appointment.appointmentNo,
        doctorName: `${(appointment.doctor as any).user.firstName} ${(appointment.doctor as any).user.lastName}`,
        date: format(new Date(appointment.scheduledDate), 'dd MMM yyyy'),
        mode: 'Online Payment',
      });
    }

    return { message: 'Payment verified successfully', data: updated };
  }

  async getPaymentHistory(userId: string) {
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

  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { appointment: { include: { doctor: { include: { user: { select: { firstName: true, lastName: true } }, speciality: true } }, patient: true, clinic: true } } },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return { message: 'Payment fetched', data: payment };
  }
}

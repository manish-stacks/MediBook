// src/payments/payments.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order/:appointmentId')
  @ApiOperation({ summary: 'Create Razorpay order' })
  createOrder(@CurrentUser('id') userId: string, @Param('appointmentId') appointmentId: string) {
    return this.paymentsService.createOrder(userId, appointmentId);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay payment' })
  verifyPayment(@Body() dto: any) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  getHistory(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentHistory(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single payment details' })
  getPayment(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.js';
import { SslCommerzService } from '../services/sslcommerz.service.js';

@Controller('payments/sslcommerz')
export class PaymentsController {
  constructor(private readonly sslCommerzService: SslCommerzService) {}

  @Public()
  @Post('success')
  @HttpCode(HttpStatus.OK)
  async handlePaymentSuccess(@Body() payload: any) {
    const isValid = this.sslCommerzService.validatePayload(payload);
    return {
      status: isValid ? 'SUCCESS' : 'FAILED',
      tranId: payload?.tran_id,
      message: isValid ? 'Payment processed successfully' : 'Invalid payment payload signature',
    };
  }

  @Public()
  @Post('fail')
  @HttpCode(HttpStatus.OK)
  async handlePaymentFail(@Body() payload: any) {
    return {
      status: 'FAILED',
      tranId: payload?.tran_id,
      message: 'Payment failed at gateway',
    };
  }

  @Public()
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async handlePaymentCancel(@Body() payload: any) {
    return {
      status: 'CANCELLED',
      tranId: payload?.tran_id,
      message: 'Payment process was cancelled by user',
    };
  }
}

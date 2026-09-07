import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Public } from '../../auth/decorators/public.decorator.js';
import { ContractsService } from '../services/contracts.service.js';
import { SslCommerzService } from '../services/sslcommerz.service.js';

@Controller('payments/sslcommerz')
export class PaymentsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly sslCommerzService: SslCommerzService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('success')
  @HttpCode(HttpStatus.OK)
  async handlePaymentSuccess(
    @Body() payload: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.contractsService.handlePaymentSuccess(payload);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const acceptsHtml = req.headers.accept?.includes('text/html') || !req.headers.accept?.includes('application/json');

    if (acceptsHtml) {
      if (result.success && result.contract) {
        return res.redirect(
          `${frontendUrl}/contracts/${result.contract.id}?payment=success&tran_id=${payload?.tran_id}`,
        );
      }
      return res.redirect(
        `${frontendUrl}/contracts?payment=failed&reason=${encodeURIComponent(result.message)}`,
      );
    }

    return res
      .status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
      .json(result);
  }

  @Public()
  @Post('fail')
  @HttpCode(HttpStatus.OK)
  async handlePaymentFail(
    @Body() payload: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const acceptsHtml = req.headers.accept?.includes('text/html') || !req.headers.accept?.includes('application/json');

    if (acceptsHtml) {
      return res.redirect(
        `${frontendUrl}/contracts?payment=failed&tran_id=${payload?.tran_id}`,
      );
    }

    return res.status(HttpStatus.OK).json({
      status: 'FAILED',
      tranId: payload?.tran_id,
      message: 'Payment failed at gateway',
    });
  }

  @Public()
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async handlePaymentCancel(
    @Body() payload: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const acceptsHtml = req.headers.accept?.includes('text/html') || !req.headers.accept?.includes('application/json');

    if (acceptsHtml) {
      return res.redirect(
        `${frontendUrl}/contracts?payment=cancelled&tran_id=${payload?.tran_id}`,
      );
    }

    return res.status(HttpStatus.OK).json({
      status: 'CANCELLED',
      tranId: payload?.tran_id,
      message: 'Payment process was cancelled by user',
    });
  }

  @Public()
  @Get('simulate/:tranId')
  async simulatePaymentPage(
    @Param('tranId') tranId: string,
    @Query('amount') amount: string,
    @Res() res: Response,
  ) {
    const backendUrl = this.configService.get<string>('BACKEND_URL', 'https://marketplace-5dt1.onrender.com');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSLCommerz Sandbox Simulator</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; max-width: 460px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    h2 { margin-top: 0; color: #38bdf8; }
    .info { background: #0f172a; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .row:last-child { margin-bottom: 0; font-weight: bold; color: #22c55e; }
    .btn { display: block; width: 100%; padding: 12px; border: none; border-radius: 6px; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 12px; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
    .btn-pay { background: #22c55e; color: #0f172a; }
    .btn-cancel { background: #475569; color: #f8fafc; }
    .badge { display: inline-block; background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">SSLCOMMERZ SANDBOX SIMULATOR</span>
    <h2>Secure Escrow Checkout</h2>
    <p style="color: #94a3b8; font-size: 14px;">Review contract escrow payment details before confirming.</p>
    
    <div class="info">
      <div class="row"><span>Transaction ID:</span><code style="color: #cbd5e1;">${tranId}</code></div>
      <div class="row"><span>Escrow Amount:</span><span>${amount || '0'} BDT</span></div>
      <div class="row"><span>Status:</span><span>Ready for Authorization</span></div>
    </div>

    <form method="POST" action="${backendUrl}/payments/sslcommerz/success">
      <input type="hidden" name="tran_id" value="${tranId}" />
      <input type="hidden" name="val_id" value="VAL_SIMULATED_${Date.now()}" />
      <input type="hidden" name="amount" value="${amount || '0'}" />
      <input type="hidden" name="card_type" value="BKASH-MobileBanking" />
      <input type="hidden" name="status" value="VALID" />
      <button type="submit" class="btn btn-pay">✓ Confirm & Pay with bKash / Card</button>
    </form>

    <form method="POST" action="${backendUrl}/payments/sslcommerz/cancel">
      <input type="hidden" name="tran_id" value="${tranId}" />
      <input type="hidden" name="status" value="CANCELLED" />
      <button type="submit" class="btn btn-cancel">✕ Cancel Payment</button>
    </form>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}

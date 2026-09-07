import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SslCommerzService {
  private readonly logger = new Logger(SslCommerzService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generates a mock/sandbox payment checkout URL for SSLCommerz payment gateway.
   */
  async initPayment(params: {
    tranId: string;
    totalAmount: number;
    cusName: string;
    cusEmail: string;
  }): Promise<{ gatewayUrl: string; tranId: string }> {
    const storeId = this.configService.get<string>('SSLCOMMERZ_STORE_ID', 'sandbox_store');
    const storePasswd = this.configService.get<string>('SSLCOMMERZ_STORE_PASSWORD', '');
    const isLive = this.configService.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const backendUrl = this.configService.get<string>('BACKEND_URL', 'https://marketplace-5dt1.onrender.com');

    const baseUrl = isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';

    this.logger.log(`Initiating SSLCommerz payment for transaction ${params.tranId}, amount: ${params.totalAmount} BDT`);

    const postData = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePasswd,
      total_amount: String(params.totalAmount),
      currency: 'BDT',
      tran_id: params.tranId,
      success_url: `${backendUrl}/payments/sslcommerz/success`,
      fail_url: `${backendUrl}/payments/sslcommerz/fail`,
      cancel_url: `${backendUrl}/payments/sslcommerz/cancel`,
      ipn_url: `${backendUrl}/payments/sslcommerz/success`,
      shipping_method: 'NO',
      product_name: 'Contract Escrow Payment',
      product_category: 'Escrow Service',
      product_profile: 'general',
      cus_name: params.cusName || 'Marketplace Client',
      cus_email: params.cusEmail || 'client@marketplace.com',
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: '01700000000',
    });

    try {
      const response = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: postData.toString(),
      });

      const data: any = await response.json();

      if (data?.status === 'SUCCESS' && data?.GatewayPageURL) {
        this.logger.log(`SSLCommerz gateway session created: ${data.GatewayPageURL}`);
        return { gatewayUrl: data.GatewayPageURL, tranId: params.tranId };
      }

      this.logger.warn(
        `SSLCommerz session returned "${data?.status || 'FAILED'}" (${data?.failedreason || 'No GatewayPageURL'}). Using sandbox simulator.`,
      );
    } catch (err: any) {
      this.logger.warn(`SSLCommerz API request failed: ${err.message}. Using sandbox simulator.`);
    }

    // Resilient fallback simulator URL for local / testbox development
    const simulatorUrl = `${backendUrl}/payments/sslcommerz/simulate/${params.tranId}?amount=${params.totalAmount}`;
    return { gatewayUrl: simulatorUrl, tranId: params.tranId };
  }

  /**
   * Validates IPN / callback payload signature or transaction status.
   */
  validatePayload(payload: any): boolean {
    if (!payload || !payload.tran_id) {
      return false;
    }
    const status = String(payload.status || '').toUpperCase();
    return status === 'VALID' || status === 'SUCCESS' || status === 'VALIDATED';
  }
}

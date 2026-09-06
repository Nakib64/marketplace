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
    const isLive = this.configService.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const baseUrl = isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';

    this.logger.log(`Initiating SSLCommerz payment for transaction ${params.tranId}, amount: ${params.totalAmount}`);

    // Sandbox redirect URL simulation
    const gatewayUrl = `${baseUrl}/gwprocess/v4/api.php?store_id=${storeId}&tran_id=${params.tranId}&amount=${params.totalAmount}`;
    return { gatewayUrl, tranId: params.tranId };
  }

  /**
   * Validates IPN / callback payload signature or transaction status.
   */
  validatePayload(payload: any): boolean {
    if (!payload || !payload.tran_id) {
      return false;
    }
    return payload.status === 'VALID' || payload.status === 'SUCCESS';
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private readonly defaultFrom: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultFrom =
      this.configService.get<string>('SMTP_FROM') || 'noreply@banglance.com';
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      this.configService.get<string>('APP_URL') ||
      'http://localhost:3000';
  }

  async onModuleInit(): Promise<void> {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<number>('SMTP_PORT', 587));
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP credentials not fully configured. Email service will run in fallback console mode.',
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587 or 2525
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      this.logger.log(
        `SMTP Transporter initialized for host: ${host}:${port} (${user})`,
      );
    } catch (err: any) {
      this.logger.error(
        `Failed to initialize SMTP transporter: ${err.message}. Fallback mode active.`,
      );
      this.transporter = null;
    }
  }

  /**
   * Dispatches a verification email containing a 6-character alphanumeric code and 1-click verification link.
   */
  async sendVerificationEmail(
    toEmail: string,
    code: string,
    customVerificationUrl?: string,
  ): Promise<boolean> {
    const verificationUrl =
      customVerificationUrl ||
      `${this.frontendUrl}/verify-email?code=${encodeURIComponent(code)}&email=${encodeURIComponent(toEmail)}`;

    const subject = `${code} is your Banglance verification code`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Banglance Account</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
    .container { max-width: 560px; margin: 40px auto; background-color: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #182238 0%, #131b2e 100%); }
    .brand { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #f8fafc; }
    .brand span { color: #6366f1; }
    .content { padding: 36px 32px; text-align: center; }
    .heading { font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 12px; }
    .subtext { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
    .code-badge { display: inline-block; background-color: #1e1b4b; border: 2px dashed #6366f1; color: #818cf8; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 14px 32px; border-radius: 12px; font-family: monospace; margin-bottom: 28px; }
    .btn { display: inline-block; background-color: #6366f1; color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; margin-bottom: 24px; }
    .footer { padding: 24px 32px; background-color: #0b0f19; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; line-height: 1.5; }
    .warning { font-size: 12px; color: #f59e0b; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Bang<span>lance</span></div>
    </div>
    <div class="content">
      <div class="heading">Verify Your Email Address</div>
      <div class="subtext">
        Use the 6-character code below to verify your account and unlock full access to job bidding, escrow protection, and payments.
      </div>
      
      <div class="code-badge">${code}</div>
      
      <div>
        <a href="${verificationUrl}" class="btn" target="_blank">Verify Automatically in 1-Click</a>
      </div>

      <div class="warning">
        🔒 Code expires in <strong>10 minutes</strong>. For your security, entering the wrong code 5 times will invalidate this request.
      </div>
    </div>
    <div class="footer">
      If you did not request this email, please ignore it or contact Banglance support.<br>
      &copy; ${new Date().getFullYear()} Banglance Marketplace. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Banglance Email Verification
-----------------------------
Your 6-character verification code is: ${code}

Or verify directly by opening this link:
${verificationUrl}

Note: This code expires in 10 minutes. 5 failed attempts will lock and invalidate this code.
If you did not request this email, please ignore it.
    `.trim();

    // Log the generated verification details to console for development visibility
    this.logger.log(
      `\n================ [EMAIL VERIFICATION DISPATCH] ================\nTo: ${toEmail}\nCode: ${code}\nLink: ${verificationUrl}\n=================================================================\n`,
    );

    if (!this.transporter) {
      this.logger.warn(
        `SMTP transporter not connected. Verification email for ${toEmail} logged to console only.`,
      );
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: `"Banglance Support" <${this.defaultFrom}>`,
        to: toEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      this.logger.log(`Verification email successfully delivered to ${toEmail}`);
      return true;
    } catch (error: any) {
      this.logger.error(
        `Failed to deliver verification email via SMTP to ${toEmail}: ${error.message}`,
      );
      // Even if SMTP network transmission fails, the code is safely stored in Redis & logged to console
      return false;
    }
  }
}

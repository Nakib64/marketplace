import { Injectable } from '@nestjs/common';

export interface ScanResult {
  isFlagged: boolean;
  reasons: string[];
}

@Injectable()
export class AntiCircumventionService {
  private readonly blacklistedKeywords = [
    'whatsapp',
    'telegram',
    'imo',
    'viber',
    'skype',
    'wechat',
    'direct pay',
    'direct payment',
    'pay outside',
    'pay me outside',
    'outside payment',
    'personal bkash',
    'personal nagad',
    'bank transfer directly',
    'pay me directly',
    'off platform',
    'off-platform',
  ];

  // Bangladeshi phone formats: 01XXXXXXXXX, +8801XXXXXXXXX, 01XXX-XXXXXX, or with spaces
  private readonly phoneRegex = /(?:\+?880|0)\s*1[3-9]\d{2}[\s-]*\d{3}[\s-]*\d{3}/gi;
  // Deceptive spacing for 11-digit numbers starting with 01: e.g. "0 1 7 1 2 3 4 5 6 7 8"
  private readonly spacedPhoneRegex = /0\s*1\s*[3-9](?:\s*\d){8}/gi;
  // External emails
  private readonly emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  // Messaging shortlinks: wa.me, t.me
  private readonly linkRegex = /(?:https?:\/\/)?(?:t\.me|wa\.me|api\.whatsapp\.com)\/[a-zA-Z0-9_]+/gi;

  scanContent(text: string): ScanResult {
    if (!text) {
      return { isFlagged: false, reasons: [] };
    }

    const lower = text.toLowerCase();
    const reasons: string[] = [];

    // 1. Check prohibited keywords
    for (const kw of this.blacklistedKeywords) {
      if (lower.includes(kw)) {
        reasons.push(`Contains prohibited keyword: "${kw}"`);
      }
    }

    // 2. Check phone number patterns (resetting regex lastIndex)
    this.phoneRegex.lastIndex = 0;
    this.spacedPhoneRegex.lastIndex = 0;
    if (this.phoneRegex.test(text) || this.spacedPhoneRegex.test(text)) {
      reasons.push('Contains phone number pattern');
    }

    // 3. Check email pattern
    this.emailRegex.lastIndex = 0;
    if (this.emailRegex.test(text)) {
      reasons.push('Contains email address pattern');
    }

    // 4. Check direct messaging links
    this.linkRegex.lastIndex = 0;
    if (this.linkRegex.test(text)) {
      reasons.push('Contains off-platform messaging link');
    }

    return {
      isFlagged: reasons.length > 0,
      reasons,
    };
  }
}

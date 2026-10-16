import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLoggerService } from '../services/audit-logger.service.js';

@Injectable()
export class AdminAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AdminAuditInterceptor.name);

  constructor(private readonly auditLogger: AuditLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method.toUpperCase();
    const url = req.originalUrl || req.url || '';

    // Only audit mutating HTTP actions on /admin routes
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const isAdminRoute = url.startsWith('/admin') && !url.includes('/admin/auth/login');

    if (!isMutation || !isAdminRoute) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordAuditLog(req, method, url).catch((err) => {
            this.logger.error(`Failed to record automated audit log: ${err.message}`);
          });
        },
      }),
    );
  }

  private async recordAuditLog(req: Request, method: string, url: string) {
    const adminId = (req as any).user?.id;
    if (!adminId) {
      return; // Skip if unauthenticated
    }

    const pathSegments = url.split('?')[0].split('/').filter(Boolean);
    // e.g. ['admin', 'users', 'uuid-123', 'status'] -> targetType: 'USERS', targetId: 'uuid-123'
    const targetType = (pathSegments[1] || 'ADMIN').toUpperCase();
    const targetId = (req.params as any)?.id || pathSegments[2] || undefined;
    const actionVerb = pathSegments[pathSegments.length - 1]?.toUpperCase() || method;
    const action = `${targetType}_${actionVerb}`;

    // Sanitize request body to remove sensitive fields
    const sanitizedBody = this.sanitizePayload(req.body);

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown';

    await this.auditLogger.logAction({
      adminId,
      action,
      targetType,
      targetId,
      details: Object.keys(sanitizedBody).length ? JSON.stringify(sanitizedBody) : undefined,
      ipAddress,
    });
  }

  private sanitizePayload(body: any): any {
    if (!body || typeof body !== 'object') {
      return {};
    }
    const clone = { ...body };
    const sensitiveKeys = ['password', 'secret', 'twoFactorSecret', 'token', 'refreshToken', 'accessToken'];

    for (const key of Object.keys(clone)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        clone[key] = '[REDACTED]';
      }
    }
    return clone;
  }
}

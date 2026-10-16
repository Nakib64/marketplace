import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminAuditInterceptor } from './admin-audit.interceptor.js';

describe('AdminAuditInterceptor', () => {
  let interceptor: AdminAuditInterceptor;
  let auditLoggerMock: any;

  beforeEach(() => {
    auditLoggerMock = {
      logAction: vi.fn().mockResolvedValue({}),
    };
    interceptor = new AdminAuditInterceptor(auditLoggerMock);
  });

  const mockContext = (url: string, method = 'POST', user?: any, body?: any) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          originalUrl: url,
          url,
          method,
          user: user || { id: 'admin-123' },
          body: body || { status: 'BANNED', password: 'secret_password' },
          params: { id: 'user-456' },
          headers: { 'x-forwarded-for': '127.0.0.1' },
          socket: {},
        }),
      }),
    } as any;
  };

  const mockCallHandler = (returnValue: any = { success: true }) => {
    return {
      handle: () => of(returnValue),
    } as any;
  };

  it('should automatically log mutating admin requests with redacted sensitive fields', async () => {
    const context = mockContext('/admin/users/user-456/status', 'PATCH');
    const handler = mockCallHandler();

    await new Promise<void>((resolve) => {
      interceptor.intercept(context, handler).subscribe({
        next: () => {
          setTimeout(() => {
            expect(auditLoggerMock.logAction).toHaveBeenCalledWith(
              expect.objectContaining({
                adminId: 'admin-123',
                targetType: 'USERS',
                targetId: 'user-456',
                ipAddress: '127.0.0.1',
              }),
            );
            const callArgs = auditLoggerMock.logAction.mock.calls[0][0];
            expect(callArgs.details).toContain('[REDACTED]');
            expect(callArgs.details).not.toContain('secret_password');
            resolve();
          }, 10);
        },
      });
    });
  });

  it('should ignore GET requests to admin', async () => {
    const context = mockContext('/admin/users', 'GET');
    const handler = mockCallHandler();

    await new Promise<void>((resolve) => {
      interceptor.intercept(context, handler).subscribe({
        next: () => {
          expect(auditLoggerMock.logAction).not.toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should ignore non-admin routes', async () => {
    const context = mockContext('/jobs', 'POST');
    const handler = mockCallHandler();

    await new Promise<void>((resolve) => {
      interceptor.intercept(context, handler).subscribe({
        next: () => {
          expect(auditLoggerMock.logAction).not.toHaveBeenCalled();
          resolve();
        },
      });
    });
  });
});

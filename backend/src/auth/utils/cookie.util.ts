import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';
export const ADMIN_ACCESS_TOKEN_COOKIE = 'admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'admin_refresh_token';

// 24 hours in milliseconds
export const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;
// 7 days in milliseconds
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function getCookieOptions(maxAgeMs: number): CookieOptions {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RAILWAY_ENVIRONMENT) ||
    Boolean(process.env.RAILWAY_STATIC_URL);
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: cookieDomain ? 'lax' : isProduction ? 'none' : 'lax',
    domain: cookieDomain,
    maxAge: maxAgeMs,
    path: '/',
  };
}

export function getClearCookieOptions(): CookieOptions {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RAILWAY_ENVIRONMENT) ||
    Boolean(process.env.RAILWAY_STATIC_URL);
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: cookieDomain ? 'lax' : isProduction ? 'none' : 'lax',
    domain: cookieDomain,
    path: '/',
  };
}

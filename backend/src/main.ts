import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

// Security HTTP Headers
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve uploaded static files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Security HTTP Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Parse Cookie headers
  app.use(cookieParser());

  // Strict CORS policy allowing both customer frontend and admin frontend
  const rawOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001',
    process.env.ADDITIONAL_ORIGINS || '',
  ]
    .flatMap((entry) => entry.split(','))
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const allowedOrigins = Array.from(new Set(rawOrigins));

  app.enableCors({
    origin: (origin: any, callback: any) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      const domainSuffix = process.env.COOKIE_DOMAIN?.replace(/^\./, '');
      const matchesCookieDomain =
        domainSuffix &&
        (normalized.endsWith(`.${domainSuffix}`) || normalized.endsWith(`://${domainSuffix}`));

      if (
        allowedOrigins.includes(normalized) ||
        allowedOrigins.includes('*') ||
        matchesCookieDomain
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
 
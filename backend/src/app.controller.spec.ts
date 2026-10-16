import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { RedisService } from './redis/redis.service.js';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const prismaMock = {
      $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
    };

    const redisMock = {
      isReady: vi.fn().mockReturnValue(true),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return welcome message', () => {
      expect(appController.getHello()).toBe('Freelance Marketplace API is online and healthy.');
    });
  });

  describe('health', () => {
    it('should return system health status', async () => {
      const health = await appController.getHealth();
      expect(health.status).toBe('ok');
      expect(health.services.database).toBe('healthy');
      expect(health.services.redis).toBe('healthy');
      expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);
    });
  });
});

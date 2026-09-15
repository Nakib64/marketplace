import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('[Migration] Adding slug columns and unique indexes...');

  await prisma.$executeRawUnsafe(`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "slug" TEXT;`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Job_slug_key" ON "Job"("slug");`);

  await prisma.$executeRawUnsafe(`ALTER TABLE "ClientProfile" ADD COLUMN IF NOT EXISTS "slug" TEXT;`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ClientProfile_slug_key" ON "ClientProfile"("slug");`);

  await prisma.$executeRawUnsafe(`ALTER TABLE "FreelancerProfile" ADD COLUMN IF NOT EXISTS "slug" TEXT;`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "FreelancerProfile_slug_key" ON "FreelancerProfile"("slug");`);

  console.log('[Migration] Successfully added slug columns and unique indexes.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

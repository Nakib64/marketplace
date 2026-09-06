import 'dotenv/config';
import { AdminRole, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
});

async function main() {
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@marketplace.com').toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@12345678!';
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Super Administrator';

  console.log(`[Seed] Checking for initial Super Admin at ${adminEmail}...`);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`[Seed] Super Admin [${adminEmail}] already exists. Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`[Seed] Successfully created Super Admin: [${admin.email}] (Role: ${admin.role})`);
}

main()
  .catch((e) => {
    console.error('[Seed] Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

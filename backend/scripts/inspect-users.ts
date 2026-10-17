import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['nafiz2282@gmail.com', 'nafizuddowla01@gmail.com'],
      },
    },
    include: {
      clientProfile: true,
      freelancerProfile: true,
      postedJobs: {
        select: { id: true, title: true, status: true },
      },
      proposals: {
        select: { id: true, status: true, bidAmount: true },
      },
      clientContracts: {
        select: { id: true, status: true, escrowAmount: true },
      },
      freelancerContracts: {
        select: { id: true, status: true, escrowAmount: true },
      },
    },
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

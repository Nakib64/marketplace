import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const CONTRACT_ID = '1800cd5c-193b-40c1-a31d-a04b528e8a5d';
const API_URL = 'http://localhost:4000';

async function main() {
  console.log(`[Reviews] Resetting existing reviews for contract ${CONTRACT_ID}...`);
  await prisma.review.deleteMany({
    where: { contractId: CONTRACT_ID },
  });

  console.log('[Reviews] Deleted previous review records. Now submitting through live HTTP API...');

  // Helper to authenticate
  async function loginAndGetCookies(email: string, password: string): Promise<string> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(`Login failed for ${email}: ${res.status} ${await res.text()}`);
    }

    const setCookies = res.headers.get('set-cookie');
    if (!setCookies) {
      throw new Error(`No cookies returned for ${email}`);
    }
    return setCookies;
  }

  // Helper to submit review
  async function submitReview(cookie: string, contractId: string, rating: number, feedback: string) {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ contractId, rating, feedback }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Review submission failed: ${res.status} ${JSON.stringify(data)}`);
    }
    return data;
  }

  // 1. Client Submits Review
  console.log('\n[Step 1] Logging in as Client: nafiz2282@gmail.com...');
  const clientCookies = await loginAndGetCookies('nafiz2282@gmail.com', 'Password@123');
  console.log('[Step 1] Submitting Client -> Freelancer review (Rating: 5)...');
  const clientReviewResult = await submitReview(
    clientCookies,
    CONTRACT_ID,
    5,
    'Exceptional full-stack engineer! Nafiz built our real-time collaborative canvas platform ahead of schedule with remarkable attention to performance and clean code. Sub-30ms WebSocket sync is incredible. Will hire again!'
  );
  console.log('[Step 1] Result from server:', clientReviewResult);

  // Check state after Step 1
  const afterStep1 = await prisma.review.findMany({ where: { contractId: CONTRACT_ID } });
  console.log('[Step 1 Status in DB]:', afterStep1.map(r => ({ id: r.id, status: r.status, rating: r.rating })));

  // 2. Freelancer Submits Review
  console.log('\n[Step 2] Logging in as Freelancer: nafizuddowla01@gmail.com...');
  const freelancerCookies = await loginAndGetCookies('nafizuddowla01@gmail.com', 'Password@123');
  console.log('[Step 2] Submitting Freelancer -> Client review (Rating: 5)...');
  const freelancerReviewResult = await submitReview(
    freelancerCookies,
    CONTRACT_ID,
    5,
    'Outstanding client! Clear project roadmap, quick responses during sprints, and immediate escrow funding & release. Highly recommended to any top freelancer!'
  );
  console.log('[Step 2] Result from server:', freelancerReviewResult);

  // Check state after Step 2
  const afterStep2 = await prisma.review.findMany({ where: { contractId: CONTRACT_ID } });
  console.log('[Step 2 Status in DB (Both should be PUBLISHED)]:', afterStep2.map(r => ({ id: r.id, status: r.status, rating: r.rating })));

  // Check recalculation on profiles
  const clientProfile = await prisma.clientProfile.findFirst({
    where: { user: { email: 'nafiz2282@gmail.com' } },
  });
  const freelancerProfile = await prisma.freelancerProfile.findFirst({
    where: { user: { email: 'nafizuddowla01@gmail.com' } },
  });

  console.log('\n[Profile Stats Updated]');
  console.log('Client Profile:', { company: clientProfile?.companyName, rating: clientProfile?.rating, totalReviews: clientProfile?.totalReviews });
  console.log('Freelancer Profile:', { title: freelancerProfile?.title, rating: freelancerProfile?.rating, successRate: freelancerProfile?.successRate, totalReviews: freelancerProfile?.totalReviews });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

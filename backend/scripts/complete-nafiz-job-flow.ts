import 'dotenv/config';
import { PrismaClient, Role, JobStatus, ProposalStatus, ContractStatus, ReviewStatus, MessageType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('[Setup] Starting end-to-end job completion & conversation setup...');

  const clientEmail = 'nafiz2282@gmail.com';
  const freelancerEmail = 'nafizuddowla01@gmail.com';
  const standardPassword = 'Password@123';
  const passwordHash = await bcrypt.hash(standardPassword, 10);

  // 1. Get or update Client User
  console.log(`[Setup] Updating client account: ${clientEmail}`);
  let clientUser = await prisma.user.findUnique({
    where: { email: clientEmail },
    include: { clientProfile: true },
  });

  if (!clientUser) {
    clientUser = await prisma.user.create({
      data: {
        email: clientEmail,
        passwordHash,
        role: Role.CLIENT,
        isEmailVerified: true,
        isBanned: false,
        walletBalance: 0,
      },
      include: { clientProfile: true },
    });
  } else {
    clientUser = await prisma.user.update({
      where: { id: clientUser.id },
      data: {
        passwordHash,
        role: Role.CLIENT,
        isEmailVerified: true,
        isBanned: false,
      },
      include: { clientProfile: true },
    });
  }

  // Ensure client profile exists and has company details
  if (!clientUser.clientProfile) {
    await prisma.clientProfile.create({
      data: {
        userId: clientUser.id,
        companyName: 'Nafiz Digital Ventures Ltd.',
        slug: 'nafiz-digital-ventures',
        billingDetails: 'Level 9, Banani Commercial Area, Dhaka 1213, Bangladesh',
        totalJobPosts: 1,
        totalSpent: 50000.0,
        rating: 5.0,
        totalReviews: 1,
      },
    });
  } else {
    await prisma.clientProfile.update({
      where: { id: clientUser.clientProfile.id },
      data: {
        companyName: 'Nafiz Digital Ventures Ltd.',
        slug: clientUser.clientProfile.slug || 'nafiz-digital-ventures',
        billingDetails: clientUser.clientProfile.billingDetails || 'Level 9, Banani Commercial Area, Dhaka 1213, Bangladesh',
        totalJobPosts: { increment: 1 },
        totalSpent: { increment: 50000.0 },
        rating: 5.0,
        totalReviews: { increment: 1 },
      },
    });
  }

  // 2. Get or update Freelancer User
  console.log(`[Setup] Updating freelancer account: ${freelancerEmail}`);
  let freelancerUser = await prisma.user.findUnique({
    where: { email: freelancerEmail },
    include: { freelancerProfile: true },
  });

  const freelancerEarnings = 45000.0; // ৳50,000 - 10% fee (৳5,000) = ৳45,000 net

  if (!freelancerUser) {
    freelancerUser = await prisma.user.create({
      data: {
        email: freelancerEmail,
        passwordHash,
        role: Role.FREELANCER,
        isEmailVerified: true,
        isBanned: false,
        walletBalance: freelancerEarnings,
      },
      include: { freelancerProfile: true },
    });
  } else {
    freelancerUser = await prisma.user.update({
      where: { id: freelancerUser.id },
      data: {
        passwordHash,
        role: Role.FREELANCER,
        isEmailVerified: true,
        isBanned: false,
        walletBalance: { increment: freelancerEarnings },
      },
      include: { freelancerProfile: true },
    });
  }

  // Ensure freelancer profile exists with professional details
  const freelancerSkills = ['Next.js', 'React', 'TypeScript', 'NestJS', 'PostgreSQL', 'WebSockets', 'Tailwind CSS', 'Redis'];
  if (!freelancerUser.freelancerProfile) {
    await prisma.freelancerProfile.create({
      data: {
        userId: freelancerUser.id,
        title: 'Senior Full-Stack Engineer & Next.js Architect',
        description: 'Specialized in high-concurrency web systems, Next.js 14 App Router, WebSocket synchronization gateways, NestJS microservices, and PostgreSQL performance optimization. 6+ years shipping production web products.',
        hourlyRate: 2800.0,
        skills: freelancerSkills,
        country: 'Bangladesh',
        city: 'Dhaka',
        address: 'Gulshan-2, Dhaka',
        slug: 'nafiz-uddowla-fullstack',
        totalProjects: 1,
        earnings: freelancerEarnings,
        rating: 5.0,
        totalReviews: 1,
        successRate: 100.0,
      },
    });
  } else {
    await prisma.freelancerProfile.update({
      where: { id: freelancerUser.freelancerProfile.id },
      data: {
        title: 'Senior Full-Stack Engineer & Next.js Architect',
        description: 'Specialized in high-concurrency web systems, Next.js 14 App Router, WebSocket synchronization gateways, NestJS microservices, and PostgreSQL performance optimization. 6+ years shipping production web products.',
        hourlyRate: 2800.0,
        skills: freelancerSkills,
        country: 'Bangladesh',
        city: 'Dhaka',
        address: 'Gulshan-2, Dhaka',
        slug: freelancerUser.freelancerProfile.slug || 'nafiz-uddowla-fullstack',
        totalProjects: { increment: 1 },
        earnings: { increment: freelancerEarnings },
        rating: 5.0,
        totalReviews: { increment: 1 },
        successRate: 100.0,
      },
    });
  }

  // 3. Find Category & SubCategory
  const fullstackCategory = await prisma.category.findFirst({
    where: { slug: 'software-web-development' },
    include: { subCategories: true },
  });
  const subCategory = fullstackCategory?.subCategories.find(s => s.slug === 'full-stack-development') || fullstackCategory?.subCategories[0];

  // 4. Create Job
  const jobTitle = 'Enterprise Real-Time Canvas & Collaborative Whiteboard Platform';
  const jobSlug = `realtime-canvas-whiteboard-platform-${Date.now().toString(36)}`;
  console.log(`[Setup] Creating Job: "${jobTitle}"`);

  const job = await prisma.job.create({
    data: {
      clientId: clientUser.id,
      title: jobTitle,
      slug: jobSlug,
      description: 'We are seeking a senior full-stack engineer to architect and build our enterprise real-time collaborative whiteboard platform. The project requires Next.js 14 App Router, NestJS WebSocket gateway for multi-user synchronization, HTML5 Canvas / Fabric.js engine, room-based presence, undo/redo state management, and export to PDF/SVG. Budget: ৳50,000 BDT.',
      categoryId: fullstackCategory?.id || null,
      subCategoryId: subCategory?.id || null,
      categoryName: fullstackCategory?.name || 'Software & Web Development',
      subCategoryName: subCategory?.name || 'Full-Stack Development',
      budget: 50000.0,
      skills: ['Next.js', 'TypeScript', 'WebSockets', 'NestJS', 'PostgreSQL', 'Tailwind CSS'],
      status: JobStatus.COMPLETED,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  // 5. Create Proposal
  console.log(`[Setup] Creating Proposal for Job: ${job.id}`);
  const proposal = await prisma.proposal.create({
    data: {
      jobId: job.id,
      freelancerId: freelancerUser.id,
      bidAmount: 50000.0,
      coverLetter: `Hi Nafiz,\n\nI have reviewed your technical requirements for the Enterprise Real-Time Collaborative Whiteboard Platform and would love to architect this for you.\n\nOver the past 6 years, I have built several multiplayer web applications using Next.js 14, NestJS WebSockets, and HTML5 Canvas. I will implement binary delta streaming for multi-cursor broadcast to guarantee sub-30ms latency, an immutable undo/redo history buffer, and clean modular code with 100% TypeScript type safety.\n\nI can start immediately today and deliver within our agreed milestone schedule.\n\nBest regards,\nNafiz Uddowla`,
      status: ProposalStatus.ACCEPTED,
      isViewed: true,
      createdAt: new Date(Date.now() - 5.8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // 6. Create Contract
  console.log(`[Setup] Creating Contract (Status: COMPLETED)...`);
  const contract = await prisma.contract.create({
    data: {
      proposalId: proposal.id,
      jobId: job.id,
      clientId: clientUser.id,
      freelancerId: freelancerUser.id,
      escrowAmount: 50000.0,
      platformFee: 5000.0,
      sslcommerzId: `SSLCZ_TXN_NAFIZ_CANVAS_${Date.now()}`,
      status: ContractStatus.COMPLETED,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // 7. Create Workroom Conversation & Sequential Messages
  console.log(`[Setup] Creating Workroom Conversation & Messages...`);
  const conversation = await prisma.conversation.create({
    data: {
      jobId: job.id,
      proposalId: proposal.id,
      clientId: clientUser.id,
      freelancerId: freelancerUser.id,
      lastMessageText: 'Payment received and milestone cleared! Thank you so much for the clear requirements, prompt feedback, and generous review. Looking forward to partnering on future platform expansions!',
      lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    },
  });

  const messageTemplates = [
    {
      senderId: clientUser.id,
      text: 'Hi Nafiz! Impressive proposal and background with canvas multiplayer engines. We would love to partner with you on this. Can you kick off Sprint 1 today?',
      delayHours: 0,
    },
    {
      senderId: freelancerUser.id,
      text: "Hello! Thank you for choosing my proposal. Absolutely, I'm ready to begin immediately. I will set up the repository with Next.js 14 App Router, configure the NestJS WebSocket gateway, and scaffold the infinite canvas layer.",
      delayHours: 0.5,
    },
    {
      senderId: clientUser.id,
      text: 'Perfect! I have funded the ৳50,000 escrow deposit via SSLCommerz. Let\'s aim to have multi-cursor synchronization and core drawing tools ready for preview by Thursday.',
      delayHours: 1.0,
    },
    {
      senderId: freelancerUser.id,
      text: 'Escrow deposit confirmed and secured! Working on the binary delta synchronization over WebSockets so multi-cursor latency stays well below 30ms. Everything is progressing smoothly.',
      delayHours: 24,
    },
    {
      senderId: freelancerUser.id,
      text: 'Mid-sprint Update: The core canvas engine is live! Implemented freehand pen, vector shapes (rectangles, ellipses), sticky notes, undo/redo history, and live cursor presence. Staging link: https://canvas.nafiz-ventures.dev',
      delayHours: 48,
    },
    {
      senderId: clientUser.id,
      text: 'Just tested the staging deployment with 5 concurrent team members. Rendering is silky smooth at 60 FPS and zero collision lag. Superb engineering quality!',
      delayHours: 52,
    },
    {
      senderId: freelancerUser.id,
      text: 'Glad to hear that! I have completed all remaining deliverables: SVG/PDF high-res export, room authorization middleware, and automated E2E tests. All PRs have been merged into main. Ready for final handover and milestone approval.',
      delayHours: 72,
    },
    {
      senderId: clientUser.id,
      text: 'Everything has been thoroughly verified in production. I have approved the milestone and released 100% of the ৳50,000 escrow to your wallet! Also left you a 5-star review. It was fantastic working with you!',
      delayHours: 96,
    },
    {
      senderId: freelancerUser.id,
      text: 'Payment received and milestone cleared! Thank you so much for the clear requirements, prompt feedback, and generous review. Looking forward to partnering on future platform expansions!',
      delayHours: 96.5,
    },
  ];

  const baseTime = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).getTime();
  for (const m of messageTemplates) {
    const msgTime = new Date(baseTime + m.delayHours * 3600 * 1000);
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: m.senderId,
        content: m.text,
        messageType: MessageType.TEXT,
        isRead: true,
        readAt: new Date(msgTime.getTime() + 5 * 60 * 1000),
        createdAt: msgTime,
        updatedAt: msgTime,
      },
    });
  }

  // 8. Create Bidirectional Reviews
  console.log(`[Setup] Creating Published Reviews...`);
  await prisma.review.create({
    data: {
      contractId: contract.id,
      reviewerId: clientUser.id,
      revieweeId: freelancerUser.id,
      rating: 5,
      feedback: 'Exceptional full-stack engineer! Nafiz built our real-time collaborative canvas platform ahead of schedule with remarkable attention to performance and clean code. Sub-30ms WebSocket sync is incredible. Will hire again!',
      status: ReviewStatus.PUBLISHED,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.review.create({
    data: {
      contractId: contract.id,
      reviewerId: freelancerUser.id,
      revieweeId: clientUser.id,
      rating: 5,
      feedback: 'Outstanding client! Clear project roadmap, quick responses during sprints, and immediate escrow funding & release. Highly recommended to any top freelancer!',
      status: ReviewStatus.PUBLISHED,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    },
  });

  console.log('\n======================================================');
  console.log('✅ End-to-End Completed Job & Conversation Setup Succeeded!');
  console.log('======================================================');
  console.log(`Client Account:`);
  console.log(`  Email:    ${clientEmail}`);
  console.log(`  Password: ${standardPassword}`);
  console.log(`  Role:     CLIENT`);
  console.log(`  Company:  Nafiz Digital Ventures Ltd.`);
  console.log(`\nFreelancer Account:`);
  console.log(`  Email:    ${freelancerEmail}`);
  console.log(`  Password: ${standardPassword}`);
  console.log(`  Role:     FREELANCER`);
  console.log(`  Title:    Senior Full-Stack Engineer & Next.js Architect`);
  console.log(`  Wallet:   ৳${freelancerEarnings} BDT (Available)`);
  console.log(`\nJob & Contract:`);
  console.log(`  Job ID:       ${job.id}`);
  console.log(`  Job Title:    ${job.title}`);
  console.log(`  Contract ID:  ${contract.id}`);
  console.log(`  Status:       COMPLETED (Escrow ৳50,000 Released, 10% Platform Fee ৳5,000)`);
  console.log(`  Conversation: ${conversation.id} (${messageTemplates.length} Messages in Workroom)`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

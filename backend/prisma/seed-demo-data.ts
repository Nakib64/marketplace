import 'dotenv/config';
import {
  AdminRole,
  ContractStatus,
  JobStatus,
  MessageType,
  PrismaClient,
  ProposalStatus,
  ReviewStatus,
  Role,
  WithdrawalMethod,
  WithdrawalStatus,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/marketplace_db?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Helper to create dates in the past (within last 30 days for rich analytics curves)
function daysAgo(days: number, hoursOffset = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset);
  return d;
}

export async function seedDemoData() {
  console.log('[DemoSeed] Starting interconnected demo data seeding...');

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 1. Fetch Categories and Subcategories from DB
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
  });

  if (categories.length === 0) {
    throw new Error('Categories must be seeded first! Run initial seed first.');
  }

  const catMap = new Map<string, { id: string; name: string; subs: Array<{ id: string; name: string }> }>();
  for (const c of categories) {
    catMap.set(c.slug, {
      id: c.id,
      name: c.name,
      subs: c.subCategories.map((s) => ({ id: s.id, name: s.name })),
    });
  }

  // 2. Define 10 Real Corporate Clients
  const CLIENT_DEFINITIONS = [
    {
      email: 'tech@chaldal.com',
      companyName: 'Chaldal Tech Ventures',
      slug: 'chaldal-tech-ventures',
      billingDetails: 'Chaldal Limited, Jashimuddin Avenue, Uttara, Dhaka-1230. Tax ID: 7729103948',
      daysJoinedAgo: 29,
    },
    {
      email: 'digital@pathao.com',
      companyName: 'Pathao Logistics Digital',
      slug: 'pathao-logistics-digital',
      billingDetails: 'Pathao Ltd, Gulshan-2, Dhaka. Corporate VAT: 994820194',
      daysJoinedAgo: 27,
    },
    {
      email: 'cloud.labs@shohoz.com',
      companyName: 'Shohoz Cloud Labs',
      slug: 'shohoz-cloud-labs',
      billingDetails: 'Shohoz Transport & Tech Ltd, Mohakhali DOHS, Dhaka',
      daysJoinedAgo: 25,
    },
    {
      email: 'fintech.lab@grameenphone.com',
      companyName: 'Grameenphone FinTech Lab',
      slug: 'grameenphone-fintech-lab',
      billingDetails: 'GP House, Bashundhara R/A, Dhaka-1229. Enterprise Reg: 00192837',
      daysJoinedAgo: 28,
    },
    {
      email: 'enterprise@tigerit.com',
      companyName: 'TigerIT Systems',
      slug: 'tigerit-systems',
      billingDetails: 'TigerIT Bangladesh Ltd, Banani, Dhaka. Gov Reg ID: 44928172',
      daysJoinedAgo: 26,
    },
    {
      email: 'digital@sheba.xyz',
      companyName: 'Sheba.xyz Services',
      slug: 'shebaxyz-services',
      billingDetails: 'Sheba Technologies, Tejgaon I/A, Dhaka-1208',
      daysJoinedAgo: 23,
    },
    {
      email: 'enterprise@brainstation-23.com',
      companyName: 'Brain Station 23 Enterprise',
      slug: 'brainstation-23-enterprise',
      billingDetails: 'Brain Station 23, BDBL Bhaban, Karwan Bazar, Dhaka',
      daysJoinedAgo: 30,
    },
    {
      email: 'ops@daraz.com.bd',
      companyName: 'Daraz Operations BD',
      slug: 'daraz-operations-bd',
      billingDetails: 'Daraz Bangladesh, Asfia Tower, Gulshan Avenue, Dhaka',
      daysJoinedAgo: 24,
    },
    {
      email: 'streaming@bongobd.com',
      companyName: 'Bongo Streaming Media',
      slug: 'bongo-streaming-media',
      billingDetails: 'Bongo Solutions, Gulshan-1, Dhaka-1212',
      daysJoinedAgo: 21,
    },
    {
      email: 'platform@shikho.com',
      companyName: 'Shikho EdTech Solutions',
      slug: 'shikho-edtech-solutions',
      billingDetails: 'Shikho Technologies, Dhanmondi 27, Dhaka',
      daysJoinedAgo: 22,
    },
  ];

  console.log('[DemoSeed] Seeding 10 corporate client accounts...');
  const clientsMap = new Map<string, any>();

  for (const cDef of CLIENT_DEFINITIONS) {
    const user = await prisma.user.upsert({
      where: { email: cDef.email },
      update: {
        role: Role.CLIENT,
        isEmailVerified: true,
        createdAt: daysAgo(cDef.daysJoinedAgo),
      },
      create: {
        email: cDef.email,
        passwordHash: defaultPasswordHash,
        role: Role.CLIENT,
        isEmailVerified: true,
        createdAt: daysAgo(cDef.daysJoinedAgo),
      },
    });

    const profile = await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {
        companyName: cDef.companyName,
        slug: cDef.slug,
        billingDetails: cDef.billingDetails,
      },
      create: {
        userId: user.id,
        companyName: cDef.companyName,
        slug: cDef.slug,
        billingDetails: cDef.billingDetails,
      },
    });

    clientsMap.set(cDef.email, { user, profile });
  }

  // 3. Define 14 High-Caliber Freelancers
  const FREELANCER_DEFINITIONS = [
    {
      email: 'tanvir.hasan@marketplace.talent',
      name: 'Tanvir Hasan',
      slug: 'tanvir-hasan-fullstack',
      title: 'Principal Full-Stack Engineer & Next.js Architect',
      description: '8+ years building enterprise web applications, real-time distributed systems, and modern TypeScript architectures. Ex-lead at Grab & Delivery Hero.',
      hourlyRate: 3500,
      skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
      city: 'Dhaka',
      daysJoinedAgo: 30,
    },
    {
      email: 'nusrat.jahan@marketplace.talent',
      name: 'Nusrat Jahan',
      slug: 'nusrat-jahan-design',
      title: 'Senior UI/UX & Design Systems Lead',
      description: 'Award-winning product designer specialized in enterprise SaaS, Figma design token systems, and sleek responsive design workflows.',
      hourlyRate: 2800,
      skills: ['Figma', 'UI/UX Design', 'Design Systems Architecture', 'Mobile App UI Design', 'Interactive Figma Prototyping'],
      city: 'Dhaka',
      daysJoinedAgo: 29,
    },
    {
      email: 'arif.rahman@marketplace.talent',
      name: 'Arif Rahman',
      slug: 'arif-rahman-ai',
      title: 'AI & LLM Solutions Engineer | PyTorch & RAG',
      description: 'Master of Data Science. Specialized in fine-tuning LLMs, building production RAG pipelines with LangChain & Pinecone, and machine learning models.',
      hourlyRate: 4500,
      skills: ['OpenAI API & GPT-4o', 'LangChain', 'RAG (Retrieval-Augmented Generation)', 'PyTorch', 'Python', 'FastAPI'],
      city: 'Chittagong',
      daysJoinedAgo: 28,
    },
    {
      email: 'sabrina.akter@marketplace.talent',
      name: 'Sabrina Akter',
      slug: 'sabrina-akter-devops',
      title: 'Lead Cloud & DevOps Infrastructure Architect',
      description: 'AWS Certified Solutions Architect & CKA. Deep experience with Kubernetes clusters, Terraform IaC, Docker, and zero-downtime CI/CD pipelines.',
      hourlyRate: 3800,
      skills: ['AWS (Amazon Web Services)', 'Docker', 'Kubernetes (K8s)', 'Terraform', 'CI/CD Pipelines (GitHub Actions)', 'Linux / Bash Scripting'],
      city: 'Dhaka',
      daysJoinedAgo: 27,
    },
    {
      email: 'mehedi.hasan@marketplace.talent',
      name: 'Mehedi Hasan',
      slug: 'mehedi-hasan-mobile',
      title: 'Senior Cross-Platform Mobile App Developer',
      description: 'Built and published 25+ Flutter and React Native apps on App Store and Google Play with over 3M combined downloads.',
      hourlyRate: 2500,
      skills: ['Flutter', 'React Native', 'Dart', 'Swift (iOS)', 'Kotlin (Android)', 'REST APIs'],
      city: 'Sylhet',
      daysJoinedAgo: 26,
    },
    {
      email: 'fahim.shahriar@marketplace.talent',
      name: 'Fahim Shahriar',
      slug: 'fahim-shahriar-web3',
      title: 'Web3 Protocol & Smart Contract Security Auditor',
      description: 'Solidity & EVM specialist. Audited $40M+ TVL smart contracts across Ethereum, Arbitrum, and Solana with zero critical exploits.',
      hourlyRate: 5500,
      skills: ['Solidity', 'Smart Contracts', 'Foundry', 'Hardhat', 'Smart Contract Security Auditing', 'Web3.js'],
      city: 'Dhaka',
      daysJoinedAgo: 29,
    },
    {
      email: 'farzana.islam@marketplace.talent',
      name: 'Farzana Islam',
      slug: 'farzana-islam-techwriter',
      title: 'Lead Technical Writer & API Documentation Specialist',
      description: 'Transforming complex engineering systems into crystal-clear developer documentation, interactive OpenAPI/Swagger specs, and whitepapers.',
      hourlyRate: 1800,
      skills: ['Technical Writing', 'API Documentation (Swagger / OpenAPI)', 'Developer Tutorials & Guides', 'GitBook & Docusaurus Docs'],
      city: 'Rajshahi',
      daysJoinedAgo: 25,
    },
    {
      email: 'rakib.chowdhury@marketplace.talent',
      name: 'Rakib Chowdhury',
      slug: 'rakib-chowdhury-growth',
      title: 'Growth Marketing & Technical SEO Strategist',
      description: 'Scaling organic search rankings and high-ROAS paid acquisition for venture-backed B2B SaaS and high-volume e-commerce platforms.',
      hourlyRate: 2200,
      skills: ['Technical SEO', 'Google Analytics 4 (GA4)', 'Ahrefs & SEMrush', 'Google Ads (Search & Display)', 'Meta Ads (Facebook & Instagram)'],
      city: 'Dhaka',
      daysJoinedAgo: 28,
    },
    {
      email: 'shakil.ahmed@marketplace.talent',
      name: 'Shakil Ahmed',
      slug: 'shakil-ahmed-security',
      title: 'Senior Cybersecurity & Penetration Testing Specialist',
      description: 'OSCP & CEH certified ethical hacker. Vulnerability assessments, web application penetration testing, and ISO 27001 hardening.',
      hourlyRate: 4000,
      skills: ['Penetration Testing (PenTest)', 'Vulnerability Assessment', 'OWASP Top 10 Security', 'Burp Suite', 'Kali Linux', 'Linux Server Hardening'],
      city: 'Dhaka',
      daysJoinedAgo: 27,
    },
    {
      email: 'nawrin.sultana@marketplace.talent',
      name: 'Nawrin Sultana',
      slug: 'nawrin-sultana-data',
      title: 'Staff Data Engineer & ETL Pipeline Specialist',
      description: 'Architecting scalable big data lakes and real-time streaming pipelines with Apache Spark, Airflow, dbt, Snowflake, and BigQuery.',
      hourlyRate: 3200,
      skills: ['Apache Spark', 'Apache Airflow', 'dbt (Data Build Tool)', 'Snowflake', 'ETL Pipelines', 'SQL Data Analysis'],
      city: 'Dhaka',
      daysJoinedAgo: 26,
    },
    {
      email: 'sabbir.hossain@marketplace.talent',
      name: 'Sabbir Hossain',
      slug: 'sabbir-hossain-qa',
      title: 'Senior QA Automation & Test Lead',
      description: 'Designing rock-solid Playwright and Cypress end-to-end automation test suites with CI/CD integration and load testing via k6.',
      hourlyRate: 2000,
      skills: ['Playwright', 'Cypress', 'Jest', 'End-to-End (E2E) Testing', 'Postman / Newman', 'k6 Performance Testing'],
      city: 'Khulna',
      daysJoinedAgo: 24,
    },
    {
      email: 'anika.tabassum@marketplace.talent',
      name: 'Anika Tabassum',
      slug: 'anika-tabassum-brand',
      title: 'Brand Identity & Visual Identity Designer',
      description: 'Crafting memorable brand identities, custom typography systems, packaging, and digital vector illustrations for global startups.',
      hourlyRate: 1900,
      skills: ['Brand Identity & Guidelines', 'Logo Design', 'Typography & Color Theory', 'Adobe Illustrator', 'Vector Illustration'],
      city: 'Dhaka',
      daysJoinedAgo: 23,
    },
    {
      email: 'kazi.mahmud@marketplace.talent',
      name: 'Kazi Mahmud',
      slug: 'kazi-mahmud-frontend',
      title: 'Senior Frontend & Micro-Animation Specialist',
      description: 'Creating award-winning, fluid web experiences with Next.js, Tailwind CSS, Framer Motion, and Three.js 3D web elements.',
      hourlyRate: 2600,
      skills: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'TypeScript'],
      city: 'Dhaka',
      daysJoinedAgo: 25,
    },
    {
      email: 'monirul.islam@marketplace.talent',
      name: 'Monirul Islam',
      slug: 'monirul-islam-dba',
      title: 'Database Architect & PostgreSQL Performance Specialist',
      description: 'Optimizing high-throughput OLTP databases, indexing strategies, query latency reductions, sharding, and high-availability clusters.',
      hourlyRate: 3400,
      skills: ['PostgreSQL', 'Database Query Optimization', 'Redis', 'Database Sharding & Replication', 'REST APIs'],
      city: 'Dhaka',
      daysJoinedAgo: 28,
    },
  ];

  console.log('[DemoSeed] Seeding 14 top-rated freelancer accounts...');
  const freelancersMap = new Map<string, any>();

  for (const fDef of FREELANCER_DEFINITIONS) {
    const user = await prisma.user.upsert({
      where: { email: fDef.email },
      update: {
        role: Role.FREELANCER,
        isEmailVerified: true,
        createdAt: daysAgo(fDef.daysJoinedAgo),
      },
      create: {
        email: fDef.email,
        passwordHash: defaultPasswordHash,
        role: Role.FREELANCER,
        isEmailVerified: true,
        createdAt: daysAgo(fDef.daysJoinedAgo),
      },
    });

    const profile = await prisma.freelancerProfile.upsert({
      where: { userId: user.id },
      update: {
        title: fDef.title,
        slug: fDef.slug,
        description: fDef.description,
        hourlyRate: fDef.hourlyRate,
        skills: fDef.skills,
        country: 'Bangladesh',
        city: fDef.city,
      },
      create: {
        userId: user.id,
        title: fDef.title,
        slug: fDef.slug,
        description: fDef.description,
        hourlyRate: fDef.hourlyRate,
        skills: fDef.skills,
        country: 'Bangladesh',
        city: fDef.city,
      },
    });

    freelancersMap.set(fDef.email, { user, profile, name: fDef.name });
  }

  // 4. Define 26 Highly Realistic Interconnected Jobs
  const swCat = catMap.get('software-web-development')!;
  const aiCat = catMap.get('ai-data-engineering')!;
  const uiCat = catMap.get('ui-ux-product-design')!;
  const secCat = catMap.get('cybersecurity-systems')!;
  const wrCat = catMap.get('writing-translation')!;
  const mktCat = catMap.get('marketing-growth')!;

  const JOB_SPECS = [
    // Completed Contracts (11 jobs)
    {
      key: 'job-1',
      clientEmail: 'tech@chaldal.com',
      freelancerEmail: 'tanvir.hasan@marketplace.talent',
      title: 'Fullstack Next.js 15 & NestJS Order Fulfillment Dashboard',
      slug: 'fullstack-nextjs-order-fulfillment-dashboard',
      description: 'Architect and deliver a high-speed real-time warehouse fulfillment dashboard using Next.js Turbopack, Tailwind CSS, NestJS microservices, and PostgreSQL with WebSocket dispatch.',
      category: swCat,
      subCategoryName: 'Full-Stack Development',
      budget: 65000,
      skills: ['Next.js', 'React', 'TypeScript', 'NestJS', 'PostgreSQL'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 26,
      daysAgoContract: 24,
      daysAgoCompleted: 10,
      clientReview: 'Exceptional fullstack delivery! Tanvir built our fulfillment dashboard ahead of schedule with spotless code architecture and 100% test coverage.',
      freelancerReview: 'Outstanding client with clear technical requirements and prompt escrow release. Looking forward to our next collaboration.',
    },
    {
      key: 'job-2',
      clientEmail: 'digital@pathao.com',
      freelancerEmail: 'nusrat.jahan@marketplace.talent',
      title: 'Design System & Mobile UI Revamp for Rider Experience',
      slug: 'design-system-mobile-ui-revamp-rider-experience',
      description: 'Comprehensive Figma design system overhaul for our rider mobile application, including dark mode tokens, accessibility audits, and interactive micro-animations.',
      category: uiCat,
      subCategoryName: 'Web & Mobile UI/UX',
      budget: 52000,
      skills: ['Figma', 'UI/UX Design', 'Design Systems Architecture', 'Mobile App UI Design'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 24,
      daysAgoContract: 22,
      daysAgoCompleted: 8,
      clientReview: 'Nusrat is a world-class product designer. Our design tokens and component libraries are now completely unified. Highly recommended!',
      freelancerReview: 'Pleasure working with the Pathao design team. Highly structured feedback cycles and rapid milestone sign-off.',
    },
    {
      key: 'job-3',
      clientEmail: 'fintech.lab@grameenphone.com',
      freelancerEmail: 'arif.rahman@marketplace.talent',
      title: 'Enterprise RAG Knowledge Copilot with LangChain & OpenAI',
      slug: 'enterprise-rag-knowledge-copilot-langchain-openai',
      description: 'Build and deploy an internal enterprise knowledge retrieval-augmented generation engine indexing 50,000+ corporate policy docs with hybrid vector search.',
      category: aiCat,
      subCategoryName: 'LLMs & Prompt Engineering',
      budget: 110000,
      skills: ['OpenAI API & GPT-4o', 'LangChain', 'RAG (Retrieval-Augmented Generation)', 'Python', 'FastAPI'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 25,
      daysAgoContract: 23,
      daysAgoCompleted: 7,
      clientReview: 'Arif demonstrated extraordinary expertise in generative AI and vector search. The copilot precision and latency are remarkable.',
      freelancerReview: 'Prestigious enterprise engagement with clear guidelines. The GP engineering team provided excellent support throughout.',
    },
    {
      key: 'job-4',
      clientEmail: 'enterprise@tigerit.com',
      freelancerEmail: 'sabrina.akter@marketplace.talent',
      title: 'Multi-Region AWS Kubernetes Cluster & Zero-Trust Migration',
      slug: 'multi-region-aws-kubernetes-zero-trust-migration',
      description: 'Migrate legacy infrastructure to an automated multi-region EKS cluster with Terraform, Istio service mesh, ArgoCD GitOps, and Prometheus/Grafana monitoring.',
      category: swCat,
      subCategoryName: 'DevOps & Cloud Engineering',
      budget: 85000,
      skills: ['AWS (Amazon Web Services)', 'Kubernetes (K8s)', 'Terraform', 'Docker', 'Linux / Bash Scripting'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 23,
      daysAgoContract: 20,
      daysAgoCompleted: 6,
      clientReview: 'Sabrina executed our cloud migration flawlessly without a single second of unplanned downtime. Top-tier DevOps engineer.',
      freelancerReview: 'Great communication and robust infrastructure team. Truly professional environment.',
    },
    {
      key: 'job-5',
      clientEmail: 'cloud.labs@shohoz.com',
      freelancerEmail: 'mehedi.hasan@marketplace.talent',
      title: 'Flutter Cross-Platform Ticketing & Seat Booking App',
      slug: 'flutter-cross-platform-ticketing-seat-booking-app',
      description: 'Develop the next-generation cross-platform mobile ticket reservation application in Flutter with real-time seat matrix locking and payment gateways.',
      category: swCat,
      subCategoryName: 'Mobile App Development',
      budget: 58000,
      skills: ['Flutter', 'Dart', 'REST APIs', 'React Native'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 22,
      daysAgoContract: 19,
      daysAgoCompleted: 5,
      clientReview: 'Smooth, 60fps Flutter UI with rock-solid offline caching. Mehedi is a reliable and creative mobile engineer.',
      freelancerReview: 'Very supportive engineering management. Prompt acceptance and clear technical specs.',
    },
    {
      key: 'job-6',
      clientEmail: 'enterprise@brainstation-23.com',
      freelancerEmail: 'fahim.shahriar@marketplace.talent',
      title: 'Smart Contract DeFi Escrow & Staking Security Audit',
      slug: 'smart-contract-defi-escrow-staking-security-audit',
      description: 'Comprehensive security verification, formal verification, Slither automated analysis, and reentrancy audit of Ethereum smart contract suite.',
      category: secCat,
      subCategoryName: 'Smart Contract Auditing',
      budget: 120000,
      skills: ['Solidity', 'Smart Contracts', 'Foundry', 'Smart Contract Security Auditing'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 21,
      daysAgoContract: 18,
      daysAgoCompleted: 4,
      clientReview: 'Fahim uncovered two subtle edge-case vulnerabilities before mainnet launch. Invaluable security audit service.',
      freelancerReview: 'Highest standards of smart contract engineering. Outstanding enterprise client.',
    },
    {
      key: 'job-7',
      clientEmail: 'ops@daraz.com.bd',
      freelancerEmail: 'monirul.islam@marketplace.talent',
      title: 'PostgreSQL Query Optimization & High-Throughput Index Tuning',
      slug: 'postgresql-query-optimization-high-throughput-index-tuning',
      description: 'Analyze slow query logs, optimize complex join latencies, implement partial indexing and partitioning for 120GB transactional database.',
      category: swCat,
      subCategoryName: 'Database & Systems Architecture',
      budget: 45000,
      skills: ['PostgreSQL', 'Database Query Optimization', 'Redis'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 20,
      daysAgoContract: 17,
      daysAgoCompleted: 3,
      clientReview: 'Database latency dropped from 850ms to under 45ms across all major analytical queries. Superb DBA work.',
      freelancerReview: 'Excellent database access and direct communication with lead architects.',
    },
    {
      key: 'job-8',
      clientEmail: 'digital@sheba.xyz',
      freelancerEmail: 'sabbir.hossain@marketplace.talent',
      title: 'Playwright & Jest Automated E2E Regression Testing Suite',
      slug: 'playwright-jest-automated-e2e-regression-testing-suite',
      description: 'Build automated end-to-end regression suites covering booking checkouts, payment rails, and customer authentication pipelines with CI triggers.',
      category: swCat,
      subCategoryName: 'QA & Test Automation',
      budget: 38000,
      skills: ['Playwright', 'Jest', 'Cypress', 'End-to-End (E2E) Testing'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 19,
      daysAgoContract: 16,
      daysAgoCompleted: 3,
      clientReview: 'Our deployment confidence skyrocketed with Sabbir’s automated test framework. Highly dependable engineer.',
      freelancerReview: 'Very pleasant engagement with transparent milestones and prompt escrow release.',
    },
    {
      key: 'job-9',
      clientEmail: 'streaming@bongobd.com',
      freelancerEmail: 'anika.tabassum@marketplace.talent',
      title: 'Original Series Digital Brand Identity & Visual Assets',
      slug: 'original-series-digital-brand-identity-visual-assets',
      description: 'Create a distinctive brand identity, typography hierarchy, logo variations, and high-resolution promotional artwork for flagship media release.',
      category: uiCat,
      subCategoryName: 'Brand & Visual Identity',
      budget: 32000,
      skills: ['Brand Identity & Guidelines', 'Logo Design', 'Adobe Illustrator', 'Typography & Color Theory'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 18,
      daysAgoContract: 15,
      daysAgoCompleted: 2,
      clientReview: 'Anika’s visual identity work is sublime and visually striking. Exactly captured our streaming brand tone.',
      freelancerReview: 'Great creative team at Bongo BD! Thoroughly enjoyed crafting this visual language.',
    },
    {
      key: 'job-10',
      clientEmail: 'platform@shikho.com',
      freelancerEmail: 'farzana.islam@marketplace.talent',
      title: 'Developer Portal API Documentation & Interactive Guides',
      slug: 'developer-portal-api-documentation-interactive-guides',
      description: 'Author developer guides, OpenAPI 3.0 specs, sample code repositories, and onboarding tutorials for our education API ecosystem.',
      category: wrCat,
      subCategoryName: 'Technical Writing & Documentation',
      budget: 28000,
      skills: ['Technical Writing', 'API Documentation (Swagger / OpenAPI)', 'Developer Tutorials & Guides'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 17,
      daysAgoContract: 14,
      daysAgoCompleted: 2,
      clientReview: 'Farzana translated complex edtech schemas into elegant, readable developer guides. Very satisfied.',
      freelancerReview: 'Great project scope and swift feedback from Shikho developers.',
    },
    {
      key: 'job-11',
      clientEmail: 'tech@chaldal.com',
      freelancerEmail: 'rakib.chowdhury@marketplace.talent',
      title: 'Technical SEO Audit & High-Volume Catalog Optimization',
      slug: 'technical-seo-audit-high-volume-catalog-optimization',
      description: 'Crawl optimization, Core Web Vitals remediation, structured data schemas, and internal link graph restructuring across 200,000 product pages.',
      category: mktCat,
      subCategoryName: 'Search Engine Optimization (SEO)',
      budget: 42000,
      skills: ['Technical SEO', 'Google Analytics 4 (GA4)', 'Ahrefs & SEMrush'],
      status: JobStatus.COMPLETED,
      contractStatus: ContractStatus.COMPLETED,
      daysAgoCreated: 16,
      daysAgoContract: 13,
      daysAgoCompleted: 1,
      clientReview: 'Impressive SEO audit. We saw a 34% increase in organic category indexation within 2 weeks of implementation.',
      freelancerReview: 'Fascinating data scale to work on. Chaldal tech team is top tier.',
    },

    // Active In-Progress Contracts (5 jobs)
    {
      key: 'job-12',
      clientEmail: 'enterprise@brainstation-23.com',
      freelancerEmail: 'kazi.mahmud@marketplace.talent',
      title: 'Interactive 3D Web Experience with Three.js & Framer Motion',
      slug: 'interactive-3d-web-experience-threejs-framer-motion',
      description: 'Building an interactive 3D product showcase with WebGL shaders, Three.js canvas, and smooth Framer Motion scroll-driven camera sequences.',
      category: swCat,
      subCategoryName: 'Frontend Development',
      budget: 48000,
      skills: ['Three.js', 'Framer Motion', 'React', 'Next.js', 'TypeScript'],
      status: JobStatus.IN_PROGRESS,
      contractStatus: ContractStatus.FUNDED,
      daysAgoCreated: 12,
      daysAgoContract: 10,
    },
    {
      key: 'job-13',
      clientEmail: 'fintech.lab@grameenphone.com',
      freelancerEmail: 'shakil.ahmed@marketplace.talent',
      title: 'Annual Web Application Penetration Test & Security Audit',
      slug: 'annual-web-application-penetration-test-security-audit',
      description: 'Deep black-box and grey-box security penetration test across core customer authentication, token lifecycle, and payment callback endpoints.',
      category: secCat,
      subCategoryName: 'Penetration Testing & Audits',
      budget: 75000,
      skills: ['Penetration Testing (PenTest)', 'OWASP Top 10 Security', 'Burp Suite', 'Kali Linux'],
      status: JobStatus.IN_PROGRESS,
      contractStatus: ContractStatus.FUNDED,
      daysAgoCreated: 11,
      daysAgoContract: 9,
    },
    {
      key: 'job-14',
      clientEmail: 'digital@pathao.com',
      freelancerEmail: 'nawrin.sultana@marketplace.talent',
      title: 'Real-Time Apache Kafka & Spark Streaming Ingestion Engine',
      slug: 'real-time-apache-kafka-spark-streaming-ingestion-engine',
      description: 'Designing real-time event streaming telemetry processing 10,000 GPS events per second using Kafka, Apache Spark, and Snowflake ingestion.',
      category: aiCat,
      subCategoryName: 'Data Engineering & ETL',
      budget: 68000,
      skills: ['Apache Spark', 'Apache Airflow', 'Snowflake', 'dbt (Data Build Tool)'],
      status: JobStatus.IN_PROGRESS,
      contractStatus: ContractStatus.FUNDED,
      daysAgoCreated: 10,
      daysAgoContract: 8,
    },
    {
      key: 'job-15',
      clientEmail: 'ops@daraz.com.bd',
      freelancerEmail: 'tanvir.hasan@marketplace.talent',
      title: 'High-Concurrency Inventory Synchronization Microservice',
      slug: 'high-concurrency-inventory-synchronization-microservice',
      description: 'Resilient NestJS microservice with Redis distributed locks, optimistic locking, and BullMQ queues to prevent flash-sale inventory overselling.',
      category: swCat,
      subCategoryName: 'Backend Development',
      budget: 55000,
      skills: ['NestJS', 'Node.js', 'Redis', 'PostgreSQL', 'TypeScript'],
      status: JobStatus.IN_PROGRESS,
      contractStatus: ContractStatus.FUNDED,
      daysAgoCreated: 9,
      daysAgoContract: 7,
    },
    {
      key: 'job-16',
      clientEmail: 'enterprise@tigerit.com',
      freelancerEmail: 'nusrat.jahan@marketplace.talent',
      title: 'Enterprise Identity Management Portal UX Research & UI Kit',
      slug: 'enterprise-identity-management-portal-ux-research-ui-kit',
      description: 'User research, wireframing, and Figma design tokens for government-scale citizen biometric identity admin portals.',
      category: uiCat,
      subCategoryName: 'Web & Mobile UI/UX',
      budget: 42000,
      skills: ['Figma', 'UI/UX Design', 'Design Systems Architecture'],
      status: JobStatus.IN_PROGRESS,
      contractStatus: ContractStatus.FUNDED,
      daysAgoCreated: 8,
      daysAgoContract: 6,
    },

    // Disputed Contract (1 job)
    {
      key: 'job-17',
      clientEmail: 'cloud.labs@shohoz.com',
      freelancerEmail: 'mehedi.hasan@marketplace.talent',
      title: 'Rapid Prototype for Bus Fleet Tracking Dashboard',
      slug: 'rapid-prototype-bus-fleet-tracking-dashboard',
      description: 'Prototype dashboard for real-time fleet GPS tracking with simulated map views. Dispute filed over milestone delivery delay.',
      category: swCat,
      subCategoryName: 'Frontend Development',
      budget: 25000,
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      status: JobStatus.IN_PROGRESS,
      contractStatus: ContractStatus.DISPUTED,
      daysAgoCreated: 14,
      daysAgoContract: 12,
    },

    // Refunded Contract (1 job)
    {
      key: 'job-18',
      clientEmail: 'digital@sheba.xyz',
      freelancerEmail: 'rakib.chowdhury@marketplace.talent',
      title: 'Paid Search Conversion Campaign Setup',
      slug: 'paid-search-conversion-campaign-setup',
      description: 'Google Search Ads setup. Mutually cancelled and refunded due to changed seasonal marketing calendar.',
      category: mktCat,
      subCategoryName: 'Paid Advertising (PPC / Google / Meta)',
      budget: 15000,
      skills: ['Google Ads (Search & Display)', 'Meta Ads (Facebook & Instagram)'],
      status: JobStatus.CANCELED,
      contractStatus: ContractStatus.REFUNDED,
      daysAgoCreated: 15,
      daysAgoContract: 13,
      daysAgoRefund: 5,
    },

    // Open Jobs with Active Pending Proposals (6 jobs)
    {
      key: 'job-19',
      clientEmail: 'tech@chaldal.com',
      title: 'Migrate Legacy REST Endpoints to Federated GraphQL Gateway',
      slug: 'migrate-legacy-rest-endpoints-federated-graphql-gateway',
      description: 'We are seeking a senior backend engineer to unify our microservices under an Apollo Federation GraphQL gateway with distributed caching.',
      category: swCat,
      subCategoryName: 'Backend Development',
      budget: 70000,
      skills: ['GraphQL', 'Node.js', 'NestJS', 'TypeScript', 'Redis'],
      status: JobStatus.OPEN,
      daysAgoCreated: 4,
    },
    {
      key: 'job-20',
      clientEmail: 'platform@shikho.com',
      title: 'Interactive Math & Physics Canvas Engine for Web & Tablets',
      slug: 'interactive-math-physics-canvas-engine-web-tablets',
      description: 'Looking for a skilled frontend engineer to build interactive formula plotting, geometry drawing, and physics simulations using HTML5 Canvas / SVG.',
      category: swCat,
      subCategoryName: 'Frontend Development',
      budget: 45000,
      skills: ['React', 'TypeScript', 'HTML5 & CSS3', 'Framer Motion'],
      status: JobStatus.OPEN,
      daysAgoCreated: 3,
    },
    {
      key: 'job-21',
      clientEmail: 'streaming@bongobd.com',
      title: 'Video Encoding Pipeline & HLS Transcoding Automation',
      slug: 'video-encoding-pipeline-hls-transcoding-automation',
      description: 'Setup automated AWS MediaConvert and FFmpeg transcoding pipelines with DRM protection and multi-bitrate HLS streaming profiles.',
      category: swCat,
      subCategoryName: 'DevOps & Cloud Engineering',
      budget: 60000,
      skills: ['AWS (Amazon Web Services)', 'Docker', 'Linux / Bash Scripting'],
      status: JobStatus.OPEN,
      daysAgoCreated: 3,
    },
    {
      key: 'job-22',
      clientEmail: 'digital@pathao.com',
      title: 'Automated Fraud Detection Model for Ride Fare Discrepancies',
      slug: 'automated-fraud-detection-model-ride-fare-discrepancies',
      description: 'Develop anomaly detection algorithms in Python to identify suspicious ride routing, fake GPS jumps, and coupon misuse patterns.',
      category: aiCat,
      subCategoryName: 'Machine Learning & Deep Learning',
      budget: 80000,
      skills: ['Python', 'Scikit-Learn', 'PyTorch', 'Pandas & NumPy'],
      status: JobStatus.OPEN,
      daysAgoCreated: 2,
    },
    {
      key: 'job-23',
      clientEmail: 'fintech.lab@grameenphone.com',
      title: 'Biometric KYC Flow UX Optimization & Accessibility Audit',
      slug: 'biometric-kyc-flow-ux-optimization-accessibility-audit',
      description: 'Conduct comprehensive usability research on our digital KYC customer onboarding flow with special focus on elderly and rural user personas.',
      category: uiCat,
      subCategoryName: 'Prototypes & User Research',
      budget: 35000,
      skills: ['UI/UX Design', 'Usability Testing', 'User Persona & Journey Maps'],
      status: JobStatus.OPEN,
      daysAgoCreated: 1,
    },
    {
      key: 'job-24',
      clientEmail: 'enterprise@brainstation-23.com',
      title: 'Cloudflare Zero-Trust & DDoS Protection Architecture',
      slug: 'cloudflare-zero-trust-ddos-protection-architecture',
      description: 'Configure Cloudflare Access, WAF rate limiting rules, SSL/TLS modern ciphers, and bot management for fintech client applications.',
      category: secCat,
      subCategoryName: 'Cloud & Network Security',
      budget: 50000,
      skills: ['Cloudflare & CDN', 'Firewalls & WAF Configuration', 'Cloud Infrastructure Security'],
      status: JobStatus.OPEN,
      daysAgoCreated: 1,
    },

    // Flagged Jobs for Admin Moderation Radar (2 jobs)
    {
      key: 'job-25',
      clientEmail: 'cloud.labs@shohoz.com',
      title: 'Need Urgent Project Help - WhatsApp Me at 01711999888 for Direct Cash Payment',
      slug: 'need-urgent-project-help-whatsapp-direct-cash-payment',
      description: 'Do not bid on platform. Contact my WhatsApp directly at 01711999888 to bypass escrow commission. We will pay cash directly.',
      category: swCat,
      subCategoryName: 'Frontend Development',
      budget: 20000,
      skills: ['React', 'JavaScript'],
      status: JobStatus.OPEN,
      isFlagged: true,
      flagReason: 'Attempt to solicit off-platform direct communication and bypass escrow milestone protections.',
      daysAgoCreated: 2,
    },
    {
      key: 'job-26',
      clientEmail: 'digital@sheba.xyz',
      title: 'Write My University Computer Science Final Year Thesis Paper',
      slug: 'write-my-university-computer-science-final-year-thesis',
      description: 'Need someone to write complete research paper and thesis for academic graduation with fake simulation results.',
      category: wrCat,
      subCategoryName: 'Technical Writing & Documentation',
      budget: 18000,
      skills: ['Technical Writing'],
      status: JobStatus.OPEN,
      isFlagged: true,
      flagReason: 'Academic dishonesty and fraudulent thesis ghostwriting policy violation.',
      daysAgoCreated: 1,
    },
  ];

  console.log('[DemoSeed] Seeding 26 interconnected jobs...');
  const jobsMap = new Map<string, any>();

  for (const jSpec of JOB_SPECS) {
    const clientData = clientsMap.get(jSpec.clientEmail);
    if (!clientData) continue;

    const sub = jSpec.category.subs.find((s) => s.name === jSpec.subCategoryName);

    const job = await prisma.job.upsert({
      where: { slug: jSpec.slug },
      update: {
        title: jSpec.title,
        description: jSpec.description,
        categoryId: jSpec.category.id,
        categoryName: jSpec.category.name,
        subCategoryId: sub ? sub.id : null,
        subCategoryName: sub ? sub.name : null,
        budget: jSpec.budget,
        skills: jSpec.skills,
        status: jSpec.status,
        isFlagged: !!jSpec.isFlagged,
        flagReason: jSpec.flagReason || null,
        createdAt: daysAgo(jSpec.daysAgoCreated),
      },
      create: {
        clientId: clientData.user.id,
        slug: jSpec.slug,
        title: jSpec.title,
        description: jSpec.description,
        categoryId: jSpec.category.id,
        categoryName: jSpec.category.name,
        subCategoryId: sub ? sub.id : null,
        subCategoryName: sub ? sub.name : null,
        budget: jSpec.budget,
        skills: jSpec.skills,
        status: jSpec.status,
        isFlagged: !!jSpec.isFlagged,
        flagReason: jSpec.flagReason || null,
        createdAt: daysAgo(jSpec.daysAgoCreated),
      },
    });

    jobsMap.set(jSpec.key, { job, spec: jSpec });
  }

  // 5. Seed Proposals & Contracts & Reviews (Interconnected)
  console.log('[DemoSeed] Seeding interconnected proposals, contracts, escrow ledgers, and reviews...');

  const contractMap = new Map<string, any>();

  for (const [key, { job, spec }] of jobsMap.entries()) {
    // If job has an assigned freelancer (Jobs 1 through 18)
    if (spec.freelancerEmail) {
      const flData = freelancersMap.get(spec.freelancerEmail);
      if (flData) {
        const acceptedProposal = await prisma.proposal.upsert({
          where: {
            jobId_freelancerId: {
              jobId: job.id,
              freelancerId: flData.user.id,
            },
          },
          update: {
            bidAmount: spec.budget,
            coverLetter: `Hello! I have deep technical experience in ${spec.skills.slice(0, 3).join(', ')} and have delivered similar architectures for enterprise clients across Bangladesh and globally. I would love to build this with high velocity and clean testing.`,
            status: ProposalStatus.ACCEPTED,
            isViewed: true,
            createdAt: daysAgo(spec.daysAgoContract || spec.daysAgoCreated, 4),
          },
          create: {
            jobId: job.id,
            freelancerId: flData.user.id,
            bidAmount: spec.budget,
            coverLetter: `Hello! I have deep technical experience in ${spec.skills.slice(0, 3).join(', ')} and have delivered similar architectures for enterprise clients across Bangladesh and globally. I would love to build this with high velocity and clean testing.`,
            status: ProposalStatus.ACCEPTED,
            isViewed: true,
            createdAt: daysAgo(spec.daysAgoContract || spec.daysAgoCreated, 4),
          },
        });

        // Create or update contract
        const platformFee = Math.round(Number(spec.budget) * 0.1); // exactly 10%
        const contract = await prisma.contract.upsert({
          where: { proposalId: acceptedProposal.id },
          update: {
            jobId: job.id,
            clientId: job.clientId,
            freelancerId: flData.user.id,
            escrowAmount: spec.budget,
            platformFee,
            status: spec.contractStatus,
            sslcommerzId: `SSL-${job.id.substring(0, 8).toUpperCase()}`,
            createdAt: daysAgo(spec.daysAgoContract || spec.daysAgoCreated),
          },
          create: {
            proposalId: acceptedProposal.id,
            jobId: job.id,
            clientId: job.clientId,
            freelancerId: flData.user.id,
            escrowAmount: spec.budget,
            platformFee,
            status: spec.contractStatus,
            sslcommerzId: `SSL-${job.id.substring(0, 8).toUpperCase()}`,
            createdAt: daysAgo(spec.daysAgoContract || spec.daysAgoCreated),
          },
        });

        contractMap.set(key, contract);

        // If completed contract, seed reviews
        if (spec.contractStatus === ContractStatus.COMPLETED && spec.clientReview) {
          await prisma.review.upsert({
            where: {
              contractId_reviewerId: {
                contractId: contract.id,
                reviewerId: job.clientId,
              },
            },
            update: {
              revieweeId: flData.user.id,
              rating: 5,
              feedback: spec.clientReview,
              status: ReviewStatus.PUBLISHED,
              createdAt: daysAgo(spec.daysAgoCompleted || 2),
            },
            create: {
              contractId: contract.id,
              reviewerId: job.clientId,
              revieweeId: flData.user.id,
              rating: 5,
              feedback: spec.clientReview,
              status: ReviewStatus.PUBLISHED,
              createdAt: daysAgo(spec.daysAgoCompleted || 2),
            },
          });

          if (spec.freelancerReview) {
            await prisma.review.upsert({
              where: {
                contractId_reviewerId: {
                  contractId: contract.id,
                  reviewerId: flData.user.id,
                },
              },
              update: {
                revieweeId: job.clientId,
                rating: 5,
                feedback: spec.freelancerReview,
                status: ReviewStatus.PUBLISHED,
                createdAt: daysAgo(spec.daysAgoCompleted || 2),
              },
              create: {
                contractId: contract.id,
                reviewerId: flData.user.id,
                revieweeId: job.clientId,
                rating: 5,
                feedback: spec.freelancerReview,
                status: ReviewStatus.PUBLISHED,
                createdAt: daysAgo(spec.daysAgoCompleted || 2),
              },
            });
          }
        }

        // If refunded contract, seed refund
        if (spec.contractStatus === ContractStatus.REFUNDED) {
          await prisma.refund.upsert({
            where: { contractId: contract.id },
            update: {
              clientId: job.clientId,
              amount: spec.budget,
              reason: 'Mutually cancelled due to changed marketing schedule.',
              createdAt: daysAgo(spec.daysAgoRefund || 5),
            },
            create: {
              contractId: contract.id,
              clientId: job.clientId,
              amount: spec.budget,
              reason: 'Mutually cancelled due to changed marketing schedule.',
              createdAt: daysAgo(spec.daysAgoRefund || 5),
            },
          });
        }
      }
    }

    // Also add 2-3 other competitive proposals to every job (pending or rejected)
    const otherFreelancers = Array.from(freelancersMap.values())
      .filter((f) => f.user.email !== spec.freelancerEmail)
      .slice(0, 3);

    for (let idx = 0; idx < otherFreelancers.length; idx++) {
      const fl = otherFreelancers[idx];
      const variance = idx === 0 ? 0.95 : idx === 1 ? 1.05 : 1.15;
      const bid = Math.round(Number(spec.budget) * variance);

      // Make 1 proposal flagged for demonstration
      const isFlaggedBid = spec.key === 'job-20' && idx === 0;

      await prisma.proposal.upsert({
        where: {
          jobId_freelancerId: {
            jobId: job.id,
            freelancerId: fl.user.id,
          },
        },
        update: {
          bidAmount: bid,
          coverLetter: isFlaggedBid
            ? 'Call me on WhatsApp 01822334455 for quick transaction outside portal.'
            : `I reviewed your requirements for ${job.title} and have built comparable systems with strong test discipline and high reliability.`,
          status: isFlaggedBid ? ProposalStatus.PENDING : spec.freelancerEmail ? ProposalStatus.REJECTED : ProposalStatus.PENDING,
          isViewed: true,
          isFlagged: isFlaggedBid,
          flagReason: isFlaggedBid ? 'Off-platform contact solicitation detected by regex heuristic.' : null,
          createdAt: daysAgo(spec.daysAgoCreated, idx * 3),
        },
        create: {
          jobId: job.id,
          freelancerId: fl.user.id,
          bidAmount: bid,
          coverLetter: isFlaggedBid
            ? 'Call me on WhatsApp 01822334455 for quick transaction outside portal.'
            : `I reviewed your requirements for ${job.title} and have built comparable systems with strong test discipline and high reliability.`,
          status: isFlaggedBid ? ProposalStatus.PENDING : spec.freelancerEmail ? ProposalStatus.REJECTED : ProposalStatus.PENDING,
          isViewed: true,
          isFlagged: isFlaggedBid,
          flagReason: isFlaggedBid ? 'Off-platform contact solicitation detected by regex heuristic.' : null,
          createdAt: daysAgo(spec.daysAgoCreated, idx * 3),
        },
      });
    }
  }

  // 6. Seed Realistic Withdrawals for Freelancers
  console.log('[DemoSeed] Seeding disbursement rail withdrawals (bKash & Nagad)...');

  const WITHDRAWAL_SPECS = [
    { email: 'tanvir.hasan@marketplace.talent', amount: 50000, method: WithdrawalMethod.BKASH, phone: '01711234567', status: WithdrawalStatus.APPROVED, daysAgo: 8 },
    { email: 'tanvir.hasan@marketplace.talent', amount: 15000, method: WithdrawalMethod.NAGAD, phone: '01822334455', status: WithdrawalStatus.PENDING, daysAgo: 1 },
    { email: 'nusrat.jahan@marketplace.talent', amount: 45000, method: WithdrawalMethod.BKASH, phone: '01719876543', status: WithdrawalStatus.APPROVED, daysAgo: 7 },
    { email: 'arif.rahman@marketplace.talent', amount: 95000, method: WithdrawalMethod.BKASH, phone: '01912345678', status: WithdrawalStatus.APPROVED, daysAgo: 6 },
    { email: 'sabrina.akter@marketplace.talent', amount: 70000, method: WithdrawalMethod.NAGAD, phone: '01612345678', status: WithdrawalStatus.APPROVED, daysAgo: 5 },
    { email: 'mehedi.hasan@marketplace.talent', amount: 48000, method: WithdrawalMethod.BKASH, phone: '01733445566', status: WithdrawalStatus.APPROVED, daysAgo: 4 },
    { email: 'mehedi.hasan@marketplace.talent', amount: 12000, method: WithdrawalMethod.NAGAD, phone: '01733445566', status: WithdrawalStatus.PENDING, daysAgo: 1 },
    { email: 'fahim.shahriar@marketplace.talent', amount: 105000, method: WithdrawalMethod.BKASH, phone: '01811223344', status: WithdrawalStatus.APPROVED, daysAgo: 3 },
    { email: 'monirul.islam@marketplace.talent', amount: 38000, method: WithdrawalMethod.NAGAD, phone: '01511223344', status: WithdrawalStatus.APPROVED, daysAgo: 2 },
    { email: 'sabbir.hossain@marketplace.talent', amount: 30000, method: WithdrawalMethod.BKASH, phone: '01999887766', status: WithdrawalStatus.APPROVED, daysAgo: 2 },
    { email: 'anika.tabassum@marketplace.talent', amount: 28000, method: WithdrawalMethod.BKASH, phone: '01777665544', status: WithdrawalStatus.APPROVED, daysAgo: 2 },
    { email: 'farzana.islam@marketplace.talent', amount: 24000, method: WithdrawalMethod.NAGAD, phone: '01888776655', status: WithdrawalStatus.APPROVED, daysAgo: 1 },
    { email: 'rakib.chowdhury@marketplace.talent', amount: 36000, method: WithdrawalMethod.BKASH, phone: '01666554433', status: WithdrawalStatus.APPROVED, daysAgo: 1 },
    { email: 'kazi.mahmud@marketplace.talent', amount: 20000, method: WithdrawalMethod.BKASH, phone: '01755443322', status: WithdrawalStatus.PENDING, daysAgo: 0 },
  ];

  for (const w of WITHDRAWAL_SPECS) {
    const fl = freelancersMap.get(w.email);
    if (!fl) continue;

    await prisma.withdrawal.create({
      data: {
        freelancerId: fl.user.id,
        amount: w.amount,
        method: w.method,
        accountNumber: w.phone,
        status: w.status,
        createdAt: daysAgo(w.daysAgo),
      },
    });
  }

  // 7. Seed Real Interconnected Chat Conversations & Messages
  console.log('[DemoSeed] Seeding conversations & real-time messaging telemetry...');

  for (let i = 1; i <= 6; i++) {
    const jKey = `job-${i}`;
    const jData = jobsMap.get(jKey);
    if (!jData || !jData.spec.freelancerEmail) continue;

    const flData = freelancersMap.get(jData.spec.freelancerEmail);
    if (!flData) continue;

    const convo = await prisma.conversation.upsert({
      where: {
        jobId_freelancerId: {
          jobId: jData.job.id,
          freelancerId: flData.user.id,
        },
      },
      update: {
        lastMessageText: 'Milestone deliverables submitted and approved on platform escrow.',
        lastMessageAt: daysAgo(jData.spec.daysAgoCompleted || 3),
      },
      create: {
        jobId: jData.job.id,
        clientId: jData.job.clientId,
        freelancerId: flData.user.id,
        lastMessageText: 'Milestone deliverables submitted and approved on platform escrow.',
        lastMessageAt: daysAgo(jData.spec.daysAgoCompleted || 3),
      },
    });

    // Create 3 realistic messages
    await prisma.message.createMany({
      data: [
        {
          conversationId: convo.id,
          senderId: jData.job.clientId,
          content: `Hi ${(flData.name || 'there').split(' ')[0]}, thanks for submitting the proposal. Can you walk us through the architecture timeline?`,
          createdAt: daysAgo(jData.spec.daysAgoContract || 10, 5),
          isRead: true,
        },
        {
          conversationId: convo.id,
          senderId: flData.user.id,
          content: 'Hello! Absolutely. I have structured the milestone deliverables into two sprints with full unit test coverage and automated deployment.',
          createdAt: daysAgo(jData.spec.daysAgoContract || 10, 3),
          isRead: true,
        },
        {
          conversationId: convo.id,
          senderId: jData.job.clientId,
          content: 'Excellent, funding the milestone contract now into Banglance escrow trust.',
          createdAt: daysAgo(jData.spec.daysAgoContract || 10, 1),
          isRead: true,
        },
      ],
      skipDuplicates: true,
    });
  }

  // 8. Reconcile Profiles & Ledgers Perfectly (Zero Mismatch!)
  console.log('[DemoSeed] Reconciling all profile metrics, earnings, and platform ledgers...');

  // A. Reconcile Freelancer Profiles
  for (const [email, { user }] of freelancersMap.entries()) {
    const completedContracts = await prisma.contract.findMany({
      where: {
        freelancerId: user.id,
        status: ContractStatus.COMPLETED,
      },
    });

    const totalProjects = completedContracts.length;
    let earnings = 0;
    for (const c of completedContracts) {
      earnings += Number(c.escrowAmount) - Number(c.platformFee);
    }

    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: user.id,
        status: ReviewStatus.PUBLISHED,
      },
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 5.0;

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        freelancerId: user.id,
        status: WithdrawalStatus.APPROVED,
      },
    });
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
    const walletBalance = Math.max(0, earnings - totalWithdrawn);

    await prisma.freelancerProfile.update({
      where: { userId: user.id },
      data: {
        totalProjects,
        earnings,
        rating: Number(avgRating.toFixed(1)),
        totalReviews,
        successRate: totalProjects > 0 ? 100 : 98,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { walletBalance },
    });
  }

  // B. Reconcile Client Profiles
  for (const [email, { user }] of clientsMap.entries()) {
    const jobsCount = await prisma.job.count({
      where: { clientId: user.id },
    });

    const contracts = await prisma.contract.findMany({
      where: {
        clientId: user.id,
        status: { in: [ContractStatus.FUNDED, ContractStatus.COMPLETED] },
      },
    });

    let totalSpent = 0;
    for (const c of contracts) {
      totalSpent += Number(c.escrowAmount);
    }

    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: user.id,
        status: ReviewStatus.PUBLISHED,
      },
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 5.0;

    await prisma.clientProfile.update({
      where: { userId: user.id },
      data: {
        totalJobPosts: jobsCount,
        totalSpent,
        rating: Number(avgRating.toFixed(1)),
        totalReviews,
      },
    });
  }

  console.log('[DemoSeed] SUCCESS! All demo data has been seeded and reconciled with 100% interconnected consistency.');
}

if (process.argv[1]?.endsWith('seed-demo-data.ts')) {
  seedDemoData()
    .catch((e) => {
      console.error('[DemoSeed] Failed with error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

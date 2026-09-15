import 'dotenv/config';
import { AdminRole, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/marketplace_db?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@marketplace.com').toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@12345678!';
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Super Administrator';

  console.log(`[Seed] Checking for initial Super Admin at ${adminEmail}...`);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
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
  } else {
    console.log(`[Seed] Super Admin [${adminEmail}] already exists. Skipping.`);
  }

  // --- Seed Categories & SubCategories ---
  console.log('[Seed] Seeding platform Categories and SubCategories...');

  const INITIAL_CATEGORIES = [
    {
      name: 'Software & Web Development',
      slug: 'software-web-development',
      description: 'Custom software engineering, web applications, backend APIs, and systems.',
      subCategories: [
        { name: 'Full-Stack Development', slug: 'full-stack-development', description: 'End-to-end web applications with modern frontend & backend frameworks.' },
        { name: 'Frontend Development', slug: 'frontend-development', description: 'React, Next.js, Vue, Angular, TypeScript, and modern responsive UI.' },
        { name: 'Backend Development', slug: 'backend-development', description: 'Node.js, NestJS, Python, Go, Java microservices and REST/GraphQL APIs.' },
        { name: 'Mobile App Development', slug: 'mobile-app-development', description: 'iOS, Android, React Native, and Flutter mobile applications.' },
        { name: 'Web3 & Blockchain', slug: 'web3-blockchain', description: 'Smart contracts, Solidity, DeFi protocols, and decentralized apps.' },
        { name: 'DevOps & Cloud Engineering', slug: 'devops-cloud-engineering', description: 'AWS, GCP, Azure, Docker, Kubernetes, CI/CD, and Terraform.' },
        { name: 'QA & Test Automation', slug: 'qa-test-automation', description: 'End-to-end testing, Playwright, Cypress, Jest, and performance testing.' },
        { name: 'Database & Systems Architecture', slug: 'database-systems-architecture', description: 'PostgreSQL, MongoDB, Redis, schema optimization, and caching.' },
      ],
    },
    {
      name: 'AI & Data Engineering',
      slug: 'ai-data-engineering',
      description: 'Artificial intelligence, machine learning, data science, and analytics.',
      subCategories: [
        { name: 'LLMs & Prompt Engineering', slug: 'llm-prompt-engineering', description: 'OpenAI, Anthropic, LangChain, RAG pipelines, and fine-tuning.' },
        { name: 'Machine Learning & Deep Learning', slug: 'machine-learning-deep-learning', description: 'PyTorch, TensorFlow, predictive modeling, and neural networks.' },
        { name: 'Data Engineering & ETL', slug: 'data-engineering-etl', description: 'Data pipelines, Apache Kafka, Spark, Snowflake, and dbt.' },
        { name: 'Computer Vision & NLP', slug: 'computer-vision-nlp', description: 'Image recognition, OCR, text processing, and sentiment analysis.' },
        { name: 'Data Analytics & BI Dashboards', slug: 'data-analytics-bi-dashboards', description: 'PowerBI, Tableau, Looker, SQL analytics, and data modeling.' },
      ],
    },
    {
      name: 'UI/UX & Product Design',
      slug: 'ui-ux-product-design',
      description: 'User experience, product interfaces, branding, and design systems.',
      subCategories: [
        { name: 'Web & Mobile UI/UX', slug: 'web-mobile-ui-ux', description: 'Modern interfaces, Figma design, user flows, and wireframing.' },
        { name: 'Design Systems & Figma Kits', slug: 'design-systems-figma-kits', description: 'Scalable UI libraries, token systems, and component architectures.' },
        { name: 'Brand & Visual Identity', slug: 'brand-visual-identity', description: 'Logo design, brand books, typography, and color schemes.' },
        { name: 'Prototypes & User Research', slug: 'prototypes-user-research', description: 'Interactive prototypes, usability testing, and persona research.' },
        { name: 'Graphic Design & Illustrations', slug: 'graphic-design-illustrations', description: 'Digital graphics, marketing assets, vectors, and iconography.' },
      ],
    },
    {
      name: 'Cybersecurity & Systems',
      slug: 'cybersecurity-systems',
      description: 'Information security, vulnerability assessment, audits, and compliance.',
      subCategories: [
        { name: 'Penetration Testing & Audits', slug: 'penetration-testing-audits', description: 'Web, mobile, network penetration testing, and vulnerability remediation.' },
        { name: 'Smart Contract Auditing', slug: 'smart-contract-auditing', description: 'Security verification, reentrancy audits, and gas optimization.' },
        { name: 'Cloud & Network Security', slug: 'cloud-network-security', description: 'IAM, zero trust architecture, firewall configuration, and compliance.' },
        { name: 'Incident Response & Hardening', slug: 'incident-response-hardening', description: 'Server hardening, SIEM monitoring, and security logging.' },
      ],
    },
    {
      name: 'Writing & Translation',
      slug: 'writing-translation',
      description: 'Technical writing, content creation, copywriting, and localization.',
      subCategories: [
        { name: 'Technical Writing & Documentation', slug: 'technical-writing-documentation', description: 'API docs, developer guides, whitepapers, and architecture specs.' },
        { name: 'Copywriting & Content Strategy', slug: 'copywriting-content-strategy', description: 'Landing page copy, marketing campaigns, and brand messaging.' },
        { name: 'SEO Content & Articles', slug: 'seo-content-articles', description: 'High-ranking blog articles, keyword optimization, and thought leadership.' },
        { name: 'Translation & Localization', slug: 'translation-localization', description: 'Multilingual translation, app localization, and cultural adaptation.' },
      ],
    },
    {
      name: 'Marketing & Growth',
      slug: 'marketing-growth',
      description: 'Digital marketing, SEO, paid media, growth engineering, and social.',
      subCategories: [
        { name: 'Search Engine Optimization (SEO)', slug: 'search-engine-optimization-seo', description: 'Technical SEO, backlink strategy, and keyword rank improvement.' },
        { name: 'Paid Advertising (PPC / Google / Meta)', slug: 'paid-advertising-ppc', description: 'Targeted ad campaigns, conversion rate optimization, and ROAS scaling.' },
        { name: 'Social Media & Community Management', slug: 'social-media-community-management', description: 'Community growth on Discord, X (Twitter), LinkedIn, and Telegram.' },
        { name: 'Email Marketing & CRM Automation', slug: 'email-marketing-crm-automation', description: 'Retention funnels, HubSpot, Klaviyo, and lifecycle sequences.' },
      ],
    },
  ];

  for (const catData of INITIAL_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        isActive: true,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        isActive: true,
      },
    });

    for (const sub of catData.subCategories) {
      await prisma.subCategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: sub.slug,
          },
        },
        update: {
          name: sub.name,
          description: sub.description,
          isActive: true,
        },
        create: {
          categoryId: category.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          isActive: true,
        },
      });
    }
  }

  console.log(`[Seed] Seeded ${INITIAL_CATEGORIES.length} categories with all subcategories.`);

  // --- Seed Bulk Targeted Skills ---
  const INITIAL_SKILLS: Array<{ name: string; slug: string; category: string }> = [
    // --- Software & Web Development ---
    // Full-Stack Development
    { name: 'React', slug: 'react', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Next.js', slug: 'nextjs', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'TypeScript', slug: 'typescript', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'JavaScript', slug: 'javascript', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Node.js', slug: 'nodejs', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'NestJS', slug: 'nestjs', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Express.js', slug: 'expressjs', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'MongoDB', slug: 'mongodb', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Prisma ORM', slug: 'prisma-orm', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'REST APIs', slug: 'rest-apis', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'GraphQL', slug: 'graphql', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Tailwind CSS', slug: 'tailwind-css', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Redux Toolkit', slug: 'redux-toolkit', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'Zustand', slug: 'zustand', category: 'Software & Web Development / Full-Stack Development' },
    { name: 'TanStack Query', slug: 'tanstack-query', category: 'Software & Web Development / Full-Stack Development' },

    // Frontend Development
    { name: 'Vue.js', slug: 'vuejs', category: 'Software & Web Development / Frontend Development' },
    { name: 'Nuxt.js', slug: 'nuxtjs', category: 'Software & Web Development / Frontend Development' },
    { name: 'Angular', slug: 'angular', category: 'Software & Web Development / Frontend Development' },
    { name: 'Svelte', slug: 'svelte', category: 'Software & Web Development / Frontend Development' },
    { name: 'HTML5 & CSS3', slug: 'html5-css3', category: 'Software & Web Development / Frontend Development' },
    { name: 'Sass / SCSS', slug: 'sass-scss', category: 'Software & Web Development / Frontend Development' },
    { name: 'Vite', slug: 'vite', category: 'Software & Web Development / Frontend Development' },
    { name: 'Webpack', slug: 'webpack', category: 'Software & Web Development / Frontend Development' },
    { name: 'Three.js', slug: 'threejs', category: 'Software & Web Development / Frontend Development' },
    { name: 'WebSockets', slug: 'websockets', category: 'Software & Web Development / Frontend Development' },
    { name: 'Framer Motion', slug: 'framer-motion', category: 'Software & Web Development / Frontend Development' },

    // Backend Development
    { name: 'Python', slug: 'python', category: 'Software & Web Development / Backend Development' },
    { name: 'Django', slug: 'django', category: 'Software & Web Development / Backend Development' },
    { name: 'FastAPI', slug: 'fastapi', category: 'Software & Web Development / Backend Development' },
    { name: 'Go (Golang)', slug: 'golang', category: 'Software & Web Development / Backend Development' },
    { name: 'Java', slug: 'java', category: 'Software & Web Development / Backend Development' },
    { name: 'Spring Boot', slug: 'spring-boot', category: 'Software & Web Development / Backend Development' },
    { name: 'C# / .NET', slug: 'csharp-dotnet', category: 'Software & Web Development / Backend Development' },
    { name: 'PHP / Laravel', slug: 'laravel', category: 'Software & Web Development / Backend Development' },
    { name: 'Ruby on Rails', slug: 'ruby-on-rails', category: 'Software & Web Development / Backend Development' },
    { name: 'gRPC', slug: 'grpc', category: 'Software & Web Development / Backend Development' },
    { name: 'Microservices Architecture', slug: 'microservices', category: 'Software & Web Development / Backend Development' },
    { name: 'Apache Kafka', slug: 'kafka', category: 'Software & Web Development / Backend Development' },
    { name: 'RabbitMQ', slug: 'rabbitmq', category: 'Software & Web Development / Backend Development' },
    { name: 'Redis', slug: 'redis', category: 'Software & Web Development / Backend Development' },

    // Mobile App Development
    { name: 'React Native', slug: 'react-native', category: 'Software & Web Development / Mobile App Development' },
    { name: 'Flutter', slug: 'flutter', category: 'Software & Web Development / Mobile App Development' },
    { name: 'Dart', slug: 'dart', category: 'Software & Web Development / Mobile App Development' },
    { name: 'Swift (iOS)', slug: 'swift-ios', category: 'Software & Web Development / Mobile App Development' },
    { name: 'Kotlin (Android)', slug: 'kotlin-android', category: 'Software & Web Development / Mobile App Development' },
    { name: 'Expo', slug: 'expo', category: 'Software & Web Development / Mobile App Development' },
    { name: 'iOS App Store Deployment', slug: 'ios-deployment', category: 'Software & Web Development / Mobile App Development' },
    { name: 'Google Play Deployment', slug: 'google-play-deployment', category: 'Software & Web Development / Mobile App Development' },

    // Web3 & Blockchain
    { name: 'Solidity', slug: 'solidity', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Ethereum', slug: 'ethereum', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Smart Contracts', slug: 'smart-contracts', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Ethers.js', slug: 'ethersjs', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Web3.js', slug: 'web3js', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Hardhat', slug: 'hardhat', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Foundry', slug: 'foundry', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Rust (Solana)', slug: 'rust-solana', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'Anchor Framework', slug: 'anchor-framework', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'DeFi Protocols', slug: 'defi-protocols', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'NFT Smart Contracts (ERC-721/1155)', slug: 'nft-smart-contracts', category: 'Software & Web Development / Web3 & Blockchain' },
    { name: 'IPFS', slug: 'ipfs', category: 'Software & Web Development / Web3 & Blockchain' },

    // DevOps & Cloud Engineering
    { name: 'AWS (Amazon Web Services)', slug: 'aws', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Docker', slug: 'docker', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Kubernetes (K8s)', slug: 'kubernetes', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Terraform', slug: 'terraform', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'CI/CD Pipelines (GitHub Actions)', slug: 'github-actions', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Google Cloud Platform (GCP)', slug: 'gcp', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Microsoft Azure', slug: 'azure', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Linux / Bash Scripting', slug: 'linux-bash', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Nginx', slug: 'nginx', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Prometheus & Grafana', slug: 'prometheus-grafana', category: 'Software & Web Development / DevOps & Cloud Engineering' },
    { name: 'Cloudflare & CDN', slug: 'cloudflare', category: 'Software & Web Development / DevOps & Cloud Engineering' },

    // QA & Test Automation
    { name: 'Playwright', slug: 'playwright', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'Cypress', slug: 'cypress', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'Jest', slug: 'jest', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'Vitest', slug: 'vitest', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'Selenium', slug: 'selenium', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'Postman / Newman', slug: 'postman', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'k6 Performance Testing', slug: 'k6-load-testing', category: 'Software & Web Development / QA & Test Automation' },
    { name: 'End-to-End (E2E) Testing', slug: 'e2e-testing', category: 'Software & Web Development / QA & Test Automation' },

    // Database & Systems Architecture
    { name: 'MySQL', slug: 'mysql', category: 'Software & Web Development / Database & Systems Architecture' },
    { name: 'Elasticsearch', slug: 'elasticsearch', category: 'Software & Web Development / Database & Systems Architecture' },
    { name: 'Database Query Optimization', slug: 'db-optimization', category: 'Software & Web Development / Database & Systems Architecture' },
    { name: 'DynamoDB', slug: 'dynamodb', category: 'Software & Web Development / Database & Systems Architecture' },
    { name: 'Database Sharding & Replication', slug: 'db-sharding-replication', category: 'Software & Web Development / Database & Systems Architecture' },

    // --- AI & Data Engineering ---
    // LLMs & Prompt Engineering
    { name: 'OpenAI API & GPT-4o', slug: 'openai-api', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'Anthropic Claude API', slug: 'anthropic-claude', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'LangChain', slug: 'langchain', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'LlamaIndex', slug: 'llamaindex', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'RAG (Retrieval-Augmented Generation)', slug: 'rag-architecture', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'Vector Databases (Pinecone / Weaviate)', slug: 'vector-databases', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'Prompt Engineering', slug: 'prompt-engineering', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'LLM Fine-Tuning (LoRA / QLoRA)', slug: 'llm-fine-tuning', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'Ollama & Local LLMs', slug: 'ollama', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },
    { name: 'Hugging Face Transformers', slug: 'huggingface', category: 'AI & Data Engineering / LLMs & Prompt Engineering' },

    // Machine Learning & Deep Learning
    { name: 'PyTorch', slug: 'pytorch', category: 'AI & Data Engineering / Machine Learning & Deep Learning' },
    { name: 'TensorFlow / Keras', slug: 'tensorflow', category: 'AI & Data Engineering / Machine Learning & Deep Learning' },
    { name: 'Scikit-Learn', slug: 'scikit-learn', category: 'AI & Data Engineering / Machine Learning & Deep Learning' },
    { name: 'MLOps & Model Deployment', slug: 'mlops', category: 'AI & Data Engineering / Machine Learning & Deep Learning' },
    { name: 'Deep Learning & Neural Networks', slug: 'deep-learning', category: 'AI & Data Engineering / Machine Learning & Deep Learning' },
    { name: 'XGBoost & LightGBM', slug: 'xgboost', category: 'AI & Data Engineering / Machine Learning & Deep Learning' },

    // Data Engineering & ETL
    { name: 'Apache Spark', slug: 'apache-spark', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'Apache Airflow', slug: 'apache-airflow', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'dbt (Data Build Tool)', slug: 'dbt', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'Snowflake', slug: 'snowflake', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'Databricks', slug: 'databricks', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'Google BigQuery', slug: 'bigquery', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'ETL Pipelines', slug: 'etl-pipelines', category: 'AI & Data Engineering / Data Engineering & ETL' },
    { name: 'Pandas & NumPy', slug: 'pandas-numpy', category: 'AI & Data Engineering / Data Engineering & ETL' },

    // Computer Vision & NLP
    { name: 'OpenCV', slug: 'opencv', category: 'AI & Data Engineering / Computer Vision & NLP' },
    { name: 'YOLO Object Detection', slug: 'yolo-detection', category: 'AI & Data Engineering / Computer Vision & NLP' },
    { name: 'NLP & Text Processing', slug: 'nlp-processing', category: 'AI & Data Engineering / Computer Vision & NLP' },
    { name: 'Whisper Speech-to-Text', slug: 'whisper-api', category: 'AI & Data Engineering / Computer Vision & NLP' },
    { name: 'BERT & Transformers', slug: 'bert-transformers', category: 'AI & Data Engineering / Computer Vision & NLP' },

    // Data Analytics & BI Dashboards
    { name: 'Power BI', slug: 'power-bi', category: 'AI & Data Engineering / Data Analytics & BI Dashboards' },
    { name: 'Tableau', slug: 'tableau', category: 'AI & Data Engineering / Data Analytics & BI Dashboards' },
    { name: 'Looker Studio', slug: 'looker-studio', category: 'AI & Data Engineering / Data Analytics & BI Dashboards' },
    { name: 'SQL Data Analysis', slug: 'sql-analytics', category: 'AI & Data Engineering / Data Analytics & BI Dashboards' },
    { name: 'KPI & Executive Dashboards', slug: 'kpi-dashboards', category: 'AI & Data Engineering / Data Analytics & BI Dashboards' },

    // --- UI/UX & Product Design ---
    // Web & Mobile UI/UX
    { name: 'Figma', slug: 'figma', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },
    { name: 'User Flow & Wireframing', slug: 'user-flows-wireframing', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },
    { name: 'Mobile App UI Design', slug: 'mobile-app-ui', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },
    { name: 'Web App Interface Design', slug: 'web-app-design', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },
    { name: 'Responsive Layouts', slug: 'responsive-layouts', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },
    { name: 'Adobe XD', slug: 'adobe-xd', category: 'UI/UX & Product Design / Web & Mobile UI/UX' },

    // Design Systems & Figma Kits
    { name: 'Design Systems Architecture', slug: 'design-systems', category: 'UI/UX & Product Design / Design Systems & Figma Kits' },
    { name: 'Figma Auto-Layout & Variants', slug: 'figma-auto-layout', category: 'UI/UX & Product Design / Design Systems & Figma Kits' },
    { name: 'Design Tokens', slug: 'design-tokens', category: 'UI/UX & Product Design / Design Systems & Figma Kits' },
    { name: 'Storybook Component Sync', slug: 'storybook-sync', category: 'UI/UX & Product Design / Design Systems & Figma Kits' },

    // Brand & Visual Identity
    { name: 'Brand Identity & Guidelines', slug: 'brand-identity', category: 'UI/UX & Product Design / Brand & Visual Identity' },
    { name: 'Logo Design', slug: 'logo-design', category: 'UI/UX & Product Design / Brand & Visual Identity' },
    { name: 'Typography & Color Theory', slug: 'typography-color-theory', category: 'UI/UX & Product Design / Brand & Visual Identity' },
    { name: 'Adobe Illustrator', slug: 'adobe-illustrator', category: 'UI/UX & Product Design / Brand & Visual Identity' },
    { name: 'Adobe Photoshop', slug: 'adobe-photoshop', category: 'UI/UX & Product Design / Brand & Visual Identity' },

    // Prototypes & User Research
    { name: 'Interactive Figma Prototyping', slug: 'interactive-prototyping', category: 'UI/UX & Product Design / Prototypes & User Research' },
    { name: 'Usability Testing', slug: 'usability-testing', category: 'UI/UX & Product Design / Prototypes & User Research' },
    { name: 'User Persona & Journey Maps', slug: 'user-personas', category: 'UI/UX & Product Design / Prototypes & User Research' },
    { name: 'ProtoPie', slug: 'protopie', category: 'UI/UX & Product Design / Prototypes & User Research' },

    // Graphic Design & Illustrations
    { name: 'Vector Illustration', slug: 'vector-illustration', category: 'UI/UX & Product Design / Graphic Design & Illustrations' },
    { name: 'Iconography & Asset Design', slug: 'iconography', category: 'UI/UX & Product Design / Graphic Design & Illustrations' },
    { name: 'Marketing Graphics & Banners', slug: 'marketing-graphics', category: 'UI/UX & Product Design / Graphic Design & Illustrations' },
    { name: '3D UI Elements (Spline / Blender)', slug: 'spline-blender', category: 'UI/UX & Product Design / Graphic Design & Illustrations' },

    // --- Cybersecurity & Systems ---
    // Penetration Testing & Audits
    { name: 'Penetration Testing (PenTest)', slug: 'penetration-testing', category: 'Cybersecurity & Systems / Penetration Testing & Audits' },
    { name: 'Vulnerability Assessment', slug: 'vulnerability-assessment', category: 'Cybersecurity & Systems / Penetration Testing & Audits' },
    { name: 'OWASP Top 10 Security', slug: 'owasp-top-10', category: 'Cybersecurity & Systems / Penetration Testing & Audits' },
    { name: 'Burp Suite', slug: 'burp-suite', category: 'Cybersecurity & Systems / Penetration Testing & Audits' },
    { name: 'Kali Linux', slug: 'kali-linux', category: 'Cybersecurity & Systems / Penetration Testing & Audits' },
    { name: 'Nmap & Network Scanning', slug: 'nmap-scanning', category: 'Cybersecurity & Systems / Penetration Testing & Audits' },

    // Smart Contract Auditing
    { name: 'Smart Contract Security Auditing', slug: 'smart-contract-audits', category: 'Cybersecurity & Systems / Smart Contract Auditing' },
    { name: 'Slither & Mythril', slug: 'slither-mythril', category: 'Cybersecurity & Systems / Smart Contract Auditing' },
    { name: 'Gas Optimization Audits', slug: 'gas-optimization-audits', category: 'Cybersecurity & Systems / Smart Contract Auditing' },
    { name: 'Reentrancy & Flash Loan Protection', slug: 'reentrancy-protection', category: 'Cybersecurity & Systems / Smart Contract Auditing' },

    // Cloud & Network Security
    { name: 'AWS IAM & Zero Trust', slug: 'aws-iam-zero-trust', category: 'Cybersecurity & Systems / Cloud & Network Security' },
    { name: 'Cloud Infrastructure Security', slug: 'cloud-security', category: 'Cybersecurity & Systems / Cloud & Network Security' },
    { name: 'Firewalls & WAF Configuration', slug: 'firewalls-waf', category: 'Cybersecurity & Systems / Cloud & Network Security' },
    { name: 'SOC 2 & ISO 27001 Compliance', slug: 'soc2-compliance', category: 'Cybersecurity & Systems / Cloud & Network Security' },

    // Incident Response & Hardening
    { name: 'Linux Server Hardening', slug: 'server-hardening', category: 'Cybersecurity & Systems / Incident Response & Hardening' },
    { name: 'SIEM & Threat Monitoring', slug: 'siem-monitoring', category: 'Cybersecurity & Systems / Incident Response & Hardening' },
    { name: 'Security Incident Response', slug: 'incident-response', category: 'Cybersecurity & Systems / Incident Response & Hardening' },
    { name: 'DDoS Mitigation & Rate Limiting', slug: 'ddos-mitigation', category: 'Cybersecurity & Systems / Incident Response & Hardening' },

    // --- Writing & Translation ---
    // Technical Writing & Documentation
    { name: 'Technical Writing', slug: 'technical-writing', category: 'Writing & Translation / Technical Writing & Documentation' },
    { name: 'API Documentation (Swagger / OpenAPI)', slug: 'api-documentation', category: 'Writing & Translation / Technical Writing & Documentation' },
    { name: 'Developer Tutorials & Guides', slug: 'developer-guides', category: 'Writing & Translation / Technical Writing & Documentation' },
    { name: 'Whitepapers & Architecture Specs', slug: 'whitepapers-specs', category: 'Writing & Translation / Technical Writing & Documentation' },
    { name: 'GitBook & Docusaurus Docs', slug: 'gitbook-docusaurus', category: 'Writing & Translation / Technical Writing & Documentation' },

    // Copywriting & Content Strategy
    { name: 'Landing Page Copywriting', slug: 'landing-page-copy', category: 'Writing & Translation / Copywriting & Content Strategy' },
    { name: 'Conversion Copywriting', slug: 'conversion-copywriting', category: 'Writing & Translation / Copywriting & Content Strategy' },
    { name: 'Brand Storytelling & Messaging', slug: 'brand-storytelling', category: 'Writing & Translation / Copywriting & Content Strategy' },
    { name: 'Sales Funnel Copywriting', slug: 'sales-funnels-copy', category: 'Writing & Translation / Copywriting & Content Strategy' },

    // SEO Content & Articles
    { name: 'SEO Content Writing', slug: 'seo-content-writing', category: 'Writing & Translation / SEO Content & Articles' },
    { name: 'Keyword Research & Strategy', slug: 'keyword-research-strategy', category: 'Writing & Translation / SEO Content & Articles' },
    { name: 'Tech Blog Post Writing', slug: 'tech-blog-writing', category: 'Writing & Translation / SEO Content & Articles' },
    { name: 'Thought Leadership Articles', slug: 'thought-leadership', category: 'Writing & Translation / SEO Content & Articles' },

    // Translation & Localization
    { name: 'App Localization & i18n', slug: 'app-localization', category: 'Writing & Translation / Translation & Localization' },
    { name: 'English - Spanish Translation', slug: 'translation-spanish', category: 'Writing & Translation / Translation & Localization' },
    { name: 'English - French Translation', slug: 'translation-french', category: 'Writing & Translation / Translation & Localization' },
    { name: 'English - German Translation', slug: 'translation-german', category: 'Writing & Translation / Translation & Localization' },
    { name: 'Proofreading & Editing', slug: 'proofreading-editing', category: 'Writing & Translation / Translation & Localization' },

    // --- Marketing & Growth ---
    // Search Engine Optimization (SEO)
    { name: 'Technical SEO', slug: 'technical-seo', category: 'Marketing & Growth / Search Engine Optimization (SEO)' },
    { name: 'On-Page SEO', slug: 'on-page-seo', category: 'Marketing & Growth / Search Engine Optimization (SEO)' },
    { name: 'Backlink Building Strategy', slug: 'backlinks-strategy', category: 'Marketing & Growth / Search Engine Optimization (SEO)' },
    { name: 'Google Analytics 4 (GA4)', slug: 'google-analytics-4', category: 'Marketing & Growth / Search Engine Optimization (SEO)' },
    { name: 'Ahrefs & SEMrush', slug: 'ahrefs-semrush', category: 'Marketing & Growth / Search Engine Optimization (SEO)' },

    // Paid Advertising (PPC / Google / Meta)
    { name: 'Google Ads (Search & Display)', slug: 'google-ads', category: 'Marketing & Growth / Paid Advertising (PPC / Google / Meta)' },
    { name: 'Meta Ads (Facebook & Instagram)', slug: 'meta-ads', category: 'Marketing & Growth / Paid Advertising (PPC / Google / Meta)' },
    { name: 'LinkedIn Ads (B2B)', slug: 'linkedin-ads', category: 'Marketing & Growth / Paid Advertising (PPC / Google / Meta)' },
    { name: 'ROAS & Conversion Tracking', slug: 'roas-tracking', category: 'Marketing & Growth / Paid Advertising (PPC / Google / Meta)' },

    // Social Media & Community Management
    { name: 'Discord Community Management', slug: 'discord-community', category: 'Marketing & Growth / Social Media & Community Management' },
    { name: 'X / Twitter Growth Strategy', slug: 'twitter-growth', category: 'Marketing & Growth / Social Media & Community Management' },
    { name: 'LinkedIn Personal Branding & Growth', slug: 'linkedin-growth', category: 'Marketing & Growth / Social Media & Community Management' },
    { name: 'Telegram Community Management', slug: 'telegram-community', category: 'Marketing & Growth / Social Media & Community Management' },

    // Email Marketing & CRM Automation
    { name: 'HubSpot CRM Automation', slug: 'hubspot-automation', category: 'Marketing & Growth / Email Marketing & CRM Automation' },
    { name: 'Klaviyo Email Flows', slug: 'klaviyo-flows', category: 'Marketing & Growth / Email Marketing & CRM Automation' },
    { name: 'Drip & Lifecycle Campaigns', slug: 'drip-campaigns', category: 'Marketing & Growth / Email Marketing & CRM Automation' },
    { name: 'Cold Email Lead Generation', slug: 'cold-email-leadgen', category: 'Marketing & Growth / Email Marketing & CRM Automation' },
  ];

  for (const skill of INITIAL_SKILLS) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: { name: skill.name, category: skill.category, isActive: true },
      create: { name: skill.name, slug: skill.slug, category: skill.category, isActive: true },
    });
  }

  console.log(`[Seed] Seeded ${INITIAL_SKILLS.length} targeted skills.`);
}

main()
  .catch((e) => {
    console.error('[Seed] Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

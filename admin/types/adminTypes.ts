export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AdminLoginResponse {
  requires2FA: boolean;
  preAuthToken?: string;
  message: string;
  admin?: AdminUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface DashboardMetrics {
  gmv: number;
  netRevenue: number;
  escrowTvl: number;
  pendingPayouts: number;
  totalUsers: number;
  activeJobs: number;
  activeContracts: number;
  activeDisputes: number;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type WithdrawalMethod = 'BKASH' | 'NAGAD';

export interface AdminWithdrawal {
  id: string;
  freelancerId: string;
  freelancer: {
    id: string;
    email: string;
    freelancerProfile?: {
      title?: string;
      earnings?: number;
      rating?: number;
    };
  };
  amount: number;
  method: WithdrawalMethod;
  accountNumber: string;
  status: WithdrawalStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus = 'FUNDED' | 'PENDING_APPROVAL' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED';

export interface AdminMessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface AdminChatMessage {
  id: string;
  senderId: string;
  sender?: {
    id: string;
    email: string;
    role: string;
  };
  content?: string;
  messageType: 'TEXT' | 'FILE' | 'SYSTEM';
  createdAt: string;
  attachments?: AdminMessageAttachment[];
}

export interface AdminDisputeDossier {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  escrowAmount: number;
  platformFee: number;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    email: string;
    clientProfile?: {
      companyName?: string;
      totalSpent?: number;
      rating?: number;
    };
  };
  freelancer: {
    id: string;
    email: string;
    freelancerProfile?: {
      title?: string;
      earnings?: number;
      rating?: number;
      successRate?: number;
    };
  };
  job: {
    id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
  };
  proposal?: {
    id: string;
    bidAmount: number;
    coverLetter: string;
    createdAt: string;
  };
  conversation?: {
    id: string;
    messages: AdminChatMessage[];
  };
  refund?: {
    id: string;
    amount: number;
    reason?: string;
    createdAt: string;
  };
}

export interface AdminUserListItem {
  id: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  isEmailVerified: boolean;
  isBanned: boolean;
  walletBalance: number;
  createdAt: string;
  clientProfile?: {
    companyName?: string;
    totalSpent?: number;
    rating?: number;
  };
  freelancerProfile?: {
    title?: string;
    earnings?: number;
    rating?: number;
  };
}

export interface CircuitBreakerFlags {
  payoutsKilled: boolean;
  escrowKilled: boolean;
  maintenanceMode: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    jobs?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  subCategories?: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    jobs?: number;
    subCategories?: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProposal {
  id: string;
  jobId: string;
  freelancerId: string;
  bidAmount: number;
  coverLetter: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
  freelancer: {
    id: string;
    email: string;
    freelancerProfile?: {
      title?: string;
      rating?: number;
      earnings?: number;
      hourlyRate?: number;
      skills?: string[];
    };
  };
}

export interface AdminJob {
  id: string;
  clientId: string;
  title: string;
  description: string;
  categoryId?: string;
  subCategoryId?: string;
  categoryName?: string;
  subCategoryName?: string;
  budget: number;
  skills: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    email: string;
    clientProfile?: {
      companyName?: string;
      totalSpent?: number;
      rating?: number;
    };
  };
  category?: Category;
  subCategory?: SubCategory;
  _count?: {
    proposals?: number;
    contracts?: number;
  };
}

export interface AdminUserProfileDossier {
  id: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  isEmailVerified: boolean;
  isBanned: boolean;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
  clientProfile?: {
    id: string;
    companyName?: string;
    billingDetails?: string;
    totalJobPosts: number;
    totalSpent: number;
    rating: number;
    totalReviews: number;
  };
  freelancerProfile?: {
    id: string;
    title?: string;
    description?: string;
    hourlyRate?: number;
    skills: string[];
    country?: string;
    city?: string;
    address?: string;
    totalProjects: number;
    earnings: number;
    rating: number;
    totalReviews: number;
    successRate: number;
  };
  givenReviews?: any[];
  receivedReviews?: any[];
}

export interface HomepageCmsConfig {
  id: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseDescription: string;
  metrics: Array<{
    value: string;
    label: string;
    sub: string;
    color?: string;
  }>;
  testimonials: Array<{
    author: string;
    role: string;
    badge: string;
    quote: string;
    stat: string;
    statLabel: string;
    avatar: string;
  }>;
  trustedBrands: string[];
  clientCtaTitle: string;
  clientCtaText: string;
  talentCtaTitle: string;
  talentCtaText: string;
}

export interface OverviewAnalyticsData {
  timeframe: string;
  period: { startDate: string; endDate: string };
  kpis: {
    grossVolume: number;
    netRevenue: number;
    activeContractsCount: number;
    totalUsers: number;
    totalFreelancers: number;
    totalClients: number;
    totalJobs: number;
    totalProposals: number;
    conversionRate: number;
  };
  timeline: Array<{
    label: string;
    gmv: number;
    netRevenue: number;
    jobs: number;
    proposals: number;
  }>;
  categoryDistribution: Array<{
    id: string;
    name: string;
    jobsCount: number;
  }>;
  recentDeals?: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    task: string;
    dueDate: string;
    revenue: string;
    status: 'In progress' | 'Pending' | 'Completed';
  }>;
  pendingTasks?: Array<{
    id: string;
    iconBg: string;
    iconText: string;
    iconChar: string;
    title: string;
    date: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  performanceScore?: number;
}


export interface FreelancerAnalyticsData {
  timeframe: string;
  period: { startDate: string; endDate: string };
  kpis: {
    totalFreelancers: number;
    newFreelancersInPeriod: number;
    avgHourlyRate: number;
    totalEarningsPaid: number;
    profileCompletionRate: number;
  };
  timeline: Array<{
    label: string;
    signups: number;
    verified: number;
  }>;
  rateTiers: Array<{ label: string; count: number }>;
  earningsTiers: Array<{ label: string; count: number }>;
  topSkills: Array<{ name: string; count: number }>;
  topEarners: Array<{
    id: string;
    email: string;
    title: string;
    earnings: number;
    rating: number;
    totalProjects: number;
    hourlyRate: number | null;
  }>;
}

export interface ClientAnalyticsData {
  timeframe: string;
  period: { startDate: string; endDate: string };
  kpis: {
    totalClients: number;
    newClientsInPeriod: number;
    totalClientSpent: number;
    avgSpendPerClient: number;
    repeatHiringRate: number;
    jobsPostedInPeriod: number;
  };
  timeline: Array<{
    label: string;
    clientSignups: number;
    jobsPosted: number;
    totalBudget: number;
  }>;
  spendTiers: Array<{ label: string; count: number }>;
  topSpenders: Array<{
    id: string;
    email: string;
    companyName: string;
    totalSpent: number;
    totalJobPosts: number;
    rating: number;
  }>;
}

export interface CashFlowAnalyticsData {
  timeframe: string;
  period: { startDate: string; endDate: string };
  kpis: {
    grossEscrowInflow: number;
    talentDisbursed: number;
    netPlatformCommission: number;
    refundedVolume: number;
    activeVaultHeld: number;
    userWalletLiabilities: number;
  };
  timeline: Array<{
    label: string;
    inflow: number;
    outflow: number;
    netFee: number;
  }>;
  channelBreakdown: Array<{
    method: string;
    volume: number;
  }>;
}

export interface JobAnalyticsData {
  timeframe: string;
  period: { startDate: string; endDate: string };
  kpis: {
    totalJobs: number;
    openJobs: number;
    inProgressJobs: number;
    completedJobs: number;
    cancelledJobs: number;
    avgJobBudget: number;
    completionRate: number;
    flaggedCount: number;
  };
  timeline: Array<{
    label: string;
    created: number;
    completedOrHired: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  categoryBreakdown: Array<{
    id: string;
    name: string;
    count: number;
    volume: number;
    avgBudget: number;
  }>;
}

export interface ProposalAnalyticsData {
  timeframe: string;
  period: { startDate: string; endDate: string };
  kpis: {
    totalProposals: number;
    acceptedCount: number;
    pendingCount: number;
    rejectedCount: number;
    acceptanceRate: number;
    avgProposalsPerJob: number;
    avgBidAmount: number;
    flaggedCount: number;
  };
  timeline: Array<{
    label: string;
    submitted: number;
    accepted: number;
  }>;
  statusBreakdown: Array<{
    label: string;
    count: number;
    color: string;
  }>;
  bidRatioDistribution: Array<{
    label: string;
    count: number;
  }>;
}

export interface EnterpriseSettings {
  // 1. Security & Access
  enforce2FA: boolean;
  enableSSO: boolean;
  ssoProvider: 'GOOGLE_WORKSPACE' | 'OKTA' | 'AZURE_AD' | 'CUSTOM_SAML';
  ssoDomain: string;
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string;
  passwordRotationDays: number;
  failedLoginLockoutThreshold: number;

  // 2. Escrow, Billing & Gateways
  standardCommissionRate: number;
  highVolumeCommissionRate: number;
  enterpriseCommissionRate: number;
  escrowClearingPeriodDays: number;
  instantReleaseTopRated: boolean;
  minWithdrawalAmount: number;
  maxDailyWithdrawalPerUser: number;
  sslCommerzEnabled: boolean;
  sslCommerzStoreId: string;
  sslCommerzSandbox: boolean;
  bKashMerchantEnabled: boolean;
  bKashAppKey: string;
  nagadMerchantEnabled: boolean;
  disputeArbitrationFee: number;

  // 3. KYC, AML & Compliance
  requireKycBeforePayout: boolean;
  kycVerificationLevel: 'STANDARD' | 'ENHANCED' | 'MANUAL_STRICT';
  amlSinglePayoutThreshold: number;
  amlDailyVelocityThreshold: number;
  automatedVatWithholding: boolean;
  vatRatePercentage: number;
  disputeWindowDays: number;
  dataRetentionYears: number;
  privacyRightToErasure: boolean;

  // 4. Notifications, Webhooks & Alerts
  smtpHost: string;
  smtpPort: number;
  smtpSenderEmail: string;
  smsGatewayProvider: 'GREENWEB' | 'SSL_WIRELESS' | 'TWILIO';
  smsOtpEnabled: boolean;
  outboundWebhooksEnabled: boolean;
  webhookEndpointUrl: string;
  webhookSecret: string;
  webhookEvents: string[];
  slackAlertWebhook: string;
  slackAlertCriticalThreshold: 'ALL_EVENTS' | 'HIGH_SEVERITY_ONLY';
}



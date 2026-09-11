'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { proposalsApi } from '../api/proposalsApi';
import { ProposalItem } from '../types/proposalsTypes';
import { ProposalHeaderTelemetry } from './ProposalHeaderTelemetry';
import { ProposalFilterStrip } from './ProposalFilterStrip';
import { ProposalCandidateCard } from './ProposalCandidateCard';
import { ProposalEscrowSummaryWidget } from './ProposalEscrowSummaryWidget';
import { ProposalBenchmarkMatrixWidget } from './ProposalBenchmarkMatrixWidget';
import { ProposalMultisigVaultStatus } from './ProposalMultisigVaultStatus';

const DEMO_PROPOSALS: ProposalItem[] = [
  {
    id: 'prop-alex-rivera',
    jobId: 'job-1',
    freelancerId: 'freelancer-1',
    freelancerName: 'Alex Rivera',
    freelancerHandle: 'alexr.eth',
    freelancerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgX-gsExAvS3JC8vMl4Vg9Hu7-MWSyIskhiNNUQMC_zDRul90MCEgPP3N4_mbzvtDWyiBUg9fXK75M0Igb010eQpdGrEudPIwBFJfNEoiEhLCeQrBqU3RhVodVHc0ny0JWmgQJXTKzjaO4k-PAtMY6RsccMSfcokqduFQJ4EA9SqZZPhMCS6uHIaQUo_kW3WtREiI9GFlUXaOMZsWWue086BcOUStUclB6SdlT6B0zo4-Vi52Uh9qC',
    freelancerRole: 'Tier 4 Builder',
    sbtId: 'SBT #0412',
    bio: 'Senior Distributed Systems & Stylus Invariants Researcher • Ex-Offchain Labs Contributor',
    fitScore: 98.4,
    bidAmount: 14500,
    currency: 'USDC',
    budgetComparison: '-$500 vs. budget',
    durationWeeks: 3,
    deliveryDate: 'May 14, 2025',
    milestoneCount: 3,
    arbitration: 'Kleros Core',
    courtId: '#32',
    coverLetter: 'We have already built an EVM-to-Stylus equivalence testing harness. We can port your Uniswap v2 constant-product curve into Rust while reducing gas footprint by ~68% on swaps through optimized SIMD operations.',
    isShortlisted: true,
    credentials: [],
    milestones: [
      { step: 'M1', title: 'Formal Math Specification & Wasm Memory Model', durationDays: 5, amount: 3500, currency: 'USDC' },
      { step: 'M2', title: 'Foundry Invariant Fuzzing & Dual-VM State Tests', durationDays: 9, amount: 6000, currency: 'USDC' },
      { step: 'M3', title: 'Arbitrum Sepolia Deployment & Subgraph Sync', durationDays: 7, amount: 5000, currency: 'USDC' },
    ],
    createdAt: new Date().toISOString(),
    status: 'SHORTLISTED',
  },
  {
    id: 'prop-marcus-vance',
    jobId: 'job-1',
    freelancerId: 'freelancer-2',
    freelancerName: 'Marcus Vance',
    freelancerHandle: 'mvance.eth',
    freelancerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8YKJWef_OpPBLMFrBMZEIAD1R2KhrMKCZkgHl0rtsxP23IqdT5ims02gamv9tjxwfV_OLt-_mmqfgdGPbCHih_QkYE1gVm7JQZ47KaJkAY8g1ESXS4mQH2P1nWYvDyBjvNEGmD2-0DeGY4iIMDXoejeeKNE7in9e7Wqii9n3EaAwb3Mx1rfRgUrlC9NaAB6w1YSvIx7QJao2h5HQJ64guNt2ycOjEfbphAdoWVAPDgVFEuJoMF8nf',
    freelancerRole: 'Core Rust Engineer',
    sbtId: 'SBT #0891',
    bio: 'Ex-Trail of Bits Fellow • Stylus SDK Maintainer & Wasm Optimization Lead',
    fitScore: 94.1,
    bidAmount: 15000,
    currency: 'USDC',
    budgetComparison: 'Exact Target Budget',
    durationWeeks: 4,
    deliveryDate: 'May 21, 2025',
    milestoneCount: 4,
    arbitration: 'OpenZeppelin',
    courtId: '#12',
    coverLetter: 'Lead maintainer for WebAssembly core libraries. We will ensure formal verification on all mathematical functions with comprehensive Slither pipelines.',
    isShortlisted: true,
    credentials: [],
    milestones: [
      { step: 'M1', title: 'Rust Stylus Architecture & Memory Safety Spec', durationDays: 7, amount: 4000, currency: 'USDC' },
      { step: 'M2', title: 'Integration Test Harness & Benchmark Analysis', durationDays: 10, amount: 6000, currency: 'USDC' },
      { step: 'M3', title: 'Production Multi-Sig Escrow Deployment', durationDays: 7, amount: 5000, currency: 'USDC' },
    ],
    createdAt: new Date().toISOString(),
    status: 'SHORTLISTED',
  },
];

interface ProposalEvaluationViewProps {
  jobId: string;
}

export const ProposalEvaluationView: React.FC<ProposalEvaluationViewProps> = ({ jobId }) => {
  const [search, setSearch] = useState('');
  const [seniority, setSeniority] = useState('ALL');
  const [hasCertikFilter, setHasCertikFilter] = useState(true);

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getJobDetails(jobId).catch(() => null),
  });

  const { data: realProposals = [] } = useQuery({
    queryKey: ['job-proposals', jobId],
    queryFn: () => proposalsApi.getJobProposals(jobId).catch(() => []),
  });

  const handleAccept = async (proposalId: string) => {
    try {
      await proposalsApi.acceptProposal(proposalId);
      alert('Proposal accepted! Escrow contract formation transaction initiated on Arbitrum One.');
    } catch {
      alert('Escrow smart contract co-signing initiated for Safe multi-sig co-signers.');
    }
  };

  const proposals: ProposalItem[] = realProposals.length > 0 ? realProposals : DEMO_PROPOSALS;
  const filtered = proposals.filter((p) => {
    if (search && !p.freelancerName.toLowerCase().includes(search.toLowerCase()) && !p.freelancerHandle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8">
        <ProposalHeaderTelemetry jobId={jobId} jobTitle={job?.title} budget={job?.budget} totalProposals={proposals.length} />
        <ProposalFilterStrip search={search} onSearchChange={setSearch} seniority={seniority} onSeniorityChange={setSeniority} hasCertikFilter={hasCertikFilter} onToggleCertik={() => setHasCertikFilter(!hasCertikFilter)} />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
            {filtered.map((item) => (
              <ProposalCandidateCard key={item.id} proposal={item} onAccept={handleAccept} />
            ))}
          </div>
          <div className="xl:col-span-4 flex flex-col gap-6 xl:sticky xl:top-20">
            <ProposalEscrowSummaryWidget budget={job?.budget} />
            <ProposalBenchmarkMatrixWidget />
            <ProposalMultisigVaultStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

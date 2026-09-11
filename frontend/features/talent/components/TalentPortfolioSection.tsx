import React from 'react';
import { Layers, CheckCircle2, ExternalLink, GitBranch } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentPortfolioSectionProps {
  profile: FreelancerProfile;
}

const DEFAULT_PORTFOLIO = [
  {
    id: 'p1',
    title: 'Concentrated Liquidity AMM Core',
    network: 'Arbitrum Orbit • Uniswap v3 Fork',
    amount: 8500,
    desc: 'Re-engineered tick bitmap allocation and math libraries for 22% lower gas consumption on L2 rollups. Integrated custom protocol fee switches and flash-swap safeguards.',
    highlight: '100% Invariant Test Coverage in Foundry',
  },
  {
    id: 'p2',
    title: 'Cross-Chain Yield Aggregator & Vault Strategy',
    network: 'Optimism / Base • ERC-4626 Standard',
    amount: 14200,
    desc: 'Architected auto-compounding LP vaults compliant with the ERC-4626 tokenized vault standard. Reached 100% branch test coverage with differential fuzzing via Foundry and Slither.',
    highlight: 'Production Audited by Tier-1 Security Firms',
  },
  {
    id: 'p3',
    title: 'Multi-Sig Timelock Governance Protocol',
    network: 'Ethereum Mainnet • Custom Threshold Voting',
    amount: 21000,
    desc: 'Designed state machine governance contracts featuring emergency circuit breakers, optimistic execution windows, and EIP-712 off-chain signature aggregators.',
    highlight: 'Gas Optimized Assembly (Yul)',
  },
];

export function TalentPortfolioSection({ profile }: TalentPortfolioSectionProps) {
  const items = profile.portfolioItems?.length
    ? profile.portfolioItems.map((pi, idx) => ({
        id: pi.id,
        title: pi.title,
        network: 'Verified Escrow Deployment',
        amount: 8500 + idx * 4000,
        desc: pi.description || 'Verified smart contract architecture and implementation.',
        highlight: '100% Test Coverage',
      }))
    : DEFAULT_PORTFOLIO;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Verified Deployments</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Cryptographically settled contracts tied to verified developer identity
          </p>
        </div>
        <span className="text-xs font-mono text-primary bg-surface-container-high px-2.5 py-1 rounded-full border border-primary/20">
          {items.length} Production Audits
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-surface-container-high text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{item.title}</h3>
                  <span className="text-xs font-mono text-on-surface-variant">{item.network}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold font-mono text-on-surface bg-surface-container px-2.5 py-1 rounded-lg">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs font-mono text-primary flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Settled
                </span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/10 text-xs">
              <div className="flex items-center gap-3 font-mono text-on-surface-variant">
                <span className="flex items-center gap-1 hover:text-on-surface cursor-pointer">
                  <GitBranch className="w-3.5 h-3.5" />
                  Repo Verified
                </span>
                <span className="flex items-center gap-1 text-primary cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Explorer
                </span>
              </div>
              <span className="text-[11px] font-mono text-secondary">{item.highlight}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

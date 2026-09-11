'use client';

import React from 'react';
import Image from 'next/image';

interface ProfileDecentralizedIdentitySectionProps {
  title: string;
  onTitleChange: (val: string) => void;
  bio: string;
  onBioChange: (val: string) => void;
  ensDomain: string;
  onEnsChange: (val: string) => void;
}

export const ProfileDecentralizedIdentitySection: React.FC<ProfileDecentralizedIdentitySectionProps> = ({
  title,
  onTitleChange,
  bio,
  onBioChange,
  ensDomain,
  onEnsChange,
}) => {
  return (
    <section className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">account_box</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Decentralized Identity &amp; ENS</h2>
            <p className="text-xs text-on-surface-variant">On-chain name resolution, verified avatars, and public profile data</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-surface-container-low font-mono text-xs text-primary flex items-center gap-1 border border-outline-variant/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Mainnet ENS Synced
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-container-highest border border-outline-variant/30 shrink-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrrP3YPoJ486PaQz1H0J1DpoBodlKcYfiNVAQhmWwmFXjMNSxAo8SDW76NNQ--LcV-Dp8DEWcBgS0jxt0uYC_efyzeBEKiS2-gp6EJGBBaWlI5C6_15C399Cf3PqamKv6nrBKVjJX9ViKFtL-yAPrkZa10gT8GQellz8qCW8YYaWidW6WUMEpFC4GfjvJzY2JOyIh3xgUEsuBvVuwuxf9IGR1efjrlwnkpK0wK932bHM0XIyueE1k"
            alt="PFP"
            fill
            className="object-cover"
          />
          <span className="absolute -bottom-1 -right-1 px-1 py-0.5 rounded bg-surface-container-highest font-mono text-[9px] text-primary">
            ERC-721
          </span>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-on-surface">Alex Rivera</span>
            <span className="font-mono text-xs text-primary bg-surface-container px-2 py-0.5 rounded">0x3C49...81B7</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant font-mono">
            <span>IPFS CID: QmX8...4e2v</span>
            <span>•</span>
            <span className="text-on-surface">ERC-6551 Token Bound Active</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button type="button" onClick={() => alert('Connect Web3 wallet to select NFT avatar...')} className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[14px]">upload_file</span>
              <span>Update PFP NFT</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface flex items-center justify-between">
            <span>Primary ENS Domain</span>
            <span className="font-mono text-[11px] text-primary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">check</span> Resolved
            </span>
          </label>
          <input
            type="text"
            value={ensDomain}
            onChange={(e) => onEnsChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 px-3 py-2 rounded-xl font-mono text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface">Professional Title / Specialization</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 px-3 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-on-surface">Professional Bio &amp; Architecture Specialization</label>
          <span className="font-mono text-[11px] text-on-surface-variant">{bio.length} / 2000</span>
        </div>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
        />
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';

interface ContractWorkSubmissionFormProps {
  onSubmit: (payload: { githubUrl: string; ipfsCid: string; notes: string }) => Promise<void>;
  onRequestExtension: () => void;
  isSubmitting?: boolean;
}

export const ContractWorkSubmissionForm: React.FC<ContractWorkSubmissionFormProps> = ({
  onSubmit,
  onRequestExtension,
  isSubmitting,
}) => {
  const [githubUrl, setGithubUrl] = useState('https://github.com/kroma-network/orbit-amm/pull/42');
  const [ipfsCid, setIpfsCid] = useState('ipfs://bafybeic73klqp9384nslakdfu20485nlqw9eirugkdlsie01');
  const [notes, setNotes] = useState('### Deliverable Summary:\n- 120,000 fuzz runs passed on OrbitAMM pool core invariant logic\n- Slither triage report: 0 High, 0 Medium, 2 Lows acknowledged\n- Foundry gas profiling benchmarks attached in IPFS bundle');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ githubUrl, ipfsCid, notes });
    setIsDone(true);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
          <h4 className="text-base font-bold text-on-surface">Deliverable Work Submission</h4>
        </div>
        <span className="text-xs text-on-surface-variant font-mono">IPFS Pinning Enabled</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface">GitHub Pull Request / Commit Hash *</label>
          <div className="flex items-center bg-surface-container border border-outline-variant/30 px-3 py-2 rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] mr-2">code</span>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-transparent text-xs text-on-surface font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface">Audit Artifacts IPFS CID</label>
          <div className="flex items-center bg-surface-container border border-outline-variant/30 px-3 py-2 rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] mr-2">fingerprint</span>
            <input
              type="text"
              value={ipfsCid}
              onChange={(e) => setIpfsCid(e.target.value)}
              className="w-full bg-transparent text-xs text-on-surface font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-on-surface">Deliverable Summary &amp; Verification Notes</label>
            <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs font-mono">
              <button type="button" onClick={() => setActiveTab('write')} className={`px-2 py-0.5 rounded ${activeTab === 'write' ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}>Write</button>
              <button type="button" onClick={() => setActiveTab('preview')} className={`px-2 py-0.5 rounded ${activeTab === 'preview' ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}>Preview</button>
            </div>
          </div>
          {activeTab === 'write' ? (
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 p-3 rounded-lg text-xs font-mono text-on-surface focus:outline-none resize-y leading-relaxed"
            />
          ) : (
            <div className="bg-surface-container border border-outline-variant/30 p-3 rounded-lg text-xs text-on-surface font-mono whitespace-pre-line leading-relaxed min-h-[96px]">
              {notes}
            </div>
          )}
        </div>

        {isDone && (
          <div className="p-3 bg-surface-container border border-primary/40 rounded-lg flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
            <span className="text-on-surface">Deliverable submitted to smart contract. 48-hour review timer initiated.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-1">
          <button type="button" onClick={onRequestExtension} className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Request Milestone Extension</span>
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>{isSubmitting ? 'Transacting On-Chain...' : 'Submit Deliverable for Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { AdminDisputeDossier } from '@/types/adminTypes';
import { ArbitrationVerdictModal } from './ArbitrationVerdictModal';
import { FileText, MessageSquare, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DisputeDossierView({ dossier, onRefresh }: { dossier: AdminDisputeDossier; onRefresh: () => void }) {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'SCOPE'>('CHAT');
  const [verdictModal, setVerdictModal] = useState<'REFUND' | 'RELEASE' | 'SPLIT' | null>(null);

  const messages = dossier.conversation?.messages || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Contract Dossier #{dossier.id.slice(0, 8)}</span>
          <h2 className="text-xl font-bold text-on-surface mt-0.5">{dossier.job?.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-2 font-medium">
            <span>Client: <strong className="text-on-surface">{dossier.client?.email}</strong></span>
            <span>Freelancer: <strong className="text-on-surface">{dossier.freelancer?.email}</strong></span>
            <span>Escrow TVL: <strong className="text-primary font-bold">৳{dossier.escrowAmount.toLocaleString()} BDT</strong></span>
          </div>
        </div>

        {dossier.status === 'DISPUTED' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setVerdictModal('REFUND')}
              className="px-3.5 py-2 rounded-xl bg-error-container hover:bg-error/20 text-error border border-error/20 text-xs font-bold cursor-pointer transition-colors"
            >
              Force Full Refund
            </button>
            <button
              onClick={() => setVerdictModal('RELEASE')}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            >
              Force Full Release
            </button>
            <button
              onClick={() => setVerdictModal('SPLIT')}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant text-xs font-bold cursor-pointer transition-colors"
            >
              Split Settlement
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-outline-variant bg-white shadow-2xs overflow-hidden">
        <div className="flex border-b border-outline-variant bg-surface-container-low px-2">
          <button
            onClick={() => setActiveTab('CHAT')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 cursor-pointer transition-all',
              activeTab === 'CHAT' ? 'border-primary text-primary bg-white' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            )}
          >
            <MessageSquare className="h-4 w-4" /> Workroom Chat Transcript ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('SCOPE')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 cursor-pointer transition-all',
              activeTab === 'SCOPE' ? 'border-primary text-primary bg-white' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            )}
          >
            <FileText className="h-4 w-4" /> Job Scope & Proposal Details
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'CHAT' ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <p className="text-center text-xs text-outline py-8">No workroom messages recorded.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1.5 font-medium">
                      <span className="font-bold text-on-surface">{m.sender?.email || m.senderId} ({m.sender?.role})</span>
                      <span className="text-outline">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-on-surface whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2 pt-2 border-t border-outline-variant/60">
                        {m.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-outline-variant text-primary hover:bg-surface-container text-xs font-semibold shadow-2xs"
                          >
                            <Download className="h-3.5 w-3.5" /> {att.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <span className="text-[11px] uppercase tracking-wider text-primary font-bold block mb-1">Job Description</span>
                <p className="text-on-surface leading-relaxed text-sm">{dossier.job?.description}</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <span className="text-[11px] uppercase tracking-wider text-primary font-bold block mb-1">Proposal Cover Letter</span>
                <p className="text-on-surface leading-relaxed text-sm">{dossier.proposal?.coverLetter || 'None provided'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ArbitrationVerdictModal
        dossier={dossier}
        verdictType={verdictModal}
        onClose={() => setVerdictModal(null)}
        onSuccess={onRefresh}
      />
    </div>
  );
}

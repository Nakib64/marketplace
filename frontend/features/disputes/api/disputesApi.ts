import { apiClient } from '@/lib/api/apiClient';
import { DisputeCaseDetail, DisputeMetrics } from '../types/disputesTypes';
import { contractsApi } from '@/features/contracts/api/contractsApi';

export const disputesApi = {
  /**
   * Fetch dispute metrics
   */
  async getMetrics(): Promise<DisputeMetrics> {
    try {
      const { data } = await apiClient.get<DisputeMetrics>('/disputes/metrics');
      return data;
    } catch {
      const contracts = await contractsApi.getUserContracts().catch(() => []);
      const disputed = contracts.filter((c) => c.status === 'DISPUTED');
      const totalDisputed = disputed.reduce((sum, c) => sum + Number(c.amount || 0), 0);

      return {
        activeCount: disputed.length,
        resolvedCount: contracts.filter((c) => c.status === 'COMPLETED').length,
        totalDisputedUsdc: totalDisputed,
        avgTurnaroundDays: 0,
      };
    }
  },

  /**
   * Fetch case details by dispute ID
   */
  async getCase(id: string): Promise<DisputeCaseDetail | null> {
    try {
      const { data } = await apiClient.get<DisputeCaseDetail>(`/disputes/${id}`);
      return data;
    } catch {
      try {
        const contract = await contractsApi.getContract(id);
        if (contract) {
          return {
            id: contract.id,
            docketId: `DLC-${contract.id.slice(0, 4).toUpperCase()}`,
            caseNumber: `#${contract.id.slice(0, 6)}`,
            subcourtName: 'Banglance Arbitration Court',
            roundText: 'Mediation & Review Phase',
            title: `Dispute Case: ${contract.title}`,
            description: contract.scopeOfWork || 'Dispute resolution opened regarding project deliverables.',
            contractTitle: contract.title,
            auditPhase: 'Evidence Submission Phase',
            hirerName: contract.clientName || 'Client',
            hirerAddress: contract.clientAddress || 'Client',
            contractorName: contract.freelancerName || 'Freelancer',
            contractorAddress: contract.freelancerName || 'Freelancer',
            claimedValue: Number(contract.amount || 0),
            currency: contract.currency || 'BDT',
            frozenVaultAddress: contract.contractAddress || '0x0000...0000',
            status: contract.status === 'DISPUTED' ? 'EVIDENCE' : 'RESOLVED',
            lifecycleStep: 2,
            jurorRewardEth: 0,
            jurorRewardUsd: 0,
            surchargeUsdc: 0,
            pnkPerJuror: 0,
            jurors: [],
            evidences: [],
          };
        }
      } catch {
        return null;
      }
      return null;
    }
  },

  /**
   * Submit supplementary evidence to dispute
   */
  async submitEvidence(disputeId: string, payload: { title: string; ipfsCid: string }): Promise<{ success: boolean }> {
    const { data } = await apiClient.post<{ success: boolean }>(`/disputes/${disputeId}/evidence`, payload);
    return data;
  },

  /**
   * Propose a mutual settlement to avoid full juror fee forfeiture
   */
  async proposeSettlement(disputeId: string, splitPct: number): Promise<{ success: boolean }> {
    const { data } = await apiClient.post<{ success: boolean }>(`/disputes/${disputeId}/settle`, { splitPct });
    return data;
  },
};

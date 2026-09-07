import { Injectable } from '@nestjs/common';
import { ContractFormationSubService } from './contract-formation-sub.service.js';
import { ContractLifecycleSubService } from './contract-lifecycle-sub.service.js';
import { ContractQuerySubService } from './contract-query-sub.service.js';

@Injectable()
export class ContractsService {
  constructor(
    private readonly formationService: ContractFormationSubService,
    private readonly lifecycleService: ContractLifecycleSubService,
    private readonly queryService: ContractQuerySubService,
  ) {}

  /**
   * Retrieves or initializes default platform fee percentage.
   */
  async getPlatformFeePercentage(): Promise<number> {
    return this.formationService.getPlatformFeePercentage();
  }

  /**
   * Updates platform fee percentage (Admin only).
   */
  async updatePlatformFeePercentage(percentage: number) {
    return this.formationService.updatePlatformFeePercentage(percentage);
  }

  /**
   * Accepts a proposal, creates a contract or initiates SSLCommerz gateway.
   */
  async acceptProposal(clientId: string, proposalId: string) {
    return this.formationService.acceptProposal(clientId, proposalId);
  }

  /**
   * Handles SSLCommerz payment success webhook & contract creation.
   */
  async handlePaymentSuccess(payload: any) {
    return this.formationService.handlePaymentSuccess(payload);
  }

  /**
   * Freelancer submits completed work for review.
   */
  async submitWork(freelancerId: string, contractId: string) {
    return this.lifecycleService.submitWork(freelancerId, contractId);
  }

  /**
   * Client approves work, releasing net payout to Freelancer.
   */
  async approveWork(clientId: string, contractId: string) {
    return this.lifecycleService.approveWork(clientId, contractId);
  }

  /**
   * Flags a contract as DISPUTED.
   */
  async disputeContract(userId: string, contractId: string) {
    return this.lifecycleService.disputeContract(userId, contractId);
  }

  /**
   * Retrieves single contract detail.
   */
  async getContract(userId: string, contractId: string) {
    return this.queryService.getContract(userId, contractId);
  }

  /**
   * Retrieves list of user's active & past contracts.
   */
  async getUserContracts(userId: string) {
    return this.queryService.getUserContracts(userId);
  }
}

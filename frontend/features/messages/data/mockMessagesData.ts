import { WorkroomChannel, WorkroomMessage, WorkroomEscrowContext } from '../types/messageTypes';

export const INITIAL_CHANNELS: WorkroomChannel[] = [];
export const INITIAL_MESSAGES: WorkroomMessage[] = [];
export const ACTIVE_ESCROW_CONTEXT: WorkroomEscrowContext = {
  milestoneTitle: '',
  lockedAmount: 0,
  currency: 'BDT',
  releasedAmount: 0,
  remainingAmount: 0,
  slaGraceRemaining: 'N/A',
  artifacts: [],
};

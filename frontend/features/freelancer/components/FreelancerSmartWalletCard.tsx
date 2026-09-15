'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { walletApi } from '@/features/wallet/api/walletApi';
import { WithdrawalModal } from '@/features/wallet/components/WithdrawalModal';

export const FreelancerSmartWalletCard: React.FC = () => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(12500);

  useEffect(() => {
    walletApi.getWalletBalance().then((res) => {
      if (res?.walletBalance !== undefined) setWalletBalance(res.walletBalance);
    });
  }, []);

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
          <span className="text-base font-bold text-on-surface">Your Wallet</span>
        </div>
        <span className="text-xs text-primary font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Active
        </span>
      </div>

      {/* Balance Breakdown */}
      <div className="flex flex-col divide-y divide-outline-variant/10 text-xs">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary">
              ৳
            </div>
            <div>
              <div className="font-semibold text-on-surface">BDT Balance</div>
              <div className="text-[11px] text-on-surface-variant">Local payout currency</div>
            </div>
          </div>
          <div className="text-right ">
            <div className="font-bold text-on-surface text-sm">৳{walletBalance.toLocaleString()}</div>
            <div className="text-[10px] text-primary">Available</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-secondary">
              $
            </div>
            <div>
              <div className="font-semibold text-on-surface">USD Balance</div>
              <div className="text-[11px] text-on-surface-variant">Global contract earnings</div>
            </div>
          </div>
          <div className="text-right ">
            <div className="font-bold text-on-surface text-sm">$6,200.00</div>
            <div className="text-[10px] text-primary">Available</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => toast.info('Deposit options: Bank Transfer, bKash, or Card.')}
          className="py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">add</span>
          <span>Add Funds</span>
        </button>
        <button
          type="button"
          onClick={() => setIsWithdrawOpen(true)}
          className="py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">south_west</span>
          <span>Withdraw</span>
        </button>
      </div>

      <WithdrawalModal
        isOpen={isWithdrawOpen}
        walletBalance={walletBalance}
        onClose={() => setIsWithdrawOpen(false)}
        onSuccess={() => {
          walletApi.getWalletBalance().then((res) => {
            if (res?.walletBalance !== undefined) setWalletBalance(res.walletBalance);
          });
        }}
      />
    </div>
  );
};



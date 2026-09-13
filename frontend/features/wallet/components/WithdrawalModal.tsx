'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { walletApi, WithdrawalPayload } from '../api/walletApi';

interface WithdrawalModalProps {
  isOpen: boolean;
  walletBalance: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  walletBalance,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (numAmount < 500) {
      toast.error('Minimum withdrawal amount is 500 BDT.');
      return;
    }
    if (numAmount > walletBalance) {
      toast.error(`Insufficient balance. Maximum available is ৳${walletBalance.toLocaleString()} BDT.`);
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(accountNumber)) {
      toast.error('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: WithdrawalPayload = {
        amount: numAmount,
        method,
        accountNumber,
      };
      await walletApi.requestWithdrawal(payload);
      toast.success(`Withdrawal request for ৳${numAmount.toLocaleString()} BDT via ${method} submitted!`);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to submit withdrawal request.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
            <h3 className="text-base font-bold text-on-surface">Withdraw Funds</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
          <span className="text-on-surface-variant font-medium">Available Balance:</span>
          <span className="font-mono text-base font-bold text-primary">
            ৳{walletBalance.toLocaleString()} BDT
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface text-[11px] uppercase tracking-wider">
              Payout Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod('BKASH')}
                className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  method === 'BKASH'
                    ? 'bg-pink-600/10 border-pink-500 text-pink-500 shadow-sm'
                    : 'bg-surface-container border-outline-variant/20 text-on-surface-variant'
                }`}
              >
                <span>bKash</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('NAGAD')}
                className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                  method === 'NAGAD'
                    ? 'bg-orange-600/10 border-orange-500 text-orange-500 shadow-sm'
                    : 'bg-surface-container border-outline-variant/20 text-on-surface-variant'
                }`}
              >
                <span>Nagad</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface text-[11px] uppercase tracking-wider">
              {method} Account Number (11 Digits)
            </label>
            <input
              type="tel"
              required
              maxLength={11}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="017XXXXXXXX"
              className="bg-surface-container border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface text-[11px] uppercase tracking-wider">
              Withdrawal Amount (BDT, min. 500)
            </label>
            <input
              type="number"
              required
              min={500}
              max={walletBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-surface-container border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || walletBalance < 500}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

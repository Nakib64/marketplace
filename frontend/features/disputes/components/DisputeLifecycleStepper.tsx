import React from 'react';

interface DisputeLifecycleStepperProps {
  currentStep?: number;
}

export const DisputeLifecycleStepper: React.FC<DisputeLifecycleStepperProps> = ({ currentStep = 3 }) => {
  const steps = [
    { num: 1, title: '1. Dispute Raised', date: 'Oct 22', desc: 'Vault frozen; arbitration fees deposited.', isDone: true },
    { num: 2, title: '2. Evidence Period', date: 'Oct 23-25', desc: '3 cryptographic proofs pinned on IPFS.', isDone: true },
    { num: 3, title: '3. Juror Hidden Vote', date: 'Oct 26-28', desc: '3 drawn jurors commit salt-hashed ballots.', isActive: true },
    { num: 4, title: '4. Ruling & Settlement', date: 'Oct 29', desc: 'Ballot reveal & smart contract execution.', isPending: true },
  ];

  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">linear_scale</span>
          <h3 className="text-sm font-bold text-on-surface">Arbitration Protocol Lifecycle</h3>
        </div>
        <span className="font-mono text-xs text-on-surface-variant">Stage {currentStep} of 4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {steps.map((step) => {
          if (step.isActive) {
            return (
              <div key={step.num} className="bg-surface-container-high rounded-xl p-3.5 flex flex-col gap-2 border border-primary/40 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary font-bold text-xs font-mono">
                    {step.num}
                  </span>
                  <span className="font-mono text-primary font-medium text-[11px]">{step.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">{step.title}</span>
                  <span className="text-on-surface-variant text-[11px] mt-0.5 leading-tight">{step.desc}</span>
                </div>
                <div className="mt-auto pt-1 flex items-center gap-1.5 text-primary text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>Active (18h left)</span>
                </div>
              </div>
            );
          }

          if (step.isDone) {
            return (
              <div key={step.num} className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20 opacity-90">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-xs">
                    <span className="material-symbols-outlined text-[14px]">done</span>
                  </span>
                  <span className="font-mono text-on-surface-variant text-[11px]">{step.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">{step.title}</span>
                  <span className="text-on-surface-variant text-[11px] mt-0.5 leading-tight">{step.desc}</span>
                </div>
                <div className="mt-auto pt-1 flex items-center gap-1 text-primary text-[11px] font-mono">
                  <span className="material-symbols-outlined text-[13px]">check</span> Complete
                </div>
              </div>
            );
          }

          return (
            <div key={step.num} className="bg-surface-container-low/60 rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20 opacity-60">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-outline text-xs font-mono">
                  {step.num}
                </span>
                <span className="font-mono text-outline text-[11px]">{step.date}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-outline">{step.title}</span>
                <span className="text-outline text-[11px] mt-0.5 leading-tight">{step.desc}</span>
              </div>
              <div className="mt-auto pt-1 flex items-center gap-1 text-outline text-[11px] font-mono">
                <span className="material-symbols-outlined text-[13px]">schedule</span> Pending
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

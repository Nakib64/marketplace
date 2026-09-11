import React from 'react';
import { Check } from 'lucide-react';

interface PostJobStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

const STEPS = [
  { step: 1, title: 'Scope & Description', desc: 'Basics & Deliverables' },
  { step: 2, title: 'Skills & Seniority', desc: 'Tech Stack & Level' },
  { step: 3, title: 'Budget & Escrow', desc: 'Vault & Payout' },
];

export function PostJobStepper({ currentStep, onSelectStep }: PostJobStepperProps) {
  return (
    <div className="w-full bg-surface-container rounded-2xl p-3 sm:p-4 border border-outline-variant/30 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STEPS.map((s) => {
          const isCompleted = currentStep > s.step;
          const isActive = currentStep === s.step;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onSelectStep(s.step)}
              className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-surface-container-high border border-primary/40 shadow-sm'
                  : isCompleted
                  ? 'bg-surface-container-low/60 hover:bg-surface-container-low border border-transparent'
                  : 'bg-surface-container-low/30 opacity-60 hover:opacity-80 border border-transparent'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : isCompleted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.step}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">
                  {s.step}. {s.title}
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant truncate">
                  {isActive ? 'In Progress' : isCompleted ? 'Completed' : s.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

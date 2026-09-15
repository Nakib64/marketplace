import React from 'react';

export const ClientReputationCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-on-surface">Client Rating</h3>
        <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-surface-container p-3.5 flex flex-col gap-3 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Overall Satisfaction</span>
          <span className=" font-bold text-primary">98%</span>
        </div>
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '98%' }} />
        </div>
        <div className="flex flex-col gap-2 pt-1 text-xs text-on-surface-variant">
          <div className="flex items-center justify-between">
            <span>Payment Reliability</span>
            <span className=" text-on-surface font-semibold">5.0 / 5.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Avg. Approval Time</span>
            <span className=" text-primary font-medium">Under 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};


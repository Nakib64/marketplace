'use client';

import React from 'react';
import { Upload } from 'lucide-react';

interface PortfolioUploadDropzoneProps {
  isDropzoneActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}

export const PortfolioUploadDropzone: React.FC<PortfolioUploadDropzoneProps> = ({
  isDropzoneActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`py-12 px-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
        isDropzoneActive
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : 'border-outline-variant/50 hover:border-primary/50 bg-surface-container-low'
      }`}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Upload className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-on-surface">Drag and drop project screenshots here</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mt-1">
        Upload PNG, JPG, or WEBP files. You can upload multiple files at once.
      </p>
      <span className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-xs font-semibold text-primary">
        Browse Files from Computer
      </span>
    </div>
  );
};

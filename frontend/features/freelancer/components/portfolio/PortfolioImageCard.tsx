'use client';

import React from 'react';
import { GripVertical, Star, ChevronLeft, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { PortfolioImageItem } from '../../schemas/portfolioSchema';

interface PortfolioImageCardProps {
  item: PortfolioImageItem;
  index: number;
  totalImages: number;
  isBeingDragged: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onMove: (index: number, direction: 'left' | 'right') => void;
  onSetCover: (index: number) => void;
  onRemove: (id: string) => void;
  onSubtitleChange: (id: string, text: string) => void;
}

export const PortfolioImageCard: React.FC<PortfolioImageCardProps> = ({
  item,
  index,
  totalImages,
  isBeingDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMove,
  onSetCover,
  onRemove,
  onSubtitleChange,
}) => {
  const isCover = index === 0;

  return (
    <div
      draggable={!item.isUploading}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`group relative bg-surface-container-low rounded-xl border p-3 flex flex-col gap-2.5 transition-all select-none ${
        isCover ? 'border-primary/60 shadow-md ring-1 ring-primary/30' : 'border-outline-variant/30 hover:border-outline-variant/70'
      } ${isBeingDragged ? 'opacity-40 scale-95' : ''} ${isDragOver && !isBeingDragged ? 'border-primary ring-2 ring-primary/50 scale-[1.02]' : ''}`}
    >
      <div className="flex items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded cursor-grab active:cursor-grabbing text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high" title="Drag to reorder">
            <GripVertical className="w-4 h-4" />
          </div>
          {isCover ? (
            <span className="inline-flex items-center gap-1 bg-primary text-on-primary font-bold px-2 py-0.5 rounded-md text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>#1 Cover</span>
            </span>
          ) : (
            <span className="bg-surface-container-high text-on-surface-variant font-semibold px-2 py-0.5 rounded-md text-[11px]">
              #{index + 1}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button type="button" disabled={index === 0} onClick={() => onMove(index, 'left')} className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant disabled:opacity-20 cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" disabled={index === totalImages - 1} onClick={() => onMove(index, 'right')} className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant disabled:opacity-20 cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => onRemove(item.id)} className="p-1 rounded text-error/70 hover:text-error hover:bg-error/10 transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-36 bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant/20 flex items-center justify-center">
        {item.isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-[10px] text-on-surface-variant">Uploading...</span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
            {!isCover && (
              <button type="button" onClick={() => onSetCover(index)} className="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur-xs text-on-surface hover:text-primary hover:border-primary border border-outline-variant/40 rounded-md px-2 py-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md cursor-pointer">
                <Star className="w-3 h-3 text-primary" />
                <span>Set as Cover</span>
              </button>
            )}
          </>
        )}
      </div>

      <input
        type="text"
        value={item.subtitle || ''}
        onChange={(e) => onSubtitleChange(item.id, e.target.value)}
        placeholder={`Caption (e.g. ${isCover ? 'Main Dashboard UI' : 'Checkout Flow'})`}
        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
      />
    </div>
  );
};

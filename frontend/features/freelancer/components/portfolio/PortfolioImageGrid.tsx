'use client';

import React, { useState, useRef } from 'react';
import { Upload, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PortfolioImageItem } from '../../schemas/portfolioSchema';
import { PortfolioImageCard } from './PortfolioImageCard';
import { PortfolioUploadDropzone } from './PortfolioUploadDropzone';

interface PortfolioImageGridProps {
  images: PortfolioImageItem[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onMove: (index: number, direction: 'left' | 'right') => void;
  onSetCover: (index: number) => void;
  onRemove: (id: string) => void;
  onSubtitleChange: (id: string, text: string) => void;
  onUploadFiles: (files: FileList | File[]) => void;
  onAddDirectUrl: (url: string) => void;
}

export const PortfolioImageGrid: React.FC<PortfolioImageGridProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    props.onAddDirectUrl(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Showcase Media &amp; Screenshots</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-container-high text-primary border border-primary/20">
              {props.images.length}/7 Images
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Drag cards to arrange sequence. The <strong>#1 Cover Image</strong> is featured on your profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="text-xs text-on-surface-variant hover:text-on-surface underline font-medium cursor-pointer">
            {showUrlInput ? 'Hide URL' : '+ Add via URL'}
          </button>
          <Button type="button" variant="outline" size="sm" disabled={props.images.length >= 7} onClick={() => fileInputRef.current?.click()} className="border-outline-variant/40 bg-surface-container-high text-on-surface hover:bg-surface-container-highest cursor-pointer">
            <Upload className="w-3.5 h-3.5 mr-1 text-primary" />
            <span>Upload Images</span>
          </Button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => { if (e.target.files) props.onUploadFiles(e.target.files); e.target.value = ''; }} />
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://images.unsplash.com/... or CDN link" className="flex-1 bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary" />
          <Button type="button" variant="primary" size="sm" onClick={handleAddUrl}>Add</Button>
        </div>
      )}

      {props.images.length === 0 ? (
        <PortfolioUploadDropzone
          isDropzoneActive={isDropzoneActive}
          onDragOver={(e) => { e.preventDefault(); setIsDropzoneActive(true); }}
          onDragLeave={() => setIsDropzoneActive(false)}
          onDrop={(e) => { e.preventDefault(); setIsDropzoneActive(false); if (e.dataTransfer.files?.length) props.onUploadFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.images.map((item, index) => (
              <PortfolioImageCard key={item.id} item={item} index={index} totalImages={props.images.length} isBeingDragged={props.draggedIndex === index} isDragOver={props.dragOverIndex === index} {...props} />
            ))}
            {props.images.length < 7 && (
              <div onClick={() => fileInputRef.current?.click()} className="h-[238px] rounded-xl border-2 border-dashed border-outline-variant/40 hover:border-primary/50 bg-surface-container-low/50 hover:bg-surface-container-low flex flex-col items-center justify-center text-center cursor-pointer transition-colors p-4 gap-2 text-on-surface-variant hover:text-primary">
                <Plus className="w-6 h-6" />
                <span className="text-xs font-bold">+ Add Another Screenshot</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>Reordering works with mouse drag-and-drop or the arrow buttons. Position #1 is the cover card thumbnail.</span>
          </div>
        </div>
      )}
    </div>
  );
};

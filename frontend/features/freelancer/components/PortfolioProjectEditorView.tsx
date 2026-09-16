'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { usePortfolioProject } from '../hooks/usePortfolioProject';
import { useImageDragReorder } from '../hooks/useImageDragReorder';
import { PortfolioEditorHeader } from './portfolio/PortfolioEditorHeader';
import { PortfolioImageGrid } from './portfolio/PortfolioImageGrid';
import { PortfolioDetailsForm } from './portfolio/PortfolioDetailsForm';
import { PortfolioClientPreview } from './portfolio/PortfolioClientPreview';

interface PortfolioProjectEditorViewProps {
  portfolioItemId?: string;
}

export const PortfolioProjectEditorView: React.FC<PortfolioProjectEditorViewProps> = ({
  portfolioItemId,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const { form, images, setImages, isLoading, isSubmitting, isDeleting, onSubmit, handleDelete } =
    usePortfolioProject(portfolioItemId);

  const dragReorder = useImageDragReorder(images, setImages);
  const titleValue = useWatch({ control: form.control, name: 'title' }) || '';
  const detailsValue = useWatch({ control: form.control, name: 'details' }) || '';
  const liveLinkValue = useWatch({ control: form.control, name: 'liveLink' }) || '';

  const handleAddDirectUrl = (url: string) => {
    if (images.length >= 7) return;
    setImages((prev) => [...prev, { id: `url-${Date.now()}`, imageUrl: url, subtitle: '' }]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-on-surface-variant font-medium">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen py-8 text-on-surface">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <PortfolioEditorHeader
          portfolioItemId={portfolioItemId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
        />

        {activeTab === 'edit' ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <PortfolioImageGrid
              images={images}
              draggedIndex={dragReorder.draggedIndex}
              dragOverIndex={dragReorder.dragOverIndex}
              onDragStart={dragReorder.onDragStart}
              onDragOver={dragReorder.onDragOver}
              onDragLeave={dragReorder.onDragLeave}
              onDrop={dragReorder.onDrop}
              onDragEnd={dragReorder.onDragEnd}
              onMove={dragReorder.moveImage}
              onSetCover={dragReorder.setAsCover}
              onRemove={dragReorder.removeImage}
              onSubtitleChange={dragReorder.updateSubtitle}
              onUploadFiles={dragReorder.uploadFiles}
              onAddDirectUrl={handleAddDirectUrl}
            />

            <PortfolioDetailsForm form={form} />

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/freelancer/profile/edit"
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface transition-colors"
              >
                Cancel &amp; Discard
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || images.some((i) => i.isUploading)}
                className="font-bold px-6 shadow-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <span>{portfolioItemId ? 'Update Project Showcase' : 'Publish Project Showcase'}</span>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <PortfolioClientPreview
            title={titleValue}
            details={detailsValue}
            liveLink={liveLinkValue}
            images={images}
            onReturnToEditor={() => setActiveTab('edit')}
          />
        )}
      </div>
    </div>
  );
};

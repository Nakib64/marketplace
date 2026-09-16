import { useState } from 'react';
import { toast } from 'sonner';
import { PortfolioImageItem } from '../schemas/portfolioSchema';
import { freelancerApi } from '../api/freelancerApi';

export function useImageDragReorder(
  images: PortfolioImageItem[],
  setImages: (updateFn: (prev: PortfolioImageItem[]) => PortfolioImageItem[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [cover] = copy.splice(index, 1);
      copy.unshift(cover);
      return copy;
    });
    toast.success('Selected image set as primary cover!');
  };

  const onDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(draggedIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
    setDraggedIndex(null);
    setDragOverIndex(null);
    toast.success('Image sequence updated!');
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;
    if (images.length + fileArray.length > 7) {
      toast.error('You can attach a maximum of 7 images per portfolio project.');
      return;
    }
    const placeholders = fileArray.map((f, i) => ({
      id: `temp-${Date.now()}-${i}`,
      imageUrl: URL.createObjectURL(f),
      subtitle: '',
      isUploading: true,
    }));
    setImages((prev) => [...prev, ...placeholders]);

    for (let i = 0; i < fileArray.length; i++) {
      try {
        const res = await freelancerApi.uploadImage(fileArray[i], 'portfolio');
        const url = res.url.startsWith('http') ? res.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${res.url}`;
        setImages((curr) => curr.map((it) => (it.id === placeholders[i].id ? { ...it, imageUrl: url, isUploading: false } : it)));
      } catch {
        toast.error(`Failed to upload "${fileArray[i].name}"`);
        setImages((curr) => curr.filter((it) => it.id !== placeholders[i].id));
      }
    }
  };

  return {
    draggedIndex,
    dragOverIndex,
    moveImage,
    setAsCover,
    removeImage: (id: string) => setImages((prev) => prev.filter((img) => img.id !== id)),
    updateSubtitle: (id: string, subtitle: string) =>
      setImages((prev) => prev.map((img) => (img.id === id ? { ...img, subtitle } : img))),
    onDragStart: (e: React.DragEvent, i: number) => { setDraggedIndex(i); e.dataTransfer.effectAllowed = 'move'; },
    onDragOver: (e: React.DragEvent, i: number) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOverIndex !== i) setDragOverIndex(i); },
    onDragLeave: () => setDragOverIndex(null),
    onDrop,
    onDragEnd: () => { setDraggedIndex(null); setDragOverIndex(null); },
    uploadFiles,
  };
}

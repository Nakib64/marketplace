import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { portfolioFormSchema, PortfolioFormData, PortfolioImageItem } from '../schemas/portfolioSchema';
import { freelancerApi } from '../api/freelancerApi';

export function usePortfolioProject(portfolioItemId?: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(portfolioItemId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [images, setImages] = useState<PortfolioImageItem[]>([]);

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: '',
      details: '',
      liveLink: '',
    },
  });

  useEffect(() => {
    if (!portfolioItemId) return;
    setIsLoading(true);
    freelancerApi
      .getPortfolioItem(portfolioItemId)
      .then((item) => {
        form.reset({
          title: item.title || '',
          details: item.details || item.description || '',
          liveLink: item.liveLink || item.projectUrl || '',
        });
        if (item.images?.length) {
          setImages(
            item.images.map((img, idx) => ({
              id: img.id || `img-${idx}-${Date.now()}`,
              imageUrl: img.imageUrl,
              subtitle: img.subtitle || '',
            }))
          );
        }
      })
      .catch(() => {
        toast.error('Failed to load portfolio project.');
        router.push('/freelancer/profile/edit');
      })
      .finally(() => setIsLoading(false));
  }, [portfolioItemId, form, router]);

  const onSubmit = form.handleSubmit(async (data: PortfolioFormData) => {
    if (images.some((img) => img.isUploading)) {
      toast.error('Please wait for all images to finish uploading.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payloadImages = images.map((img) => ({
        imageUrl: img.imageUrl,
        subtitle: img.subtitle?.trim() || undefined,
      }));
      const payload = {
        title: data.title.trim(),
        details: data.details.trim(),
        liveLink: data.liveLink?.trim() || undefined,
        images: payloadImages,
      };

      if (portfolioItemId) {
        await freelancerApi.updatePortfolioItem(portfolioItemId, payload);
        toast.success('Portfolio project updated successfully!');
      } else {
        await freelancerApi.addPortfolioItem(payload);
        toast.success('Portfolio project published successfully!');
      }
      router.push('/freelancer/profile/edit');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save portfolio project.');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleDelete = async () => {
    if (!portfolioItemId) return;
    if (!confirm('Are you sure you want to permanently delete this portfolio project?')) return;
    setIsDeleting(true);
    try {
      await freelancerApi.deletePortfolioItem(portfolioItemId);
      toast.success('Portfolio project deleted.');
      router.push('/freelancer/profile/edit');
    } catch {
      toast.error('Failed to delete portfolio project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return { form, images, setImages, isLoading, isSubmitting, isDeleting, onSubmit, handleDelete };
}

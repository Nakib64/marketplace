'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  Loader2,
  X,
  Edit2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { freelancerApi } from '../api/freelancerApi';
import { Certificate } from '@/features/talent/types/talentTypes';

interface ProfileCertificatesSectionProps {
  certificates: Certificate[];
  onRefresh: () => void;
}

export const ProfileCertificatesSection: React.FC<ProfileCertificatesSectionProps> = ({
  certificates = [],
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setIssuer('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setCredentialUrl('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingItem(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '');
    setCredentialUrl(cert.credentialUrl || '');
    setImageUrl(cert.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await freelancerApi.uploadImage(file, 'certificates');
      const fullUrl = res.url.startsWith('http')
        ? res.url
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${res.url}`;
      setImageUrl(fullUrl);
      toast.success('Certificate image uploaded!');
    } catch {
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || !issueDate) {
      toast.error('Please provide certificate title, issuing organization, and date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await freelancerApi.updateCertificate(editingItem.id, {
          title,
          issuer,
          issueDate: new Date(issueDate).toISOString(),
          credentialUrl: credentialUrl.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        });
        toast.success('Certificate updated successfully!');
      } else {
        await freelancerApi.addCertificate({
          title,
          issuer,
          issueDate: new Date(issueDate).toISOString(),
          credentialUrl: credentialUrl.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        });
        toast.success('Certificate added successfully!');
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Failed to save certificate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await freelancerApi.deleteCertificate(id);
      toast.success('Certificate deleted.');
      onRefresh();
    } catch {
      toast.error('Failed to delete certificate.');
    }
  };

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Certificates &amp; Credentials</h3>
            <p className="text-xs text-on-surface-variant">Upload badges, course completions, and verifiable licenses</p>
          </div>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" className="font-semibold">
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Certificate</span>
        </Button>
      </div>

      {certificates.length === 0 ? (
        <div className="py-8 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2">
          <Award className="w-8 h-8 text-on-surface-variant/40" />
          <h4 className="text-xs font-bold text-on-surface">No Certificates Added</h4>
          <p className="text-[11px] text-on-surface-variant max-w-sm">
            Adding verified certifications and credentials increases your profile strength by 10%.
          </p>
          <Button onClick={openAddModal} variant="secondary" size="sm" className="mt-2">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Certificate</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert) => {
            const formattedDate = cert.issueDate
              ? new Date(cert.issueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              : 'Issued';

            return (
              <div
                key={cert.id}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex items-start justify-between gap-3 group hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {cert.imageUrl ? (
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                      <Award className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-on-surface truncate">{cert.title}</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate">
                      {cert.issuer}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-outline">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-0.5 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Verify</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(cert)}
                    aria-label="Edit certificate"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cert.id)}
                    aria-label="Delete certificate"
                    className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container rounded-2xl p-6 border border-outline-variant/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface">
                {editingItem ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Certificate Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, Meta, Coursera"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Credential / Verification Link (Optional)
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Badge/Image Upload & URL input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant">
                  Certificate Image or Badge (Optional)
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or upload badge"
                    className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/40 text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-4 h-4 text-primary" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageUrl && (
                  <div className="w-24 h-24 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Badge Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Update Certificate' : 'Add Certificate'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

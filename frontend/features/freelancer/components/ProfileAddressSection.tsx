'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { freelancerApi } from '../api/freelancerApi';

interface ProfileAddressSectionProps {
  initialCountry?: string | null;
  initialCity?: string | null;
  initialAddress?: string | null;
  onSaved?: () => void;
}

export const ProfileAddressSection: React.FC<ProfileAddressSectionProps> = ({
  initialCountry = 'Bangladesh',
  initialCity = '',
  initialAddress = '',
  onSaved,
}) => {
  const [country, setCountry] = useState(initialCountry || 'Bangladesh');
  const [city, setCity] = useState(initialCity || '');
  const [address, setAddress] = useState(initialAddress || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialCountry) setCountry(initialCountry);
    if (initialCity) setCity(initialCity);
    if (initialAddress) setAddress(initialAddress);
  }, [initialCountry, initialCity, initialAddress]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await freelancerApi.updateFreelancerProfile({
        country,
        city,
        address,
      });
      toast.success('Address & Location updated successfully!');
      onSaved?.();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Failed to update address.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Address &amp; Location</h3>
            <p className="text-xs text-on-surface-variant">Your geographical zone displayed on your public dossier</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Bangladesh"
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">City / Region</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Dhaka"
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">District / Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Banani, Road 11"
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </div>

        <div className="md:col-span-3 flex justify-end pt-2">
          <Button type="submit" variant="primary" size="sm" disabled={isSaving} className="font-semibold">
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                <span>Saving Location...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                <span>Save Location</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

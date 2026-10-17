'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminApi';
import { AdminUserProfileDossier } from '@/types/adminTypes';
import {
  User,
  Building,
  Briefcase,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  Save,
  Trash2,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  userId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserProfileDossierModal({ userId, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'ACCOUNT' | 'CLIENT' | 'FREELANCER'>('ACCOUNT');

  // Account state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'FREELANCER' | 'ADMIN'>('CLIENT');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [newPassword, setNewPassword] = useState('');

  // Client profile state
  const [companyName, setCompanyName] = useState('');
  const [billingDetails, setBillingDetails] = useState('');
  const [totalJobPosts, setTotalJobPosts] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [clientRating, setClientRating] = useState<number>(5.0);
  const [clientTotalReviews, setClientTotalReviews] = useState<number>(0);

  // Freelancer profile state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [skillsString, setSkillsString] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);
  const [freelancerRating, setFreelancerRating] = useState<number>(5.0);
  const [freelancerTotalReviews, setFreelancerTotalReviews] = useState<number>(0);
  const [successRate, setSuccessRate] = useState<number>(100);

  const [isSaving, setIsSaving] = useState(false);

  const { data: dossier, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-user-dossier', userId],
    queryFn: () => (userId ? adminUsersApi.getUserDossier(userId) : null),
    enabled: !!userId,
  });

  useEffect(() => {
    if (dossier) {
      // Account
      setEmail(dossier.email || '');
      setRole(dossier.role || 'CLIENT');
      setIsEmailVerified(dossier.isEmailVerified || false);
      setIsBanned(dossier.isBanned || false);
      setWalletBalance(Number(dossier.walletBalance) || 0);
      setNewPassword('');

      // Client profile
      if (dossier.clientProfile) {
        setCompanyName(dossier.clientProfile.companyName || '');
        setBillingDetails(dossier.clientProfile.billingDetails || '');
        setTotalJobPosts(Number(dossier.clientProfile.totalJobPosts) || 0);
        setTotalSpent(Number(dossier.clientProfile.totalSpent) || 0);
        setClientRating(Number(dossier.clientProfile.rating) || 0);
        setClientTotalReviews(Number(dossier.clientProfile.totalReviews) || 0);
      }

      // Freelancer profile
      if (dossier.freelancerProfile) {
        setTitle(dossier.freelancerProfile.title || '');
        setDescription(dossier.freelancerProfile.description || '');
        setHourlyRate(Number(dossier.freelancerProfile.hourlyRate) || 0);
        setSkillsString(dossier.freelancerProfile.skills ? dossier.freelancerProfile.skills.join(', ') : '');
        setCountry(dossier.freelancerProfile.country || 'Bangladesh');
        setCity(dossier.freelancerProfile.city || '');
        setAddress(dossier.freelancerProfile.address || '');
        setTotalProjects(Number(dossier.freelancerProfile.totalProjects) || 0);
        setEarnings(Number(dossier.freelancerProfile.earnings) || 0);
        setFreelancerRating(Number(dossier.freelancerProfile.rating) || 0);
        setFreelancerTotalReviews(Number(dossier.freelancerProfile.totalReviews) || 0);
        setSuccessRate(Number(dossier.freelancerProfile.successRate) || 100);
      }

      if (dossier.role === 'FREELANCER') {
        setActiveTab('FREELANCER');
      } else if (dossier.role === 'CLIENT') {
        setActiveTab('CLIENT');
      } else {
        setActiveTab('ACCOUNT');
      }
    }
  }, [dossier]);

  if (!userId) return null;

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminUsersApi.updateUser(userId, {
        email: email.trim(),
        role,
        isEmailVerified,
        isBanned,
        walletBalance: Number(walletBalance),
        password: newPassword.trim() || undefined,
      });
      toast.success('Account credentials and settings updated.');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update account.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClientProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminUsersApi.updateClientProfile(userId, {
        companyName: companyName.trim() || undefined,
        billingDetails: billingDetails.trim() || undefined,
        totalJobPosts: Number(totalJobPosts),
        totalSpent: Number(totalSpent),
        rating: Number(clientRating),
        totalReviews: Number(clientTotalReviews),
      });
      toast.success('Client profile records updated.');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update client profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFreelancerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skillsArray = skillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await adminUsersApi.updateFreelancerProfile(userId, {
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        hourlyRate: Number(hourlyRate),
        skills: skillsArray,
        country: country.trim() || undefined,
        city: city.trim() || undefined,
        address: address.trim() || undefined,
        totalProjects: Number(totalProjects),
        earnings: Number(earnings),
        rating: Number(freelancerRating),
        totalReviews: Number(freelancerTotalReviews),
        successRate: Number(successRate),
      });
      toast.success('Freelancer profile dossier updated.');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update freelancer profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    const reason = prompt(`Type "DELETE" to permanently erase user ${email}:`);
    if (reason !== 'DELETE') return;

    setIsSaving(true);
    try {
      await adminUsersApi.deleteUser(userId, 'Account deleted via Admin Dossier');
      toast.success('User account permanently removed.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-outline-variant p-5 pb-4 shrink-0 bg-[#f9faf9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf5ea] text-primary flex items-center justify-center font-bold text-sm">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface line-clamp-1">
                  {email || 'User Dossier'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface">
                  {role}
                </span>
                {isBanned && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-[11px] text-outline mt-0.5">ID: {userId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-outline-variant bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ACCOUNT')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'ACCOUNT'
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Account Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CLIENT')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'CLIENT'
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Client Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FREELANCER')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'FREELANCER'
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Freelancer Profile</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <span className="text-xs text-outline font-medium">Fetching complete dossier from database...</span>
            </div>
          ) : isError ? (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs text-center border border-red-200">
              Failed to load user profile dossier.
            </div>
          ) : (
            <>
              {/* TAB 1: ACCOUNT CONTROLS */}
              {activeTab === 'ACCOUNT' && (
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Platform Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="CLIENT">CLIENT (Buyer / Recruiter)</option>
                        <option value="FREELANCER">FREELANCER (Talent)</option>
                        <option value="ADMIN">ADMIN (Staff)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Wallet Balance (৳ BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={walletBalance}
                        onChange={(e) => setWalletBalance(Number(e.target.value))}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold text-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Set New Password Override (Leave blank to keep)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f9faf9] border border-outline-variant/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-on-surface block">Email Verification Status</span>
                        <span className="text-[11px] text-outline">Bypasses registration code verification requirement</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isEmailVerified}
                        onChange={(e) => setIsEmailVerified(e.target.checked)}
                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/60">
                      <div>
                        <span className="text-xs font-bold text-red-600 block">Account Suspension (Ban)</span>
                        <span className="text-[11px] text-outline">Revokes session and restricts login capability</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isBanned}
                        onChange={(e) => setIsBanned(e.target.checked)}
                        className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      disabled={isSaving}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete User Account</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-[#108a00] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Account Settings</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: CLIENT PROFILE */}
              {activeTab === 'CLIENT' && (
                <form onSubmit={handleSaveClientProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Company Name / Brand
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corp Bangladesh"
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Billing Details / Tax ID
                      </label>
                      <input
                        type="text"
                        value={billingDetails}
                        onChange={(e) => setBillingDetails(e.target.value)}
                        placeholder="e.g. BIN: 123456789, Dhaka"
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Total Jobs Posted
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={totalJobPosts}
                        onChange={(e) => setTotalJobPosts(Number(e.target.value))}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Total Spent (৳ BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={totalSpent}
                        onChange={(e) => setTotalSpent(Number(e.target.value))}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold text-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Client Rating (0 - 5.0)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={clientRating}
                        onChange={(e) => setClientRating(Number(e.target.value))}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold text-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Total Reviews
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={clientTotalReviews}
                        onChange={(e) => setClientTotalReviews(Number(e.target.value))}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-outline-variant">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-[#108a00] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Client Profile</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: FREELANCER PROFILE */}
              {activeTab === 'FREELANCER' && (
                <form onSubmit={handleSaveFreelancerProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Fullstack Architect | NestJS & React"
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Hourly Rate (৳ BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      Skills (Comma separated list of tags)
                    </label>
                    <input
                      type="text"
                      value={skillsString}
                      onChange={(e) => setSkillsString(e.target.value)}
                      placeholder="e.g. TypeScript, React, NestJS, PostgreSQL, Redis"
                      className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Dhaka"
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1.5">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Gulshan, Dhaka 1212"
                        className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      Freelancer Bio / Overview
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed profile overview of past engineering experience, achievements, and technology stack..."
                      className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-[#f9faf9] rounded-xl border border-outline-variant/60">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-outline mb-1">
                        Projects Done
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={totalProjects}
                        onChange={(e) => setTotalProjects(Number(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 text-xs text-on-surface font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-outline mb-1">
                        Total Earnings (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={earnings}
                        onChange={(e) => setEarnings(Number(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 text-xs text-primary font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-outline mb-1">
                        Rating (★ 0-5)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={freelancerRating}
                        onChange={(e) => setFreelancerRating(Number(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 text-xs text-amber-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-outline mb-1">
                        Reviews
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={freelancerTotalReviews}
                        onChange={(e) => setFreelancerTotalReviews(Number(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 text-xs text-on-surface font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-outline mb-1">
                        Success Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={successRate}
                        onChange={(e) => setSuccessRate(Number(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-white px-2 py-1 text-xs text-primary font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-outline-variant">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-[#108a00] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Freelancer Profile</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

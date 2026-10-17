'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminSkillsApi } from '@/lib/api/adminApi';
import { Skill } from '@/types/adminTypes';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { SkillModal } from './SkillModal';
import { toast } from 'sonner';

interface Props {
  initialDomain?: string;
  domainTitle?: string;
}

export function SkillsManager({ initialDomain, domainTitle }: Props = {}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>(initialDomain || 'ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const { data: skills = [], isLoading, isError } = useQuery<Skill[]>({
    queryKey: ['admin-skills', search],
    queryFn: () => adminSkillsApi.getAll(search || undefined),
  });

  const handleOpenAdd = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (skill: Skill) => {
    if (!confirm(`Are you sure you want to delete skill tag "${skill.name}"?`)) {
      return;
    }
    try {
      await adminSkillsApi.delete(skill.id);
      toast.success(`Skill "${skill.name}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete skill.');
    }
  };

  // Extract unique groups
  const groups = Array.from(new Set(skills.map((s) => s.category).filter(Boolean))) as string[];

  const filteredSkills = skills.filter((s) => {
    if (selectedGroup !== 'ALL' && s.category !== selectedGroup) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-on-surface">
            {domainTitle ? `${domainTitle} Skills` : 'Skills Directory & Taxonomy'}
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage tags used across freelancer profiles, job requirements, and search matching.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Skill</span>
        </button>
      </div>

      {/* Search & Domain Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2.5 flex-1 bg-white p-2.5 rounded-xl border border-outline-variant shadow-xs">
          <Search className="h-4 w-4 text-outline shrink-0 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name or slug..."
            className="w-full text-xs text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-outline hover:text-on-surface mr-2 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {groups.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedGroup === 'ALL'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              All Domains
            </button>
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedGroup === group
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skills Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-on-surface-variant font-medium">Loading skills directory...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs">
          Failed to load skills. Please check your network or try refreshing.
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-outline-variant">
          <Tag className="h-10 w-10 text-outline mx-auto mb-3" />
          <h3 className="text-sm font-bold text-on-surface mb-1">No skills found</h3>
          <p className="text-xs text-on-surface-variant mb-4">
            {search ? 'No matching skills found.' : 'Get started by creating skills in the system.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-[#108a00] text-white text-xs font-bold cursor-pointer"
          >
            Create Skill
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-[#f9faf9] text-[11px] font-bold uppercase text-outline tracking-wider">
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Domain Group</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-xs">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        <span className="font-bold text-on-surface">{skill.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-outline font-medium">
                      {skill.slug}
                    </td>
                    <td className="py-3 px-4">
                      {skill.category ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-xs font-semibold text-on-surface">
                          {skill.category}
                        </span>
                      ) : (
                        <span className="text-outline italic text-[11px]">General</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {skill.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14a800] bg-[#eaf5ea] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface cursor-pointer transition-colors"
                          title="Edit Skill"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill)}
                          className="p-1.5 rounded-lg border border-outline-variant hover:bg-red-50 text-outline hover:text-red-600 cursor-pointer transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-outline-variant/60 bg-[#f9faf9] text-xs text-outline flex items-center justify-between">
            <span>Showing {filteredSkills.length} of {skills.length} skills</span>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        skill={selectedSkill}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-skills'] })}
      />
    </div>
  );
}

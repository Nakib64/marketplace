'use client';

import React, { useState, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { X, Plus, Sparkles, Search } from 'lucide-react';
import { CreateJobFormData } from '../schemas/createJobSchema';
import { jobsApi } from '../api/jobsApi';

interface PostJobSkillsStepProps {
  form: UseFormReturn<CreateJobFormData>;
}


const SENIORITY_LEVELS = [
  { level: 'Entry Level', range: '৳5,000 - ৳20,000', desc: 'Basic features, bug fixes, scripts' },
  { level: 'Intermediate', range: '৳20,000 - ৳60,000', desc: 'Full features, API integrations, testing' },
  { level: 'Expert / Senior', range: '৳60,000 - ৳200,000+', desc: 'Complex systems, architecture, leadership' },
];

export function PostJobSkillsStep({ form }: PostJobSkillsStepProps) {
  const { setValue, watch, formState: { errors } } = form;
  const currentSkills = watch('skills') || [];
  const selectedCategory = watch('category') || '';
  const selectedSubCategory = watch('subCategory') || '';
  
  const [inputSkill, setInputSkill] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedSeniority, setSelectedSeniority] = useState('Senior Specialist');

  // Query skills from backend filtered by selected category or subcategory
  const activeFilterTerm = selectedSubCategory || selectedCategory;

  const { data: remoteSkills } = useQuery({
    queryKey: ['skills', activeFilterTerm],
    queryFn: () => jobsApi.getSkills(activeFilterTerm ? { category: activeFilterTerm } : undefined),
    staleTime: 60000,
  });

  // Targeted suggestions directly from database
  const suggestedSkills = useMemo(() => {
    if (remoteSkills && remoteSkills.length > 0) {
      return remoteSkills.map((s) => s.name);
    }
    return [];
  }, [remoteSkills]);

  // Autocomplete filtered list when user types in the input
  const autocompleteSuggestions = useMemo(() => {
    if (!inputSkill.trim()) return [];
    const query = inputSkill.toLowerCase().trim();
    return suggestedSkills
      .filter((s) => s.toLowerCase().includes(query) && !currentSkills.includes(s))
      .slice(0, 5);
  }, [inputSkill, suggestedSkills, currentSkills]);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setValue('skills', [...currentSkills, trimmed], { shouldValidate: true });
      setInputSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-on-surface">2. Skills &amp; Seniority</h2>
        </div>
        <span className="text-xs text-on-surface-variant">Step 02 / 03</span>
      </div>

      {/* Required Skills Chips & Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Required Tech Stack Tags <span className="text-primary">*</span>
          </label>
          {selectedSubCategory && (
            <span className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-md font-medium">
              {selectedSubCategory}
            </span>
          )}
        </div>

        <div className="relative">
          <div className="p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-wrap items-center gap-2 min-h-[52px] focus-within:border-primary transition-colors">
            {currentSkills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface text-xs flex items-center gap-1.5 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1 flex-1 min-w-[150px]">
              <Search className="w-3.5 h-3.5 text-on-surface-variant/50 ml-1.5 shrink-0" />
              <input
                value={inputSkill}
                onChange={(e) => setInputSkill(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (autocompleteSuggestions.length > 0 && inputSkill.trim()) {
                      handleAddSkill(autocompleteSuggestions[0]);
                    } else {
                      handleAddSkill(inputSkill);
                    }
                  }
                }}
                placeholder="Search or type a skill..."
                className="bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none px-2 py-1 w-full"
              />
              {inputSkill && (
                <button
                  type="button"
                  onClick={() => handleAddSkill(inputSkill)}
                  className="p-1 rounded bg-primary text-on-primary hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isInputFocused && autocompleteSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container-high border border-outline-variant/40 rounded-xl shadow-xl z-20 overflow-hidden py-1">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                Matching Skills
              </div>
              {autocompleteSuggestions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddSkill(skill);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-on-surface hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{skill}</span>
                  <Plus className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          )}
        </div>

        {errors.skills && (
          <p className="text-xs text-error mt-0.5">{errors.skills.message}</p>
        )}

        {/* Dynamic Targeted Suggestions */}
        {suggestedSkills.filter((s) => !currentSkills.includes(s)).length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Recommended for {selectedSubCategory || selectedCategory || 'this project'}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {suggestedSkills
                .filter((s) => !currentSkills.includes(s))
                .slice(0, 10)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high hover:border-primary/50 text-on-surface-variant hover:text-primary text-xs border border-outline-variant/20 transition-all cursor-pointer flex items-center gap-1 group"
                  >
                    <Plus className="w-3 h-3 text-on-surface-variant/60 group-hover:text-primary group-hover:scale-110 transition-transform" />
                    <span>{s}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Target Seniority */}
      <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
        <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Target Engineer Seniority
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SENIORITY_LEVELS.map((item) => {
            const isSelected = selectedSeniority === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setSelectedSeniority(item.level)}
                className={`p-4 rounded-xl text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container-high border-2 border-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container-high/60 border border-outline-variant/30'
                }`}
              >
                <span className="text-xs font-bold text-on-surface">{item.level}</span>
                <span className="text-xs text-primary font-semibold">{item.range}</span>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


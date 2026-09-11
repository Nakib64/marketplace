'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X, Plus, Sparkles } from 'lucide-react';
import { CreateJobFormData } from '../schemas/createJobSchema';

interface PostJobSkillsStepProps {
  form: UseFormReturn<CreateJobFormData>;
}

const SUGGESTED_SKILLS = [
  'Rust',
  'Solidity',
  'Foundry',
  'Arbitrum',
  'Uniswap v3',
  'Yul',
  'Slither',
  'TypeScript',
  'Next.js',
];

const SENIORITY_LEVELS = [
  { level: 'Junior / Entry', range: '$2k - $5k', desc: 'Unit tests, scripts, bug fixes' },
  { level: 'Mid-Level', range: '$5k - $12k', desc: 'Full module implementation & integrations' },
  { level: 'Senior Specialist', range: '$12k - $35k+', desc: 'Complex architecture & formal verification' },
];

export function PostJobSkillsStep({ form }: PostJobSkillsStepProps) {
  const { setValue, watch, formState: { errors } } = form;
  const currentSkills = watch('skills') || [];
  const [inputSkill, setInputSkill] = useState('');
  const [selectedSeniority, setSelectedSeniority] = useState('Senior Specialist');

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
        <span className="text-xs font-mono text-on-surface-variant">Step 02 / 03</span>
      </div>

      {/* Required Skills Chips */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Required Tech Stack Tags <span className="text-primary">*</span>
        </label>
        <div className="p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-wrap items-center gap-2 min-h-[52px]">
          {currentSkills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface font-mono text-xs flex items-center gap-1.5 border border-outline-variant/30"
            >
              {s}
              <button
                type="button"
                onClick={() => handleRemoveSkill(s)}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <div className="flex items-center gap-1 flex-1 min-w-[140px]">
            <input
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(inputSkill);
                }
              }}
              placeholder="Type skill & press Enter..."
              className="bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant outline-none px-2 py-1 w-full"
            />
            {inputSkill && (
              <button
                type="button"
                onClick={() => handleAddSkill(inputSkill)}
                className="p-1 rounded bg-primary-container text-on-primary-container"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        {errors.skills && (
          <p className="text-xs text-error mt-0.5">{errors.skills.message}</p>
        )}

        {/* Suggested Quick Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-secondary" /> Suggestions:
          </span>
          {SUGGESTED_SKILLS.filter((s) => !currentSkills.includes(s)).slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleAddSkill(s)}
              className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-mono border border-outline-variant/20 transition-colors cursor-pointer"
            >
              + {s}
            </button>
          ))}
        </div>
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
                <span className="text-xs font-mono text-primary font-semibold">{item.range}</span>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

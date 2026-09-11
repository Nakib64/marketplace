'use client';

import React from 'react';
import { useTalentSearch } from '../hooks/useTalentSearch';
import { TalentSearchBar } from './TalentSearchBar';
import { TalentFilterSidebar } from './TalentFilterSidebar';
import { TalentFeedList } from './TalentFeedList';

export function TalentDirectoryView() {
  const {
    freelancers,
    total,
    page,
    totalPages,
    isLoading,
    currentParams,
    updateFilters,
    clearFilters,
  } = useTalentSearch();

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Top Omnisearch Bar */}
      <TalentSearchBar currentParams={currentParams} onSearch={updateFilters} />

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
        <TalentFilterSidebar
          currentParams={currentParams}
          onFilterChange={updateFilters}
          onReset={clearFilters}
        />

        <TalentFeedList
          freelancers={freelancers}
          total={total}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={(newPage) => updateFilters({ page: newPage })}
          onResetFilters={clearFilters}
        />
      </div>
    </div>
  );
}

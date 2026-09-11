import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { JobDetailsView } from '@/features/jobs/components/JobDetailsView';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  try {
    const job = await jobsApi.getJobDetails(jobId);
    return {
      title: `${job.title} | Banglance Marketplace`,
      description: job.description.slice(0, 155),
    };
  } catch {
    return {
      title: 'Job Posting | Banglance Marketplace',
      description: 'View verified escrow-protected job opportunities on Banglance.',
    };
  }
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { jobId } = await params;

  let job = null;
  try {
    job = await jobsApi.getJobDetails(jobId);
  } catch {
    job = null;
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant/30">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Job Not Found</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          The job listing you are looking for may have expired, been filled, or is temporarily unavailable.
        </p>
        <Link href="/jobs">
          <Button variant="primary" size="md">
            Browse Other Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return <JobDetailsView job={job} />;
}

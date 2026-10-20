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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banglance.saasfactry.com';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  try {
    const job = await jobsApi.getJobDetails(jobId);
    const cleanDesc = job.description?.slice(0, 160) || 'Verified freelance job opportunity on Banglance.';
    const jobUrl = `${siteUrl}/jobs/${job.slug || jobId}`;

    return {
      title: `${job.title} | Banglance Marketplace`,
      description: cleanDesc,
      alternates: {
        canonical: jobUrl,
      },
      openGraph: {
        title: `${job.title} | Banglance`,
        description: cleanDesc,
        url: jobUrl,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.title} | Banglance`,
        description: cleanDesc,
      },
    };
  } catch {
    return {
      title: 'Job Opportunity | Banglance Marketplace',
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
          The job listing you are looking for may have expired, been filled, or does not exist.
        </p>
        <Link href="/jobs">
          <Button variant="primary" size="md">
            Browse All Jobs
          </Button>
        </Link>
      </div>
    );
  }

  // Google JobPosting Structured Data for rich search snippets
  const postedDate = job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString();
  const validUntil = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: postedDate,
    validThrough: validUntil,
    employmentType: 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Banglance Verified Client',
      sameAs: siteUrl,
    },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'BDT',
      value: {
        '@type': 'QuantitativeValue',
        value: Number(job.budget || 0),
        unitText: 'PROJECT',
      },
    },
    directApply: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <JobDetailsView job={job} />
    </>
  );
}

import { MetadataRoute } from 'next';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { talentApi } from '@/features/talent/api/talentApi';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banglance.saasfactry.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // High-priority static marketing & discovery pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/freelancers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamically index open job postings
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const jobsRes = await jobsApi.searchJobs({ limit: 100 });
    if (jobsRes?.data && Array.isArray(jobsRes.data)) {
      jobRoutes = jobsRes.data.map((job) => ({
        url: `${siteUrl}/jobs/${job.slug || job.id}`,
        lastModified: job.updatedAt ? new Date(job.updatedAt) : now,
        changeFrequency: 'daily',
        priority: 0.8,
      }));
    }
  } catch {
    // Graceful fallback during offline build
  }

  // Dynamically index public talent profiles
  let talentRoutes: MetadataRoute.Sitemap = [];
  try {
    const talentRes = await talentApi.searchFreelancers({ limit: 100 });
    if (talentRes?.data && Array.isArray(talentRes.data)) {
      talentRoutes = talentRes.data.map((talent) => ({
        url: `${siteUrl}/freelancers/${talent.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch {
    // Graceful fallback during offline build
  }

  return [...staticRoutes, ...jobRoutes, ...talentRoutes];
}

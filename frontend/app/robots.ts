import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banglance.saasfactry.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/jobs',
          '/jobs/*',
          '/freelancers',
          '/freelancers/*',
          '/login',
          '/register',
        ],
        disallow: [
          '/client',
          '/client/*',
          '/freelancer',
          '/freelancer/*',
          '/messages',
          '/messages/*',
          '/wallet',
          '/wallet/*',
          '/contracts',
          '/contracts/*',
          '/disputes',
          '/disputes/*',
          '/settings',
          '/settings/*',
          '/transactions',
          '/transactions/*',
          '/jobs/*/apply',
          '/api/*',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

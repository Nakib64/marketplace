import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

import { Providers } from "@/components/providers/Providers";
import { AppShell } from "@/components/layout/AppShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banglance.saasfactry.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Banglance | Hire Talent & Find Freelance Work in Bangladesh',
    template: '%s | Banglance',
  },
  description:
    'Premier freelance marketplace in Bangladesh with 100% financial escrow payment protection, SSLCommerz gateway, and automated local mobile payouts via bKash and Nagad.',
  keywords: [
    'Banglance',
    'freelance marketplace Bangladesh',
    'hire developers Bangladesh',
    'freelance software engineers',
    'escrow payment protection',
    'bKash freelancer payout',
    'Nagad payout',
    'SSLCommerz freelance escrow',
    'web development bounties',
    'UI UX designer jobs',
    'remote talent marketplace',
  ],
  authors: [{ name: 'Banglance', url: siteUrl }],
  creator: 'Banglance',
  publisher: 'Banglance Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Banglance | Hire Talent & Find Freelance Work in Bangladesh',
    description:
      'Premier freelance marketplace in Bangladesh with 100% financial escrow payment protection and local mobile payouts.',
    url: siteUrl,
    siteName: 'Banglance',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banglance | Hire Talent & Find Freelance Work in Bangladesh',
    description:
      'Premier freelance marketplace in Bangladesh with 100% financial escrow payment protection and local mobile payouts.',
    creator: '@banglance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Banglance',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/opengraph-image`,
        },
        description:
          'Premier freelance marketplace with 100% financial escrow payment protection and local mobile payouts.',
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Banglance',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/jobs?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

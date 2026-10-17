import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AdminProviders } from '@/components/providers/AdminProviders';
import { AdminAppShell } from '@/components/layout/AdminAppShell';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Banglance | Admin Command Center',
  description: 'Operations, escrow mediation, payout authorizations, and risk controls.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <AdminProviders>
          <AdminAppShell>{children}</AdminAppShell>
        </AdminProviders>
      </body>
    </html>
  );
}

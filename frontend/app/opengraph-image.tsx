import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Banglance | Hire Talent & Find Freelance Work';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #070d18 0%, #0f172a 45%, #064e3b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            }}
          >
            B
          </div>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-1px',
            }}
          >
            Banglance
          </span>
          <span
            style={{
              marginLeft: '12px',
              fontSize: '15px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)',
            }}
          >
            100% Escrow Milestone Protection
          </span>
        </div>

        {/* Hero Value Proposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              maxWidth: '960px',
              letterSpacing: '-1.5px',
              margin: 0,
            }}
          >
            Hire Top Technical Talent & Find Verified Freelance Work
          </h1>
          <p
            style={{
              fontSize: '23px',
              color: '#94a3b8',
              maxWidth: '900px',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Direct contracts with guaranteed financial escrow protection and automated local mobile payouts via bKash & Nagad.
          </p>
        </div>

        {/* Feature Highlights Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            fontSize: '17px',
            fontWeight: 600,
            color: '#cbd5e1',
          }}
        >
          <span>✓ Escrow Guaranteed</span>
          <span>✓ Top 1% Verified Talent</span>
          <span>✓ SSLCommerz Gateway</span>
          <span>✓ Instant Mobile Payouts</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

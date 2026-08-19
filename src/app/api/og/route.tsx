import { ImageResponse } from 'next/og';

// Dynamic, branded Open Graph image generator.
// Usage: /api/og?title=...&subtitle=...&badge=...
// Returns a 1200×630 PNG used as og:image / twitter:image across SEO pages.

export const runtime = 'edge';

const WARM = 'linear-gradient(90deg, #ff8a5c, #ff6b9d 58%, #c74bb5)';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') || 'AI Infographic Generator').slice(
    0,
    110
  );
  const subtitle = (
    searchParams.get('subtitle') ||
    'Turn a sentence into a polished, animated infographic in seconds.'
  ).slice(0, 170);
  const badge = (searchParams.get('badge') || 'infogiph.com').slice(0, 40);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: '64px 72px',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      {/* top warm gradient bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 14,
          backgroundImage: WARM,
        }}
      />

      {/* brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundImage: WARM,
          }}
        />
        <div style={{ fontSize: 32, fontWeight: 700, color: '#0a0a0a' }}>
          Infogiph
        </div>
      </div>

      {/* headline block */}
      <div
        style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 800,
            color: '#0a0a0a',
            lineHeight: 1.05,
            letterSpacing: -1.5,
            maxWidth: 1010,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#525252',
            marginTop: 24,
            maxWidth: 930,
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* footer row: export formats + domain */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 44 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {['GIF', 'MP4', 'PNG'].map((f) => (
            <div
              key={f}
              style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 600,
                color: '#ffffff',
                backgroundImage: WARM,
                padding: '6px 18px',
                borderRadius: 9,
              }}
            >
              {f}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            marginLeft: 'auto',
            fontSize: 24,
            color: '#737373',
          }}
        >
          {badge}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}

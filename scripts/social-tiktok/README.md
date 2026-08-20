# TikTok campaign (infogiph account) — tooling & sources

Batch of 60 animated vertical (1080×1920) explainer clips with original
synthesized music, scheduled via Post Bridge to the **infogiph TikTok account
(Post Bridge id 85487)**, 2/day 2026-08-19 → 2026-09-18 at 15:00 & 23:00 UTC.

Everything here is a copy of the working session artifacts so the campaign can
be extended after scratchpads are wiped (that's how the first LinkedIn
campaign's concepts.json was lost).

## Files

- `concepts-ai.json` / `concepts-tech.json` — 60 concept definitions (28 AI +
  32 systems, `-tt` slugs). The dev-social API (`src/app/api/dev-social/route.ts`)
  reads these from a **hardcoded scratchpad path** (`OUT_ROOT`) — copy both
  files there (or update `OUT_ROOT`) before rendering.
- `items.json` — slug+title list consumed by the renderer.
- `render-tiktok.mjs` — patched copy of the social-campaign skill renderer:
  vertical stage is 540×832 (not 540×960) so ffmpeg pads ~128px top/bottom,
  keeping title/content out of TikTok's tab/caption overlay zones; supports
  `deviceScaleFactor` from config (1.5 = crisp text at ~10fps capture).
  **Run from the repo root** (resolves puppeteer-core from cwd), dev server on
  :3000, `--config campaign.tiktok.config.json --format vertical`.
- `campaign.tiktok.config.json` — session config (fix the itemsFile/workDir
  paths for a new session). Watermark is intentionally empty: the mux pass adds it.
- `gen-music.mjs` — synthesizes the 6 original lo-fi/synth WAV tracks
  (fully original, no licensing constraints). Deterministic (seeded).
- `mux-tiktok.mjs` — adds the prominent `infogiph.com` pill watermark
  (top-right, y=176, inside TikTok safe zones) + rotates the 6 music tracks,
  outputs `tiktok/final/*.mp4` (verifies audio stream + 3–300s duration).
- `captions.json` — TikTok captions per slug (hooks mirrored from the
  LinkedIn campaign on Neelesh Kumar).
- `build-posts.mjs` — builds `posts.json` (interleaved AI/tech order + UTC slots).
- `posts.json` — the final scheduled calendar (slug, time, caption).

## "iso" format — isometric cube staircase → animated GIF (2026-08-19)

A second visual format: numbered isometric cubes build up step by step, a
white logo cube drops on top, hold, fade, loop. Renderer page:
`src/app/[locale]/dev-iso/page.tsx` (`?show=<slug>&w=&h=&holdoff=ms`), fed by
`/api/dev-social?action=iso` which reads **`iso-concepts.json` from the same
hardcoded OUT_ROOT scratchpad** (canonical copy here — copy it over before
rendering).

Everything is editable per concept in `iso-concepts.json`:

```json
{
  "slug": "iso-openai-14",
  "heading": "14 lessons",          // big dark line (optional)
  "headingAccent": "from OpenAI",   // accent-colored line (optional)
  "logo": "openai",                 // top-cube icon: any icon-registry key
  "count": 14,                       // numbered cubes (01..NN auto)
  "columns": 5,                      // staircase base width
  "labels": ["…"],                  // optional custom face labels
  "accent": "#E2612E",              // face color (side/top/outline derived)
  "dots": true,                      // dotted paper background
  "stepSec": 0.16, "holdSec": 2.2    // timing overrides
}
```

Render (GIF encodes via two-pass palette, `-loop 0`; `gif` preset is
640×640 at deviceScaleFactor 1 so pixels are 1:1):

```bash
node scripts/social-tiktok/render-tiktok.mjs \
  --config scripts/social-tiktok/campaign.iso.config.json --format gif
```

The `holdoff` query param keeps the CSS animation paused at frame 0 until just
before the renderer's `settleMs` wait ends, so the captured loop starts at the
build-up. **Post Bridge does not accept GIF** (uploads normalize to a static
PNG) — these GIFs are for blogs/email/embeds; render `--format vertical` or
`square` against the same page for social video instead.

## Publish flow

Copy `tiktok/final/*.mp4` to `public/social/`, expose with
`cloudflared tunnel --url http://localhost:3000`, `upload_media` each URL via
Post Bridge (verify `content_type: video/mp4`), then `create_post` with
`social_accounts: [85487]`, the caption, `scheduled_at`, and
`platform_configurations.tiktok.video_cover_timestamp_ms: 6000`.
**Kill the tunnel and delete `public/social/` immediately after.**

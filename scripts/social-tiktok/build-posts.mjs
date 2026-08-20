// Builds tiktok/posts.json: 60 posts, AI/tech interleaved, 2/day for 30 days.
// Slot times chosen for US TikTok engagement: 15:00 UTC (11am ET lunch scroll)
// and 23:00 UTC (7pm ET evening prime).
import fs from 'fs';
import path from 'path';

const BASE = path.dirname(new URL(import.meta.url).pathname);
const OLD =
  '/private/tmp/claude-501/-Users-dinesh-Infogiph/f1e81643-0ec1-4c9b-9a8c-7da0b602b958/scratchpad';
const ai = JSON.parse(fs.readFileSync(path.join(OLD, 'concepts-ai.json'), 'utf8'));
const tech = JSON.parse(fs.readFileSync(path.join(OLD, 'concepts-tech.json'), 'utf8'));
const captions = JSON.parse(
  fs.readFileSync(path.join(BASE, 'tiktok', 'captions.json'), 'utf8')
);

// Interleave AI / tech so consecutive posts alternate themes.
const order = [];
for (let i = 0; i < Math.max(ai.length, tech.length); i++) {
  if (ai[i]) order.push(ai[i]);
  if (tech[i]) order.push(tech[i]);
}

// Slots: today 23:00 UTC, then 15:00 + 23:00 daily, until 60 slots exist.
const slots = [];
slots.push('2026-08-19T23:00:00Z');
for (let d = 0; slots.length < order.length; d++) {
  const day = new Date(Date.UTC(2026, 7, 20 + d)); // months 0-based: 7 = August
  const iso = day.toISOString().slice(0, 10);
  slots.push(`${iso}T15:00:00Z`);
  if (slots.length < order.length) slots.push(`${iso}T23:00:00Z`);
}

const posts = order.map((c, i) => {
  const caption = captions[c.slug];
  if (!caption) throw new Error(`missing caption for ${c.slug}`);
  return { n: i + 1, slug: c.slug, title: c.title, scheduled_at: slots[i], caption };
});

fs.writeFileSync(
  path.join(BASE, 'tiktok', 'posts.json'),
  JSON.stringify(posts, null, 2)
);
console.log(
  `${posts.length} posts, ${posts[0].scheduled_at} → ${posts[posts.length - 1].scheduled_at}`
);

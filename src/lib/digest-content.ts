import 'server-only';

import { allTemplates } from '@/lib/templates/catalog';
import { getBaseUrl } from '@/lib/urls/urls';

/**
 * Weekly-digest content, rotated deterministically from the ISO week number.
 * Everything derives from the template catalog + two curated lists below, so
 * the digest ships itself every week with no manual work — and the same week
 * key always produces the same email (safe to re-run the cron).
 */

/** "2026-W33" — ISO-8601 week of the given date (UTC). */
export function isoWeekKey(date: Date): string {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  // Shift to the Thursday of this week — its year is the ISO week-year.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Monotonic week index used to step the rotations. */
function weekIndex(date: Date): number {
  return Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
}

// Canvas layouts pitched as "formats", each with an expert when-to-use blurb.
const FORMATS: { name: string; blurb: string }[] = [
  {
    name: 'Orbit',
    blurb:
      'Satellites revolving around a hub. Use it when the parts are peers — tools in a stack, channels in a strategy — and the center is the thing they all serve.',
  },
  {
    name: 'Pipeline',
    blurb:
      'Steps in strict order, left to right. The format for anything with a before and after: onboarding, CI/CD, a sales process. If order matters, this is the shape.',
  },
  {
    name: 'Radial',
    blurb:
      'One idea, many consequences. Put the decision in the middle and let everything it touches fan out — the reader sees scope at a glance.',
  },
  {
    name: 'Funnel',
    blurb:
      'Wide top, narrow bottom, numbers shrinking stage by stage. The most honest format in marketing — it admits most people leave, and shows where.',
  },
  {
    name: 'Timeline',
    blurb:
      'Milestones on a line. Use it for roadmaps and retrospectives — and resist the urge to add more than seven points; a timeline is an argument, not a calendar.',
  },
  {
    name: 'Pyramid',
    blurb:
      'A ranking with a base. Foundations at the bottom, aspiration at the top. Works for skill ladders, brand hierarchies, and anything Maslow-shaped.',
  },
  {
    name: 'Cycle',
    blurb:
      'Steps that feed back into themselves. Habit loops, retention loops, review cycles — if the last step causes the first, a straight line is a lie.',
  },
  {
    name: 'Tree',
    blurb:
      'One root, branching decisions. Org charts and decision trees, but also content strategies: one pillar, many derivatives.',
  },
  {
    name: 'Quadrant',
    blurb:
      'Two axes, four boxes. The consultant classic for a reason: it forces a claim about trade-offs, and readers argue with placements — which is engagement.',
  },
  {
    name: 'Iceberg',
    blurb:
      "Visible tip, hidden mass. The format for 'what people see vs. what it took' — effort, infrastructure, or cost. Instantly legible, endlessly reusable.",
  },
];

// Rotating LinkedIn posting habits — one per week, practical over hypey.
const RECIPES: string[] = [
  'Post at the hour your audience starts work, not yours. A diagram that lands at 8:55am local gets the commute scroll.',
  'Write the first line for the person who will never expand the post. If the hook plus the moving diagram carries the idea, the expand is a bonus.',
  'End with a question about the diagram, not about the topic. "Which box would you remove?" out-performs "Thoughts?" because it gives commenters a first move.',
  "Repost your best diagram after 6-8 weeks with a new first line. Your audience doesn't remember it — and the ones who do are your fans anyway.",
  'One diagram, one claim. If you need two diagrams, you have two posts — and next week is covered.',
  'Reply to every comment in the first hour with something substantive. The algorithm reads fast replies as a conversation worth spreading.',
  'Turn your most-asked question at work into a diagram. If colleagues keep asking, strangers are searching.',
  'Portrait exports take up more phone screen in the feed. Same diagram, more pixels, more watch time.',
  "Name the boxes with your audience's words, not your internal jargon. 'Billing' beats 'Payments Service Layer' everywhere except your architecture review.",
  'Post the diagram of a mistake — the funnel that leaked, the pipeline that broke. Failure diagrams earn more trust than victory laps.',
  'Diagram how you do the thing you are known for. Your own workflow is the one post format nobody can copy.',
  'One diagram post a week for twelve weeks beats one lucky viral hit. The feed rewards the habit, and so do followers.',
];

export interface DigestContent {
  weekKey: string;
  subject: string;
  formatName: string;
  formatBlurb: string;
  formatUrl: string;
  picks: { title: string; description: string; url: string }[];
  recipe: string;
}

/**
 * Deterministic digest content for the given date's ISO week.
 * Template picks step through the catalog three at a time, so consecutive
 * weeks never repeat and the whole catalog cycles before any repeat.
 */
export function digestContentForWeek(now: Date): DigestContent {
  const base = getBaseUrl();
  const idx = weekIndex(now);

  const format = FORMATS[idx % FORMATS.length];
  const recipe = RECIPES[idx % RECIPES.length];

  const n = allTemplates.length;
  const picks = [0, 1, 2].map((i) => {
    const t = allTemplates[(idx * 3 + i) % n];
    return {
      title: t.title,
      description: t.shortDescription,
      url: `${base}/templates/${t.slug}`,
    };
  });

  return {
    weekKey: isoWeekKey(now),
    subject: `This week: the ${format.name} format + 3 templates worth stealing`,
    formatName: format.name,
    formatBlurb: format.blurb,
    formatUrl: `${base}/canvas`,
    picks,
    recipe,
  };
}

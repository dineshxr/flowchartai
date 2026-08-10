import { canUserUseAI, recordAIUsage } from '@/lib/ai-usage';
import { getSession } from '@/lib/server';
import {
  VISUAL_CATEGORIES,
  type VisualCategoryKey,
  type VisualDetail,
  type VisualIllustration,
  type VisualSuggestion,
  getVisualCategory,
  isTreeCategory,
} from '@/lib/text-to-visual';
import OpenAI from 'openai';

// Longer source texts than this add latency/cost without changing the visuals.
const MAX_TEXT_CHARS = 12_000;
const SUGGESTION_COUNT = 6;
const CATEGORY_VARIANTS = 3;

const CONCEPT_ICONS =
  'bot, database, storage, cloud, web, api, code, chat, drive, mobile, mail, search, process, automation, social, payment, analytics, security';
const GLYPH_ICONS =
  'brain3d, spark3d, rocket3d, chart3d, funnel3d, heart3d, dollar3d, users3d, flow3d, gear3d, bolt3d, globe3d, shield3d, box3d, truck3d, factory3d, store3d, cube3d, mega3d, bag3d, lock3d, terminal3d, cpu3d';

function iconGuidance(illustration: VisualIllustration): string {
  if (illustration === 'abstract') {
    return `icon: ONE lowercase key from this flat-glyph set only: ${CONCEPT_ICONS}. Keep labels conceptual — no product/brand names.`;
  }
  if (illustration === 'concrete') {
    return `icon: ONE lowercase key, preferring the vivid 3D set: ${GLYPH_ICONS} (fallback: ${CONCEPT_ICONS}). When the text names a real product (Stripe, Slack, GitHub, OpenAI…), use its EXACT official name as the label — real logos are rendered automatically for 600+ products when the label matches the official name.`;
  }
  return `icon: ONE lowercase key from ${CONCEPT_ICONS} or, when a node deserves emphasis, from the 3D set ${GLYPH_ICONS}.`;
}

function nodeCounts(detail: VisualDetail): {
  min: number;
  max: number;
  children: string;
} {
  if (detail === 'summary')
    return {
      min: 4,
      max: 5,
      children: 'Omit children entirely — headline points only.',
    };
  if (detail === 'detailed')
    return {
      min: 7,
      max: 9,
      children:
        'For tree categories give every satellite 2-3 children with the concrete specifics from the text.',
    };
  return {
    min: 5,
    max: 7,
    children: 'For tree categories give each satellite 1-3 children.',
  };
}

function buildSystemPrompt(params: {
  category?: VisualCategoryKey;
  illustration: VisualIllustration;
  detail: VisualDetail;
}): string {
  const { category, illustration, detail } = params;
  const counts = nodeCounts(detail);

  const catalog = VISUAL_CATEGORIES.map(
    (c) => `- ${c.key}: ${c.structure}`
  ).join('\n');

  const selection = category
    ? `Produce EXACTLY ${CATEGORY_VARIANTS} suggestions, ALL with category "${category}", each a genuinely different angle on the text (different emphasis, grouping or center).`
    : `Produce EXACTLY ${SUGGESTION_COUNT} suggestions, each in a DIFFERENT category chosen from the catalog — pick the ${SUGGESTION_COUNT} categories that fit this text best, ordered best-fit first.`;

  return `You are an expert information designer (in the style of Napkin AI). The user gives you a passage of prose. You extract its structure and propose visual diagrams of it.

CATEGORY CATALOG (category key: structure to extract)
${catalog}

TASK
${selection}

RULES FOR EVERY SUGGESTION
- Content must come FROM THE TEXT — concrete nouns, steps, numbers and names that appear in it. Never generic filler like "Point 1".
- title: a short human title for the visual (3-8 words).
- center.label: the core subject, 1-3 words, max 22 characters.
- satellites: between ${counts.min} and ${counts.max} nodes. Each label 1-3 words, max 22 characters, no duplicates.
- ${counts.children}
- children only exist for the tree categories (hierarchy, business-framework); never elsewhere.
- Ordered categories (process, timeline, narrative, cause-effect): satellites MUST be in sequence order.
- Paired categories (comparison, problems-solutions): satellites MUST be an even count, first half side A, second half side B, in matching order.
- shape: OPTIONAL, only for visual-metaphor — name the supported shape your metaphor maps to: one of "iceberg" | "steps" | "pyramid" | "funnel" | "cycle" (ladder/climb → steps, flywheel/engine → cycle, hidden depth → iceberg). Pick metaphors that fit these shapes; keep satellites to 5-6 for them.
- ${iconGuidance(illustration)}

Return STRICT minified JSON ONLY — no markdown, no code fences — exactly:
{"suggestions":[{"title":"string","category":"string","shape":"string (optional)","center":{"label":"string","icon":"string"},"satellites":[{"label":"string","icon":"string","children":[{"label":"string","icon":"string"}]}]}]}`;
}

const tidy = (s: unknown, max = 22) =>
  String(s ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

/** Validate + normalise one raw suggestion; null drops it. */
function sanitiseSuggestion(raw: any, index: number): VisualSuggestion | null {
  if (!raw || typeof raw !== 'object') return null;
  const category = getVisualCategory(String(raw.category ?? ''))?.key;
  if (!category) return null;

  const centerLabel = tidy(raw.center?.label, 22);
  if (!centerLabel) return null;

  const seen = new Set<string>();
  const tree = isTreeCategory(category);
  const satellites = (Array.isArray(raw.satellites) ? raw.satellites : [])
    .map((s: any) => ({
      label: tidy(s?.label),
      icon: tidy(s?.icon, 24).toLowerCase(),
      children: tree
        ? (Array.isArray(s?.children) ? s.children : [])
            .map((c: any) => ({
              label: tidy(c?.label),
              icon: tidy(c?.icon, 24).toLowerCase(),
            }))
            .filter((c: any) => c.label)
            .slice(0, 3)
        : undefined,
    }))
    .filter((s: any) => {
      const key = s.label.toLowerCase();
      if (!s.label || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 9);

  if (satellites.length < 3) return null;

  // Optional shape hint — whitelist against the category's variant set.
  const cat = getVisualCategory(category);
  const rawShape = tidy(raw.shape, 12).toLowerCase();
  const shape = cat?.variants.includes(rawShape as any)
    ? (rawShape as VisualSuggestion['shape'])
    : undefined;

  return {
    id: `sug-${index}-${category}`,
    title: tidy(raw.title, 60) || centerLabel,
    category,
    shape,
    center: {
      label: centerLabel,
      icon: tidy(raw.center?.icon, 24).toLowerCase(),
    },
    satellites,
  };
}

export async function POST(req: Request) {
  try {
    // The most expensive call in the app (long input, several variants per
    // request). It requires an account — previously an unauthenticated caller
    // skipped both the quota check and the usage record entirely.
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Please sign in to turn text into visuals.',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const usageCheck = await canUserUseAI(userId);
    if (!usageCheck.canUse) {
      return new Response(
        JSON.stringify({
          error: 'Usage limit exceeded',
          message:
            usageCheck.reason ??
            'You have reached your AI usage limit. Upgrade for more generations.',
          usageInfo: usageCheck,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const text = String(body?.text ?? '')
      .trim()
      .slice(0, MAX_TEXT_CHARS);
    if (text.length < 40) {
      return new Response(
        JSON.stringify({
          error: 'Text too short',
          message: 'Paste a longer passage (a paragraph or more).',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const category = getVisualCategory(String(body?.category ?? ''))?.key;
    const illustration: VisualIllustration = [
      'abstract',
      'auto',
      'concrete',
    ].includes(body?.illustration)
      ? body.illustration
      : 'auto';
    const detail: VisualDetail = ['summary', 'auto', 'detailed'].includes(
      body?.detail
    )
      ? body.detail
      : 'auto';

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'X-Title': 'Infogiph Text to Visuals',
      },
    });

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt({ category, illustration, detail }),
        },
        { role: 'user', content: `SOURCE TEXT:\n\n${text}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.45,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error('Model returned empty response');

    const extractJson = (content: string) => {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
      return match ? match[1].trim() : content.trim();
    };
    const parsed = JSON.parse(extractJson(rawContent));
    const rawList: any[] = Array.isArray(parsed?.suggestions)
      ? parsed.suggestions
      : Array.isArray(parsed)
        ? parsed
        : [];

    let suggestions = rawList
      .map((raw, i) => sanitiseSuggestion(raw, i))
      .filter((s): s is VisualSuggestion => s !== null);

    // Without a target category, keep one suggestion per category (best first).
    if (!category) {
      const seenCat = new Set<string>();
      suggestions = suggestions.filter((s) => {
        if (seenCat.has(s.category)) return false;
        seenCat.add(s.category);
        return true;
      });
    }

    if (suggestions.length === 0) {
      throw new Error('Could not extract visual structures from this text');
    }

    // Billed server-side, immediately after a successful model call.
    await recordAIUsage(userId, 'flowchart_generation', {
      tokensUsed: 0,
      model: 'google/gemini-2.5-flash',
      success: true,
      metadata: {
        mode: 'text_to_visual',
        category: category || 'auto',
        detail,
        illustration,
      },
    });

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Text-to-visual API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Generation failed',
        message: error.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

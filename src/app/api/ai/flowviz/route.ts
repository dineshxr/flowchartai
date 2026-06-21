import { canUserUseAI, recordAIUsage } from '@/lib/ai-usage';
import { getSession } from '@/lib/server';
import OpenAI from 'openai';

// Define the shape of the expected response
interface DiagramData {
  center: {
    label: string;
    icon: string;
  };
  satellites: Array<{
    label: string;
    icon: string;
  }>;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      const usageCheck = await canUserUseAI(userId);
      if (!usageCheck.canUse) {
        return new Response(
          JSON.stringify({
            error: 'Usage limit exceeded',
            message: `You have reached your AI usage limit. ${usageCheck.remainingUsage} of ${usageCheck.limit} requests remaining.`,
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const { topic, image } = await req.json();

    if (!topic && !image) {
      return new Response(
        JSON.stringify({ error: 'Topic or image is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'X-Title': 'FlowViz Architect',
      },
    });

    const systemPrompt = `You are an expert information designer. Turn the user's topic into a clean, uncluttered hub-and-spoke infographic: one central hub and its most important related components.

REQUIREMENTS
- Choose EXACTLY 5 to 7 satellites — never more than 7 — so the diagram stays readable and well spaced. Pick the most important, distinct components; no duplicates, no filler.
- center.label: the single core entity of the topic, 1-3 words.
- Each satellites[].label: 1-3 words, at most 20 characters. When one specific real product/tool is the obvious choice, use its brand name (e.g. Stripe, PostgreSQL, OpenAI, Slack, Shopify, GitHub, Notion, WhatsApp, Instagram) so its logo can be shown; otherwise use a short plain noun (Auth, Analytics, Payments, Search, Database).
- icon: ONE lowercase keyword describing the node, chosen ONLY from this set: bot, database, cloud, web, chat, drive, mobile, mail, search, process, automation, social, payment, analytics, security, api, code, storage. Pick the closest match.
- Order the satellites in a logical sequence (by flow or importance).

Return STRICT minified JSON ONLY — no markdown, no code fences, no commentary — exactly matching this shape:
{"center":{"label":"string","icon":"string"},"satellites":[{"label":"string","icon":"string"}]}`;

    // Build user message — multimodal if an image was provided
    const userContent: any[] = [];
    if (topic) {
      userContent.push({ type: 'text', text: `Topic: ${topic}` });
    }
    if (image) {
      userContent.push({
        type: 'text',
        text: topic
          ? 'Use the attached image as context for the diagram.'
          : 'Analyze this image and create a structural integration diagram based on what you see.',
      });
      userContent.push({ type: 'image_url', image_url: { url: image } });
    }

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: userContent.length === 1 ? userContent[0].text : userContent,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Model returned empty response');
    }

    // Try to parse out code blocks if the model wrapped the JSON
    const extractJson = (content: string) => {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
      return match ? match[1].trim() : content.trim();
    };

    const jsonString = extractJson(rawContent);
    const parsedData: DiagramData = JSON.parse(jsonString);

    // Defensive cleanup so the diagram always lays out cleanly: trim labels,
    // drop empties/dupes, and cap satellites at 7 (more than that overcrowds
    // the radial/hub layouts and overlaps in portrait frames).
    const tidy = (s: unknown) =>
      String(s ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 24);
    if (parsedData?.center) {
      parsedData.center.label = tidy(parsedData.center.label) || 'Core';
      parsedData.center.icon = tidy(parsedData.center.icon).toLowerCase();
    }
    if (Array.isArray(parsedData?.satellites)) {
      const seen = new Set<string>();
      parsedData.satellites = parsedData.satellites
        .map((s) => ({
          label: tidy(s?.label),
          icon: tidy(s?.icon).toLowerCase(),
        }))
        .filter((s) => {
          const key = s.label.toLowerCase();
          if (!s.label || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, 7);
    }

    // Record the usage securely if logged in
    if (userId) {
      await recordAIUsage(userId, 'flowchart_generation', {
        tokensUsed: 0,
        model: 'google/gemini-2.5-flash',
        success: true,
        metadata: { mode: 'flowviz' },
      });
    }

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('FlowViz API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Generation failed',
        message: error.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

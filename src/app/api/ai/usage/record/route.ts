import { recordAIUsage } from '@/lib/ai-usage';
import { getSession } from '@/lib/server';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for recording AI usage.
//
// `success` is deliberately NOT accepted from the client. Only rows with
// success === true count against a plan's quota (see canUserUseAI), so letting
// the browser set it meant posting `{"success": false}` after a generation made
// that generation free. Every row written here counts.
const recordUsageSchema = z.object({
  type: z
    .enum(['flowchart_generation', 'canvas_analysis'])
    .default('flowchart_generation'),
  metadata: z.record(z.any()).default({}),
});

// POST /api/ai/usage/record - Record a client-side generation.
//
// The primary billing path is server-side, inside each generation route. This
// endpoint remains for flows that render on the client, and is intentionally
// the same "always counts" shape.
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = recordUsageSchema.parse(body);

    await recordAIUsage(session.user.id, validatedData.type, {
      tokensUsed: 0,
      model: 'google/gemini-2.5-flash',
      success: true,
      metadata: validatedData.metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording AI usage:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { getSession } from '@/lib/server';
import { getUserPlan } from '@/lib/stripe/billing';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Lightweight "who am I + what plan" for client gating (canvas export, etc.). */
export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ authenticated: false, plan: 'free' });
  }
  let plan: string;
  try {
    plan = await getUserPlan(userId);
  } catch {
    plan = 'free';
  }
  return NextResponse.json({ authenticated: true, plan });
}

/**
 * Firestore collections + document types (replaces the former Drizzle schema).
 *
 * Document ids:
 *   user            → doc id = user id (Firebase uid)
 *   payment         → doc id = payment id
 *   flowcharts      → doc id = flowchart id
 *   ai_usage        → doc id = usage id
 *   guest_usage     → doc id = record id
 *
 * Dates are written as JS `Date` (the Admin SDK stores them as Firestore
 * Timestamps) and should be read back with `tsToDate()`.
 */
import { Timestamp } from 'firebase-admin/firestore';

export const COLLECTIONS = {
  user: 'user',
  payment: 'payment',
  flowcharts: 'flowcharts',
  aiUsage: 'ai_usage',
  guestUsage: 'guest_usage',
} as const;

/** Convert a Firestore Timestamp | Date | null/undefined to a JS Date | null. */
export function tsToDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  // Some Admin SDK reads expose { toDate(): Date }
  if (typeof (value as any)?.toDate === 'function') {
    return (value as any).toDate();
  }
  return null;
}

export interface UserDoc {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  customerId?: string | null;
  country?: string | null;
  metadata?: Record<string, any> | null;
}

export interface PaymentDoc {
  id: string;
  priceId: string;
  type: string;
  interval?: string | null;
  userId: string;
  customerId: string;
  subscriptionId?: string | null;
  status: string;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  canceledAt?: Date | null;
  metadata?: Record<string, any> | null;
}

export interface FlowchartDoc {
  id: string;
  title: string;
  content: string; // Excalidraw serializeAsJSON result
  thumbnail?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  userId: string;
}

export interface AiUsageDoc {
  id: string;
  userId: string;
  type: string; // 'flowchart_generation' | 'canvas_analysis' | ...
  tokensUsed?: number | null;
  model?: string | null;
  success: boolean;
  errorMessage?: string | null;
  metadata?: Record<string, any> | null;
  createdAt?: Date | null;
}

export interface GuestUsageDoc {
  id: string;
  ipHash: string;
  type: string;
  userAgent?: string | null;
  success: boolean;
  createdAt?: Date | null;
}

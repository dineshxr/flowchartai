import { getDb } from '@/db';
import { aiUsage, payment } from '@/db/schema';
import { planForPriceId } from '@/lib/stripe/prices';
import { and, eq, gte, sql } from 'drizzle-orm';

// AI usage limits. Free users get a one-time lifetime grant; paid plans reset
// monthly. (Keep in sync with src/config/plans.ts.)
export const AI_USAGE_LIMITS = {
  FREE_USER_LIFETIME: 5, // free plan: 5 generations, lifetime
  HOBBY_USER_MONTHLY: 500, // Pro: 500 / month
  PROFESSIONAL_USER_MONTHLY: 999999, // Max: effectively unlimited / month
} as const;

// Map a Stripe price ID to an internal usage tier:
//   pro → 'hobby' (500/mo), max → 'professional' (unlimited).
function getPlanLevelFromPriceId(
  priceId: string
): 'free' | 'hobby' | 'professional' {
  const plan = planForPriceId(priceId)?.plan;
  if (plan === 'pro') return 'hobby';
  if (plan === 'max') return 'professional';
  return 'free';
}

// 获取用户的计划类型
export async function getUserPlanLevel(
  userId: string
): Promise<'free' | 'hobby' | 'professional'> {
  const subscription = await getUserSubscriptionStatus(userId);

  if (subscription.type === 'free' || !subscription.priceId) {
    return 'free';
  }

  return getPlanLevelFromPriceId(subscription.priceId);
}

// 获取用户的订阅状态
export async function getUserSubscriptionStatus(userId: string) {
  const db = await getDb();

  // 查询用户的订阅记录（不限制status，但要求在有效期内）
  const payments = await db
    .select({
      type: payment.type,
      interval: payment.interval,
      status: payment.status,
      priceId: payment.priceId,
      periodEnd: payment.periodEnd,
      cancelAtPeriodEnd: payment.cancelAtPeriodEnd,
      canceledAt: payment.canceledAt,
    })
    .from(payment)
    .where(
      and(
        eq(payment.userId, userId),
        // 检查订阅是否还在有效期内
        gte(payment.periodEnd, new Date())
      )
    )
    .orderBy(sql`${payment.createdAt} DESC`);

  if (payments.length === 0) {
    return {
      type: 'free',
      interval: null,
      status: 'free',
      isInGracePeriod: false,
      willEndOn: null,
    };
  }

  // 查找有效的订阅
  const validSubscription = payments.find((p) => {
    // 1. Active或trialing状态的订阅直接有效
    if (p.status === 'active' || p.status === 'trialing') {
      return true;
    }

    // 2. Canceled状态但设置了cancelAtPeriodEnd的订阅
    // 在periodEnd之前仍然有效（宽限期）
    if (p.status === 'canceled' && p.cancelAtPeriodEnd) {
      return p.periodEnd && p.periodEnd > new Date();
    }

    return false;
  });

  if (!validSubscription) {
    return {
      type: 'free',
      interval: null,
      status: 'free',
      isInGracePeriod: false,
      willEndOn: null,
    };
  }

  // 判断是否在宽限期
  const isInGracePeriod =
    validSubscription.status === 'canceled' &&
    validSubscription.cancelAtPeriodEnd;

  return {
    type: validSubscription.type,
    interval: validSubscription.interval,
    status: validSubscription.status,
    priceId: validSubscription.priceId,
    isInGracePeriod,
    willEndOn: validSubscription.periodEnd,
    canceledAt: validSubscription.canceledAt,
  };
}

// 检查用户是否可以使用AI功能
export async function canUserUseAI(userId: string): Promise<{
  canUse: boolean;
  reason?: string;
  remainingUsage?: number;
  limit?: number;
  timeFrame?: 'daily' | 'monthly' | 'lifetime';
  nextResetTime?: Date;
}> {
  const db = await getDb();

  // 获取用户订阅状态
  const subscription = await getUserSubscriptionStatus(userId);

  let limit: number;
  let timeFrame: Date;
  let timeFrameType: 'daily' | 'monthly' | 'lifetime';
  let nextResetTime: Date;

  if (subscription.type === 'free' || !subscription.priceId) {
    // Free plan: 5 generations, lifetime (count over all history).
    limit = AI_USAGE_LIMITS.FREE_USER_LIFETIME;
    timeFrame = new Date(0); // epoch → counts every generation ever
    timeFrameType = 'lifetime';
    nextResetTime = new Date(0); // never resets
  } else {
    // 付费用户：根据产品ID确定计划等级
    const planLevel = getPlanLevelFromPriceId(subscription.priceId);

    if (planLevel === 'hobby') {
      limit = AI_USAGE_LIMITS.HOBBY_USER_MONTHLY;
      timeFrame = new Date();
      timeFrame.setDate(1); // 本月开始时间
      timeFrame.setHours(0, 0, 0, 0);
      timeFrameType = 'monthly';

      // 下次重置时间（下月1号0点）
      nextResetTime = new Date(timeFrame);
      nextResetTime.setMonth(nextResetTime.getMonth() + 1);
    } else if (planLevel === 'professional') {
      limit = AI_USAGE_LIMITS.PROFESSIONAL_USER_MONTHLY;
      timeFrame = new Date();
      timeFrame.setDate(1); // 本月开始时间
      timeFrame.setHours(0, 0, 0, 0);
      timeFrameType = 'monthly';

      // 下次重置时间（下月1号0点）
      nextResetTime = new Date(timeFrame);
      nextResetTime.setMonth(nextResetTime.getMonth() + 1);
    } else {
      // 未知产品ID按免费限制处理 (free lifetime)
      limit = AI_USAGE_LIMITS.FREE_USER_LIFETIME;
      timeFrame = new Date(0);
      timeFrameType = 'lifetime';
      nextResetTime = new Date(0);
    }
  }

  // 查询用户在时间范围内的使用次数
  const usageCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiUsage)
    .where(
      and(
        eq(aiUsage.userId, userId),
        eq(aiUsage.success, true), // 只计算成功的调用
        gte(aiUsage.createdAt, timeFrame)
      )
    );

  const currentUsage = Number(usageCount[0]?.count || 0);
  const remainingUsage = Math.max(0, limit - currentUsage);

  if (currentUsage >= limit) {
    const reason =
      timeFrameType === 'lifetime'
        ? `You've used all ${limit} of your free AI generations. Upgrade to Pro for 500 generations a month.`
        : `You have reached your AI usage limit this month. Used: ${currentUsage}/${limit}. Resets next month.`;

    return {
      canUse: false,
      reason,
      remainingUsage: 0,
      limit,
      timeFrame: timeFrameType,
      nextResetTime,
    };
  }

  return {
    canUse: true,
    remainingUsage,
    limit,
    timeFrame: timeFrameType,
    nextResetTime,
  };
}

// 记录AI使用
export async function recordAIUsage(
  userId: string,
  type: 'flowchart_generation' | 'canvas_analysis',
  options: {
    tokensUsed?: number;
    model?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
  } = {}
) {
  const db = await getDb();

  const usageId = `ai_usage_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  await db.insert(aiUsage).values({
    id: usageId,
    userId,
    type,
    tokensUsed: options.tokensUsed || 0,
    model: options.model,
    success: options.success ?? true,
    errorMessage: options.errorMessage,
    metadata: options.metadata || {},
  });

  return usageId;
}

// 获取用户AI使用统计
export async function getUserAIUsageStats(userId: string) {
  const db = await getDb();

  // 今日使用量
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayUsage = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiUsage)
    .where(
      and(
        eq(aiUsage.userId, userId),
        eq(aiUsage.success, true),
        gte(aiUsage.createdAt, todayStart)
      )
    );

  // 本月使用量
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthUsage = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiUsage)
    .where(
      and(
        eq(aiUsage.userId, userId),
        eq(aiUsage.success, true),
        gte(aiUsage.createdAt, monthStart)
      )
    );

  // 总使用量
  const totalUsage = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.success, true)));

  return {
    today: Number(todayUsage[0]?.count || 0),
    thisMonth: Number(monthUsage[0]?.count || 0),
    total: Number(totalUsage[0]?.count || 0),
  };
}

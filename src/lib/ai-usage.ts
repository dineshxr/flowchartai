import { getDb } from '@/db';
import {
  type AiUsageDoc,
  COLLECTIONS,
  type PaymentDoc,
  tsToDate,
} from '@/db/schema';
import { planForPriceId } from '@/lib/stripe/prices';

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
  // Firestore: single-equality filter by userId, then filter/sort in memory.
  const now = new Date();
  const qs = await db
    .collection(COLLECTIONS.payment)
    .where('userId', '==', userId)
    .get();

  const payments = qs.docs
    .map((d) => {
      const data = d.data() as PaymentDoc;
      return {
        type: data.type,
        interval: data.interval ?? null,
        status: data.status,
        priceId: data.priceId,
        periodEnd: tsToDate(data.periodEnd),
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? null,
        canceledAt: tsToDate(data.canceledAt),
        createdAt: tsToDate(data.createdAt),
      };
    })
    // 检查订阅是否还在有效期内
    .filter((p) => p.periodEnd != null && p.periodEnd >= now)
    // createdAt DESC
    .sort(
      (a, b) =>
        (b.createdAt ? b.createdAt.getTime() : 0) -
        (a.createdAt ? a.createdAt.getTime() : 0)
    );

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
  // Firestore: single-equality filter by userId, then count successful
  // generations within the time frame in memory.
  const usageSnap = await db
    .collection(COLLECTIONS.aiUsage)
    .where('userId', '==', userId)
    .get();

  const currentUsage = usageSnap.docs.reduce((count, d) => {
    const data = d.data() as AiUsageDoc;
    const createdAt = tsToDate(data.createdAt);
    // 只计算成功的调用，且在时间范围内
    if (data.success === true && createdAt != null && createdAt >= timeFrame) {
      return count + 1;
    }
    return count;
  }, 0);
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

  // Firestore: no `undefined` allowed — coerce optional fields to null / {}.
  const doc: AiUsageDoc = {
    id: usageId,
    userId,
    type,
    tokensUsed: options.tokensUsed || 0,
    model: options.model ?? null,
    success: options.success ?? true,
    errorMessage: options.errorMessage ?? null,
    metadata: options.metadata || {},
    createdAt: new Date(),
  };

  await db.collection(COLLECTIONS.aiUsage).doc(usageId).set(doc);

  // Lifecycle hooks (creditsLow at 1 left, capHitAt stamp at 0 left). Runs on
  // every successful record — the single choke point all generation routes
  // share. Never allowed to break the generation path.
  if (doc.success === true) {
    try {
      const subscription = await getUserSubscriptionStatus(userId);
      const isFree = subscription.type === 'free' || !subscription.priceId;
      if (isFree) {
        const snap = await db
          .collection(COLLECTIONS.aiUsage)
          .where('userId', '==', userId)
          .get();
        const successCount = snap.docs.reduce(
          (n, d) => ((d.data() as AiUsageDoc).success === true ? n + 1 : n),
          0
        );
        const { afterSuccessfulGeneration } = await import(
          '@/lib/lifecycle-emails'
        );
        await afterSuccessfulGeneration(userId, successCount, true);
      }
    } catch (err) {
      console.error('[ai-usage] lifecycle hook failed', err);
    }
  }

  return usageId;
}

// 获取用户AI使用统计
export async function getUserAIUsageStats(userId: string) {
  const db = await getDb();

  // 今日使用量
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 本月使用量
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Firestore: single-equality filter by userId, then count successful calls
  // for today / this month / total in memory.
  const usageSnap = await db
    .collection(COLLECTIONS.aiUsage)
    .where('userId', '==', userId)
    .get();

  let today = 0;
  let thisMonth = 0;
  let total = 0;

  for (const d of usageSnap.docs) {
    const data = d.data() as AiUsageDoc;
    if (data.success !== true) continue; // 只计算成功的调用

    total += 1;

    const createdAt = tsToDate(data.createdAt);
    if (createdAt == null) continue;
    if (createdAt >= monthStart) thisMonth += 1;
    if (createdAt >= todayStart) today += 1;
  }

  return {
    today,
    thisMonth,
    total,
  };
}

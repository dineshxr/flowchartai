'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Crown, Sparkles, Zap } from 'lucide-react';

interface AIUsageLimitCardProps {
  usedCount: number;
  totalLimit: number;
  currentPlan?: 'free' | 'hobby' | 'professional';
  onUpgrade: () => void;
  onLearnMore: () => void;
  className?: string;
}

export function AIUsageLimitCard({
  usedCount,
  totalLimit,
  currentPlan = 'free',
  onUpgrade,
  onLearnMore,
  className,
}: AIUsageLimitCardProps) {
  // 根据当前计划获取升级建议 (keep in sync with src/config/plans.ts)
  const getUpgradeInfo = () => {
    switch (currentPlan) {
      case 'free':
        return {
          targetPlan: 'Pro',
          price: '$9/month (billed yearly)',
          features: [
            '500 AI generations per month',
            'Unlimited exports, no watermark',
            '2K & 4K video, GIF & image export',
          ],
        };
      case 'hobby':
        return {
          targetPlan: 'Max',
          price: '$23/month (billed yearly)',
          features: [
            'Unlimited AI generations',
            'Brand kit — your logo & colors',
            'Team workspace & priority support',
          ],
        };
      case 'professional':
        return null; // 已是最高级
    }
  };

  const upgradeInfo = getUpgradeInfo();
  return (
    <Card
      className={`w-full max-w-md mx-auto border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}
    >
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl font-normal text-gray-900">
          AI Usage Limit Reached
        </CardTitle>
        <CardDescription className="font-normal">
          You've used all{' '}
          <span className="font-medium text-amber-700">
            {usedCount}/{totalLimit}
          </span>{' '}
          {currentPlan === 'free'
            ? 'of your free AI generations'
            : 'AI generations this month'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {upgradeInfo && (
          <div className="bg-white/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-gray-900">
                Upgrade to {upgradeInfo.targetPlan}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              {upgradeInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {upgradeInfo ? (
            <Button
              onClick={onUpgrade}
              className="w-full font-normal bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to {upgradeInfo.targetPlan} Now
            </Button>
          ) : (
            <Button
              onClick={onLearnMore}
              className="w-full font-normal bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Crown className="mr-2 h-4 w-4" />
              You're on the highest plan!
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onLearnMore}
            className="w-full font-normal border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            View All Plans & Pricing
          </Button>
        </div>

        {upgradeInfo && (
          <div className="text-center">
            <Badge variant="secondary" className="font-normal text-xs">
              💡 Start from just {upgradeInfo.price}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { PlanCreditsCard } from '@/components/settings/profile/plan-credits-card';
import { UpdateAvatarCard } from '@/components/settings/profile/update-avatar-card';
import { UpdateNameCard } from '@/components/settings/profile/update-name-card';

export default function ProfilePage() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <PlanCreditsCard className="md:col-span-2" />
      <UpdateAvatarCard />
      <UpdateNameCard />
    </div>
  );
}

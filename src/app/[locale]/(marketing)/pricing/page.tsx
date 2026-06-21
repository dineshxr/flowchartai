import FaqSection from '@/components/blocks/faqs/faqs';
import Container from '@/components/layout/container';
import { UpgradePlans } from '@/components/pricing/upgrade-plans';

export default async function PricingPage() {
  return (
    <Container className="mt-8 flex max-w-6xl flex-col gap-16 px-4">
      <UpgradePlans />

      <FaqSection />
    </Container>
  );
}

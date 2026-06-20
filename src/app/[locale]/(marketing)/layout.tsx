import { Footer } from '@/components/blocks/infogiph-home/footer';
import { SiteHeader } from '@/components/blocks/infogiph-home/site-header';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="infogiph-home flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

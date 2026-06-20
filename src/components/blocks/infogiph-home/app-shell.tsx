import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="infogiph-home relative min-h-screen bg-background">
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <SiteHeader />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

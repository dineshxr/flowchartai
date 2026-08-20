'use client';

import { accentForCategory } from '@/lib/templates/catalog';
import type { Template } from '@/lib/templates/types';
import Link from 'next/link';
import { StaticDiagramThumb } from './static-diagram-thumb';

export function templateHref(template: Pick<Template, 'category' | 'slug'>) {
  return `/templates/${template.category}/${template.slug}`;
}

export function TemplateCard({ template }: { template: Template }) {
  const accent = accentForCategory(template.category);
  return (
    <Link
      href={templateHref(template)}
      className="group block w-full cursor-pointer text-left transition-opacity hover:opacity-95"
    >
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-muted">
          <StaticDiagramThumb
            data={template.data}
            accent={accent}
            layout={template.style?.layout}
          />
        </div>
        {template.pro ? (
          <span className="ig-gradient absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
            Pro
          </span>
        ) : null}
      </div>
      <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-black sm:text-base">
        {template.title}
      </h3>
      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:text-sm">
        {template.shortDescription}
      </p>
    </Link>
  );
}

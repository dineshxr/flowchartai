'use client';

import { SearchIcon } from '@/components/blocks/infogiph-home/icons';
import type { CategoryMeta, Template } from '@/lib/templates/types';
import { useMemo, useState } from 'react';
import { TemplateCard } from './template-card';

interface TemplateSearchProps {
  templates: Template[];
  /** Categories to show as filter chips. Omit/empty to hide the filter row. */
  categories?: CategoryMeta[];
  /** Placeholder for the search input. */
  placeholder?: string;
}

function buildHaystack(t: Template): string {
  return [t.title, t.shortDescription, t.categoryName, ...t.tags, ...t.keywords]
    .join(' ')
    .toLowerCase();
}

export function TemplateSearch({
  templates,
  categories = [],
  placeholder = 'Search templates…',
}: TemplateSearchProps) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  const haystacks = useMemo(
    () => new Map(templates.map((t) => [t.slug, buildHaystack(t)])),
    [templates]
  );

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return templates.filter((t) => {
      if (activeCat !== 'all' && t.category !== activeCat) return false;
      if (terms.length === 0) return true;
      const hay = haystacks.get(t.slug) || '';
      return terms.every((term) => hay.includes(term));
    });
  }, [templates, query, activeCat, haystacks]);

  const showChips = categories.length > 0;

  return (
    <div>
      {/* Search input */}
      <div className="relative mx-auto max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search templates"
          className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
        />
      </div>

      {/* Category chips */}
      {showChips && (
        <div className="scrollbar-hide mx-auto mt-5 flex max-w-full items-center gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCat('all')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
              activeCat === 'all'
                ? 'bg-foreground text-background'
                : 'text-foreground/70 hover:bg-[#fafafa] hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveCat(c.key)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                activeCat === c.key
                  ? 'bg-foreground text-background'
                  : 'text-foreground/70 hover:bg-[#fafafa] hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="mt-5 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'template' : 'templates'}
        {query.trim() ? ' found' : ''}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No templates match “{query}”. Try a different search.
          </p>
        </div>
      )}
    </div>
  );
}

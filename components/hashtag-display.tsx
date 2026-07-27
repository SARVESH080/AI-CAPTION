'use client';

import * as React from 'react';
import { Copy, Check, TrendingUp, Target, Feather, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/format';
import { toast } from 'sonner';
import {
  HASHTAG_CATEGORY_META,
  type Hashtag,
  type HashtagCategory,
} from '@/lib/types';

interface HashtagDisplayProps {
  hashtags: Hashtag[];
}

const CATEGORY_ICONS: Record<HashtagCategory, React.ReactNode> = {
  trending: <TrendingUp className="h-4 w-4" />,
  niche: <Target className="h-4 w-4" />,
  lowCompetition: <Feather className="h-4 w-4" />,
  highReach: <Rocket className="h-4 w-4" />,
};

const CATEGORY_COLORS: Record<HashtagCategory, string> = {
  trending: 'text-warning bg-warning-soft border-warning/20',
  niche: 'text-brand bg-brand-soft border-brand/20',
  lowCompetition: 'text-success bg-success-soft border-success/20',
  highReach: 'text-info bg-info-soft border-info/20',
};

export function HashtagDisplay({ hashtags }: HashtagDisplayProps) {
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [copiedCat, setCopiedCat] = React.useState<string | null>(null);

  const grouped = React.useMemo(() => {
    return hashtags.reduce<Record<HashtagCategory, Hashtag[]>>(
      (acc, h) => {
        (acc[h.category] ||= []).push(h);
        return acc;
      },
      { trending: [], niche: [], lowCompetition: [], highReach: [] },
    );
  }, [hashtags]);

  const copyCategory = async (category: HashtagCategory) => {
    const tags = grouped[category].map((h) => h.tag).join(' ');
    const ok = await copyToClipboard(tags);
    if (ok) {
      setCopiedCat(category);
      toast.success(`${HASHTAG_CATEGORY_META[category].label} hashtags copied`);
      setTimeout(() => setCopiedCat(null), 1600);
    }
  };

  const copyAll = async () => {
    const all = hashtags.map((h) => h.tag).join(' ');
    const ok = await copyToClipboard(all);
    if (ok) {
      setCopiedAll(true);
      toast.success('All hashtags copied');
      setTimeout(() => setCopiedAll(false), 1600);
    }
  };

  const categories = Object.keys(grouped) as HashtagCategory[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {hashtags.length} Hashtags
        </h3>
        <Button size="sm" variant="outline" onClick={copyAll} className="gap-1.5 rounded-lg">
          {copiedAll ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          Copy all
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => {
          const meta = HASHTAG_CATEGORY_META[cat];
          const tags = grouped[cat];
          if (tags.length === 0) return null;
          return (
            <div
              key={cat}
              className="rounded-2xl border border-border bg-card p-4 animate-fade-in-up"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-lg border',
                      CATEGORY_COLORS[cat],
                    )}
                  >
                    {CATEGORY_ICONS[cat]}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">{meta.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {meta.description}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyCategory(cat)}
                  className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  aria-label={`Copy ${meta.label} hashtags`}
                >
                  {copiedCat === cat ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((h) => (
                  <span
                    key={h.tag}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-brand-soft hover:text-brand"
                    title={h.reachEstimate}
                  >
                    {h.tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

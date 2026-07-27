'use client';

import * as React from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Heart,
  Download,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScorePanel } from '@/components/score-panel';
import { copyToClipboard, downloadText } from '@/lib/format';
import { toast } from 'sonner';
import {
  PLATFORM_META,
  TONE_META,
  LENGTH_META,
  type GeneratedCaption,
} from '@/lib/types';

interface CaptionCardProps {
  caption: GeneratedCaption;
  index: number;
  onRegenerate: (caption: GeneratedCaption) => void;
  onToggleFavorite: (id: string) => void;
  regenerating?: boolean;
}

export function CaptionCard({
  caption,
  index,
  onRegenerate,
  onToggleFavorite,
  regenerating,
}: CaptionCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const platform = PLATFORM_META[caption.platform];

  const handleCopy = async () => {
    const ok = await copyToClipboard(caption.fullText);
    if (ok) {
      setCopied(true);
      toast.success('Caption copied to clipboard');
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error('Could not copy. Try again.');
    }
  };

  const handleDownload = () => {
    const content = `${caption.fullText}\n\n— Generated with TrendCaption AI`;
    downloadText(`caption-${caption.platform}-${index + 1}.txt`, content);
    toast.success('Downloaded as TXT');
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: platform.color }}
          >
            {platform.shortLabel}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{platform.label}</span>
            <span className="text-[11px] text-muted-foreground">
              {TONE_META[caption.tone].label} · {LENGTH_META[caption.length].label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className="bg-brand-soft text-brand border-brand/20"
          >
            #{index + 1}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onToggleFavorite(caption.id)}
            aria-label="Favorite"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-all',
                caption.favorite
                  ? 'fill-brand text-brand scale-110'
                  : 'text-muted-foreground',
              )}
            />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-2 rounded-xl bg-muted/40 p-3">
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-brand">Hook:</span> {caption.hook}
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">{caption.body}</p>
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-brand">CTA:</span> {caption.cta}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-muted-foreground"
          onClick={() => setExpanded((e) => !e)}
        >
          <Sparkles className="h-3 w-3" />
          AI Scores
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform',
              expanded && 'rotate-180',
            )}
          />
        </Button>
      </div>

      {expanded && (
        <div className="mt-2 animate-fade-in">
          <ScorePanel scores={caption.scores} />
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="gap-1.5 rounded-lg"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          Copy
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRegenerate(caption)}
          disabled={regenerating}
          className="gap-1.5 rounded-lg"
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5', regenerating && 'animate-spin')}
          />
          Regenerate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          className="gap-1.5 rounded-lg"
        >
          <Download className="h-3.5 w-3.5" />
          TXT
        </Button>
      </div>
    </div>
  );
}

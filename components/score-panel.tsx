'use client';

import type { CaptionScore } from '@/lib/types';

interface ScorePanelProps {
  scores: CaptionScore;
}

function ScoreRing({
  value,
  label,
  color,
  reason,
}: {
  value: number;
  label: string;
  color: string;
  reason: string;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition hover:border-brand/40">
      <div className="relative h-14 w-14">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            strokeWidth="4"
            className="stroke-muted"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-bold">
          {value}
        </span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <p className="text-center text-[11px] leading-snug text-muted-foreground opacity-0 transition group-hover:opacity-100 max-h-0 group-hover:max-h-24 overflow-hidden">
        {reason}
      </p>
    </div>
  );
}

export function ScorePanel({ scores }: ScorePanelProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <ScoreRing
        value={scores.engagement}
        label="Engagement"
        color="hsl(var(--success))"
        reason={scores.engagementReason}
      />
      <ScoreRing
        value={scores.virality}
        label="Virality"
        color="hsl(var(--warning))"
        reason={scores.viralityReason}
      />
      <ScoreRing
        value={scores.readability}
        label="Readability"
        color="hsl(var(--info))"
        reason={scores.readabilityReason}
      />
    </div>
  );
}

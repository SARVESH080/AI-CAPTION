'use client';

import {
  Boxes,
  Users,
  Smile,
  Activity,
  MapPin,
  Palette,
  Sparkles,
} from 'lucide-react';
import type { MediaAnalysis } from '@/lib/types';

interface AnalysisCardProps {
  analysis: MediaAnalysis;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
      {children}
    </span>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5 animate-fade-in-up">
      <div className="flex items-start gap-3 rounded-xl bg-brand-soft/50 p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg brand-gradient text-white">
          <Sparkles className="h-[18px] w-[18px]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            AI Summary
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {analysis.summary}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Section icon={<Boxes className="h-3.5 w-3.5" />} label="Objects">
          {analysis.objects.map((o) => (
            <Chip key={o}>{o}</Chip>
          ))}
        </Section>

        <Section icon={<Users className="h-3.5 w-3.5" />} label="People">
          <Chip>{analysis.people.description}</Chip>
        </Section>

        <Section icon={<Smile className="h-3.5 w-3.5" />} label="Emotions">
          {analysis.emotions.map((e) => (
            <Chip key={e}>{e}</Chip>
          ))}
        </Section>

        <Section icon={<Activity className="h-3.5 w-3.5" />} label="Activities">
          {analysis.activities.map((a) => (
            <Chip key={a}>{a}</Chip>
          ))}
        </Section>

        <Section icon={<MapPin className="h-3.5 w-3.5" />} label="Location">
          <Chip>{analysis.locationType}</Chip>
        </Section>

        <Section icon={<Sparkles className="h-3.5 w-3.5" />} label="Style & Mood">
          <Chip>{analysis.style}</Chip>
          <Chip>{analysis.mood}</Chip>
        </Section>
      </div>

      <Section icon={<Palette className="h-3.5 w-3.5" />} label="Colors">
        {analysis.colors.map((c) => (
          <span
            key={c.hex}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 text-xs font-medium"
          >
            <span
              className="h-3 w-3 rounded-full ring-1 ring-border"
              style={{ backgroundColor: c.hex }}
            />
            {c.name}
          </span>
        ))}
      </Section>
    </div>
  );
}

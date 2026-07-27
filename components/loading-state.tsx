'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  label?: string;
  steps?: string[];
}

export function LoadingState({
  label = 'Analyzing your media…',
  steps = [
    'Scanning objects and people',
    'Detecting mood and style',
    'Writing platform captions',
    'Scoring engagement potential',
    'Curating hashtags',
  ],
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-border bg-card p-10 text-center">
      <div className="relative grid h-20 w-20 place-items-center">
        <div className="absolute inset-0 rounded-full brand-gradient opacity-20 animate-pulse-soft" />
        <div className="absolute inset-0 rounded-full border-2 border-brand/30 border-t-brand animate-spin-slow" />
        <Sparkles className="h-8 w-8 text-brand animate-pulse-soft" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">
          This usually takes a few seconds.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        {steps.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-2 text-left text-xs text-muted-foreground animate-fade-in"
            style={{ animationDelay: `${i * 350}ms` }}
          >
            <Loader2 className="h-3 w-3 animate-spin text-brand" />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-muted animate-pulse" />
        <div className="space-y-1">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="mt-3 space-y-2 rounded-xl bg-muted/40 p-3">
        <div className="h-3 w-full rounded bg-muted animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <div className="h-7 w-16 rounded-lg bg-muted animate-pulse" />
        <div className="h-7 w-24 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center',
        className,
      )}
    >
      {icon && (
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          {icon}
        </div>
      )}
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

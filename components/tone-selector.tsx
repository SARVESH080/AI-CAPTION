'use client';

import { cn } from '@/lib/utils';
import { TONE_META, type Tone } from '@/lib/types';

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
  disabled?: boolean;
}

const TONES = Object.keys(TONE_META) as Tone[];

export function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {TONES.map((tone) => {
        const meta = TONE_META[tone];
        const active = value === tone;
        return (
          <button
            key={tone}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tone)}
            className={cn(
              'group flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-200',
              active
                ? 'border-brand bg-brand-soft shadow-glow'
                : 'border-border bg-card hover:border-brand/40 hover:bg-accent/50',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <span className="text-lg leading-none">{meta.emoji}</span>
            <span
              className={cn(
                'text-sm font-semibold leading-tight',
                active ? 'text-brand' : 'text-foreground',
              )}
            >
              {meta.label}
            </span>
            <span className="text-[11px] leading-tight text-muted-foreground">
              {meta.blurb}
            </span>
          </button>
        );
      })}
    </div>
  );
}

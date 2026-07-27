'use client';

import { cn } from '@/lib/utils';
import { LENGTH_META, type CaptionLength } from '@/lib/types';

interface LengthSelectorProps {
  value: CaptionLength;
  onChange: (length: CaptionLength) => void;
  disabled?: boolean;
}

const LENGTHS: CaptionLength[] = ['short', 'medium', 'long'];

export function LengthSelector({ value, onChange, disabled }: LengthSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {LENGTHS.map((length) => {
        const meta = LENGTH_META[length];
        const active = value === length;
        return (
          <button
            key={length}
            type="button"
            disabled={disabled}
            onClick={() => onChange(length)}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 transition-all duration-200',
              active
                ? 'border-brand bg-brand-soft shadow-glow'
                : 'border-border bg-card hover:border-brand/40 hover:bg-accent/50',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <span
              className={cn(
                'text-sm font-semibold',
                active ? 'text-brand' : 'text-foreground',
              )}
            >
              {meta.label}
            </span>
            <span className="text-[11px] text-muted-foreground">{meta.wordRange}</span>
          </button>
        );
      })}
    </div>
  );
}

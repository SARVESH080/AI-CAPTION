'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORM_META, type Platform } from '@/lib/types';

interface PlatformPickerProps {
  value: Platform[];
  onChange: (platforms: Platform[]) => void;
  disabled?: boolean;
}

const PLATFORMS: Platform[] = ['instagram', 'linkedin', 'twitter', 'facebook'];

export function PlatformPicker({ value, onChange, disabled }: PlatformPickerProps) {
  const toggle = (p: Platform) => {
    if (value.includes(p)) {
      if (value.length === 1) return;
      onChange(value.filter((x) => x !== p));
    } else {
      onChange([...value, p]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {PLATFORMS.map((p) => {
        const meta = PLATFORM_META[p];
        const active = value.includes(p);
        return (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => toggle(p)}
            className={cn(
              'flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200',
              active
                ? 'border-brand bg-brand-soft shadow-glow'
                : 'border-border bg-card hover:border-brand/40 hover:bg-accent/50',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: meta.color }}
              >
                {meta.shortLabel}
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  active ? 'text-brand' : 'text-foreground',
                )}
              >
                {meta.label}
              </span>
            </div>
            <span
              className={cn(
                'grid h-5 w-5 place-items-center rounded-full border transition-all',
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-border bg-transparent',
              )}
            >
              {active && <Check className="h-3 w-3" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

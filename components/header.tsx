'use client';

import { Sparkles, Github, History as HistoryIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export function Header({ onToggleHistory, historyCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl brand-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold tracking-tight">
              TrendCaption <span className="brand-text-gradient">AI</span>
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Captions that trend
            </span>
          </div>
          <Badge
            variant="secondary"
            className="ml-1 hidden border-brand/30 bg-brand-soft text-brand sm:inline-flex"
          >
            Beta
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleHistory}
            className="relative gap-2 rounded-full"
          >
            <HistoryIcon className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden rounded-full sm:inline-flex"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-[1.15rem] w-[1.15rem]" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

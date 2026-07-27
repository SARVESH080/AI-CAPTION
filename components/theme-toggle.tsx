'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative overflow-hidden rounded-full border-border/60"
    >
      <Sun
        className={`h-[1.15rem] w-[1.15rem] transition-all duration-300 ${
          isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`absolute h-[1.15rem] w-[1.15rem] transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        }`}
      />
    </Button>
  );
}

'use client';

import { History, Trash2, ImageIcon, VideoIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { timeAgo } from '@/lib/format';
import { TONE_META } from '@/lib/types';
import type { GenerationResult } from '@/lib/types';

interface HistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: GenerationResult[];
  onSelect: (item: GenerationResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  open,
  onOpenChange,
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full flex flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border p-5 pr-12">
          <SheetTitle className="flex items-center gap-2 font-display">
            <History className="h-[18px] w-[18px] text-brand" />
            Generation History
          </SheetTitle>
          <SheetDescription>
            Your last {history.length} {history.length === 1 ? 'generation' : 'generations'}, saved on this device.
          </SheetDescription>
        </SheetHeader>

        {history.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
              <History className="h-7 w-7" />
            </div>
            <p className="font-medium">No history yet</p>
            <p className="text-sm text-muted-foreground">
              Generate captions and they will appear here for quick access.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:border-brand/50 hover:bg-accent/40"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.media.dataUrl ? (
                        item.media.kind === 'image' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.media.dataUrl}
                            alt={item.media.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <video
                            src={item.media.dataUrl}
                            className="h-full w-full object-cover"
                            muted
                          />
                        )
                      ) : (
                        <div className="grid h-full w-full place-items-center text-muted-foreground">
                          {item.media.kind === 'image' ? (
                            <ImageIcon className="h-5 w-5" />
                          ) : (
                            <VideoIcon className="h-5 w-5" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.media.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-brand-soft text-brand border-brand/20 py-0 text-[10px]"
                        >
                          {TONE_META[item.tone].label}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {item.captions.length} captions · {timeAgo(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          onDelete(item.id);
                        }
                      }}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-border p-4">
              <Button
                variant="outline"
                onClick={onClear}
                className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear all history
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

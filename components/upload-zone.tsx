'use client';

import * as React from 'react';
import { UploadCloud, ImageIcon, VideoIcon, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/format';
import type { MediaKind, UploadedMedia } from '@/lib/types';

interface UploadZoneProps {
  onUpload: (media: UploadedMedia) => void;
  current?: UploadedMedia | null;
  onClear: () => void;
  disabled?: boolean;
}

const ACCEPTED = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'],
};

function detectKind(mime: string): MediaKind | null {
  if (ACCEPTED.image.includes(mime)) return 'image';
  if (ACCEPTED.video.includes(mime)) return 'video';
  return null;
}

const MAX_SIZE = 25 * 1024 * 1024;

export function UploadZone({ onUpload, current, onClear, disabled }: UploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const handleFiles = React.useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setError(null);

      const kind = detectKind(file.type);
      if (!kind) {
        setError('Unsupported file. Use JPG, PNG, WebP, MP4, WebM, or MOV.');
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('File is too large. Maximum 25 MB.');
        return;
      }

      setProcessing(true);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const media: UploadedMedia = {
          id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          kind,
          mimeType: file.type,
          size: file.size,
          dataUrl,
          createdAt: Date.now(),
        };
        onUpload(media);
        setProcessing(false);
      };
      reader.onerror = () => {
        setError('Could not read that file. Please try another.');
        setProcessing(false);
      };
      reader.readAsDataURL(file);
    },
    [onUpload],
  );

  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled],
  );

  if (current) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          {current.kind === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.dataUrl}
              alt={current.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={current.dataUrl}
              className="h-full w-full object-cover"
              controls
              muted
              playsInline
            />
          )}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {current.kind === 'image' ? (
              <ImageIcon className="h-3.5 w-3.5" />
            ) : (
              <VideoIcon className="h-3.5 w-3.5" />
            )}
            {current.kind === 'image' ? 'Image' : 'Video'}
          </div>
          <button
            onClick={onClear}
            disabled={disabled}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 disabled:opacity-50"
            aria-label="Remove media"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <p className="truncate text-sm font-medium">{current.name}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatBytes(current.size)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300',
          dragging
            ? 'border-brand bg-brand-soft/60 scale-[1.01]'
            : 'border-border bg-card hover:border-brand/50 hover:bg-accent/40',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={[...ACCEPTED.image, ...ACCEPTED.video].join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />

        <div
          className={cn(
            'grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300',
            dragging
              ? 'brand-gradient text-white scale-110'
              : 'bg-brand-soft text-brand',
          )}
        >
          {processing ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <UploadCloud className="h-7 w-7" />
          )}
        </div>

        <div className="space-y-1">
          <p className="font-display text-base font-semibold">
            {dragging ? 'Drop to upload' : 'Drag & drop media here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-brand font-medium">browse files</span> ·
            images &amp; videos up to 25 MB
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            <ImageIcon className="h-3 w-3" /> JPG · PNG · WebP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            <VideoIcon className="h-3 w-3" /> MP4 · WebM · MOV
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}

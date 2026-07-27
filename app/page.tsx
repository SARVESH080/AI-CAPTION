'use client';

import * as React from 'react';
import { Sparkles, Wand2, Smile, Hash, LayoutGrid, RotateCcw } from 'lucide-react';
import { Header } from '@/components/header';
import { UploadZone } from '@/components/upload-zone';
import { ToneSelector } from '@/components/tone-selector';
import { LengthSelector } from '@/components/length-selector';
import { PlatformPicker } from '@/components/platform-picker';
import { AnalysisCard } from '@/components/analysis-card';
import { CaptionCard } from '@/components/caption-card';
import { HashtagDisplay } from '@/components/hashtag-display';
import { HistoryPanel } from '@/components/history-panel';
import { LoadingState, EmptyState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { runGeneration, generateCaptions } from '@/lib/ai/mock-ai';
import { useHistory } from '@/lib/history';
import type {
  CaptionLength,
  GeneratedCaption,
  GenerationResult,
  MediaAnalysis,
  Hashtag,
  Platform,
  Tone,
  UploadedMedia,
} from '@/lib/types';

export default function Home() {
  const [media, setMedia] = React.useState<UploadedMedia | null>(null);
  const [tone, setTone] = React.useState<Tone>('casual');
  const [length, setLength] = React.useState<CaptionLength>('medium');
  const [platforms, setPlatforms] = React.useState<Platform[]>([
    'instagram',
    'linkedin',
    'twitter',
    'facebook',
  ]);
  const [useEmojis, setUseEmojis] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<MediaAnalysis | null>(null);
  const [captions, setCaptions] = React.useState<GeneratedCaption[]>([]);
  const [hashtags, setHashtags] = React.useState<Hashtag[]>([]);
  const [regeneratingId, setRegeneratingId] = React.useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = React.useState(false);

  const [historyOpen, setHistoryOpen] = React.useState(false);
  const { history, add, remove, clear } = useHistory();

  const handleGenerate = async () => {
    if (!media) {
      toast.error('Upload an image or video first');
      return;
    }
    if (platforms.length === 0) {
      toast.error('Select at least one platform');
      return;
    }

    setLoading(true);
    setCaptions([]);
    setHashtags([]);
    setAnalysis(null);

    try {
      const result = await runGeneration(media, tone, length, platforms, useEmojis);
      setAnalysis(result.analysis);
      setCaptions(result.captions);
      setHashtags(result.hashtags);
      setHasGenerated(true);

      const record: GenerationResult = {
        id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        media,
        analysis: result.analysis,
        captions: result.captions,
        hashtags: result.hashtags,
        tone,
        length,
        createdAt: Date.now(),
      };
      add(record);
      toast.success('Captions ready');
    } catch {
      toast.error('Something went wrong while generating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (caption: GeneratedCaption) => {
    if (!media || !analysis) return;
    setRegeneratingId(caption.id);
    try {
      const fresh = await generateCaptions(
        media,
        analysis,
        caption.platform,
        caption.tone,
        caption.length,
        caption.emojis,
      );
      setCaptions((prev) =>
        prev.map((c) => (c.id === caption.id ? { ...fresh[0], id: caption.id, favorite: c.favorite } : c)),
      );
      toast.success('Caption regenerated');
    } catch {
      toast.error('Could not regenerate. Try again.');
    } finally {
      setRegeneratingId(null);
    }
  };

  const toggleFavorite = (id: string) => {
    setCaptions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
    );
  };

  const handleReset = () => {
    setMedia(null);
    setAnalysis(null);
    setCaptions([]);
    setHashtags([]);
    setHasGenerated(false);
  };

  const handleSelectHistory = (item: GenerationResult) => {
    setMedia(item.media);
    setAnalysis(item.analysis);
    setCaptions(item.captions);
    setHashtags(item.hashtags);
    setTone(item.tone);
    setLength(item.length);
    setHasGenerated(true);
    setHistoryOpen(false);
    toast.success('Loaded from history');
  };

  const groupedCaptions = React.useMemo(() => {
    return platforms.map((p) => ({
      platform: p,
      items: captions.filter((c) => c.platform === p),
    }));
  }, [captions, platforms]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onToggleHistory={() => setHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full brand-gradient opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <Badge className="mx-auto mb-4 gap-1.5 border-brand/30 bg-brand-soft text-brand">
            <Sparkles className="h-3 w-3" />
            AI-powered caption generator
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Upload media. Get captions that{' '}
            <span className="brand-text-gradient">trend</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            TrendCaption AI analyzes your images and videos, then writes
            platform-perfect captions, hashtags, and virality scores in seconds.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Control column */}
          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  1 · Upload media
                </h2>
                {media && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                )}
              </div>
              <UploadZone
                onUpload={setMedia}
                current={media}
                onClear={() => setMedia(null)}
                disabled={loading}
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                2 · Platforms
              </h2>
              <PlatformPicker
                value={platforms}
                onChange={setPlatforms}
                disabled={loading}
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                3 · Tone
              </h2>
              <ToneSelector value={tone} onChange={setTone} disabled={loading} />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                4 · Length
              </h2>
              <LengthSelector
                value={length}
                onChange={setLength}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-brand" />
                <Label htmlFor="emoji-toggle" className="text-sm font-medium cursor-pointer">
                  Include emojis
                </Label>
              </div>
              <Switch
                id="emoji-toggle"
                checked={useEmojis}
                onCheckedChange={setUseEmojis}
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!media || loading}
              className="w-full gap-2 rounded-xl h-12 text-base font-semibold brand-gradient text-white shadow-glow hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate captions
                </>
              )}
            </Button>
          </div>

          {/* Results column */}
          <div className="space-y-6">
            {loading && <LoadingState />}

            {!loading && !hasGenerated && (
              <EmptyState
                icon={<Wand2 className="h-7 w-7" />}
                title="Your captions will appear here"
                description="Upload an image or video, pick your platforms and tone, then hit Generate. TrendCaption AI handles the rest."
              />
            )}

            {!loading && hasGenerated && analysis && (
              <>
                {/* Analysis */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <h2 className="font-display text-lg font-semibold">AI Analysis</h2>
                </div>
                <AnalysisCard analysis={analysis} />

                {/* Captions */}
                <div className="flex items-center gap-2 pt-2">
                  <LayoutGrid className="h-4 w-4 text-brand" />
                  <h2 className="font-display text-lg font-semibold">
                    Captions
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {captions.length} generated
                    </span>
                  </h2>
                </div>

                {groupedCaptions.length > 1 ? (
                  <Tabs defaultValue={groupedCaptions[0].platform}>
                    <TabsList className="w-full justify-start overflow-x-auto">
                      {groupedCaptions.map((g) => (
                        <TabsTrigger
                          key={g.platform}
                          value={g.platform}
                          className="gap-1.5"
                        >
                          {g.platform === 'instagram'
                            ? 'Instagram'
                            : g.platform === 'linkedin'
                              ? 'LinkedIn'
                              : g.platform === 'twitter'
                                ? 'X'
                                : 'Facebook'}
                          <span className="text-xs text-muted-foreground">
                            ({g.items.length})
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {groupedCaptions.map((g) => (
                      <TabsContent key={g.platform} value={g.platform}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {g.items.map((caption, i) => (
                            <CaptionCard
                              key={caption.id}
                              caption={caption}
                              index={i}
                              onRegenerate={handleRegenerate}
                              onToggleFavorite={toggleFavorite}
                              regenerating={regeneratingId === caption.id}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {captions.map((caption, i) => (
                      <CaptionCard
                        key={caption.id}
                        caption={caption}
                        index={i}
                        onRegenerate={handleRegenerate}
                        onToggleFavorite={toggleFavorite}
                        regenerating={regeneratingId === caption.id}
                      />
                    ))}
                  </div>
                )}

                {/* Hashtags */}
                <div className="flex items-center gap-2 pt-2">
                  <Hash className="h-4 w-4 text-brand" />
                  <h2 className="font-display text-lg font-semibold">Hashtags</h2>
                </div>
                <HashtagDisplay hashtags={hashtags} />
              </>
            )}
          </div>
        </div>
      </main>

      <HistoryPanel
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={remove}
        onClear={clear}
      />

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        TrendCaption AI · Mock-powered demo · Swap the AI layer for OpenAI or Gemini anytime
      </footer>
    </div>
  );
}

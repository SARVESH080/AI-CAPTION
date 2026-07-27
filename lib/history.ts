'use client';

import { useEffect, useState, useCallback } from 'react';
import type { GenerationResult } from './types';

const KEY = 'trendcaption_history_v1';
const MAX_ITEMS = 24;

export function loadHistory(): GenerationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GenerationResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: GenerationResult): GenerationResult[] {
  const current = loadHistory();
  const next = [item, ...current].slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full (large data URLs) — drop oldest data URLs to recover
    const trimmed = next.map((it, i) =>
      i === 0 ? it : { ...it, media: { ...it.media, dataUrl: '' } },
    );
    try {
      window.localStorage.setItem(KEY, JSON.stringify(trimmed));
    } catch {
      // give up silently
    }
  }
  return next;
}

export function deleteHistoryItem(id: string): GenerationResult[] {
  const next = loadHistory().filter((it) => it.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function useHistory() {
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    setLoaded(true);
  }, []);

  const add = useCallback((item: GenerationResult) => {
    setHistory(saveHistoryItem(item));
  }, []);

  const remove = useCallback((id: string) => {
    setHistory(deleteHistoryItem(id));
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, loaded, add, remove, clear };
}

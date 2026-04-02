"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";

const STORAGE_KEY = "infomaxxxing_bookmarks";

function loadBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveBookmarks(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      setIds(loadBookmarks());
      initialized.current = true;
    }
  }, []);

  const idSet = useMemo(() => new Set(ids), [ids]);

  const toggleBookmark = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => idSet.has(id), [idSet]);

  return { ids, toggleBookmark, isBookmarked, count: ids.length };
}

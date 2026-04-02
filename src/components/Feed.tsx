"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Concept, Category } from "@/lib/types";
import { ConceptCard } from "./ConceptCard";

interface FeedProps {
  category: Category | null;
  searchQuery?: string;
  seenIds?: Set<string>;
  onConceptSelect?: (concept: Concept) => void;
  isBookmarked?: (id: string) => boolean;
  onToggleBookmark?: (id: string) => void;
}

export function Feed({ category, searchQuery, seenIds, onConceptSelect, isBookmarked, onToggleBookmark }: FeedProps) {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Concept[] | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const cursorRef = useRef(0);
  // Snapshot seenIds at fetch time so sorting doesn't shift cards mid-session
  const seenAtFetchRef = useRef<Set<string>>(new Set());

  // Keep refs in sync with state
  loadingRef.current = loading;
  cursorRef.current = cursor;

  // Search effect - debounced
  useEffect(() => {
    if (!searchQuery?.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.items);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMore = useCallback(async () => {
    if (loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    try {
      const params = new URLSearchParams({
        cursor: cursorRef.current.toString(),
        limit: "10",
      });
      if (category) params.set("category", category);
      const res = await fetch(`/api/concepts?${params}`);
      const data = await res.json();
      // Sort new batch: unseen first, using snapshot from fetch time
      const snap = seenAtFetchRef.current;
      const sorted = [...data.items].sort((a: Concept, b: Concept) => {
        const aS = snap.has(a.id) ? 1 : 0;
        const bS = snap.has(b.id) ? 1 : 0;
        return aS - bS;
      });
      setConcepts((prev) => [...prev, ...sorted]);
      setCursor(data.nextCursor);
      cursorRef.current = data.nextCursor;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [category]);

  // Reset when category changes
  useEffect(() => {
    setConcepts([]);
    setCursor(0);
    cursorRef.current = 0;
    // Snapshot current seenIds for sorting new fetches
    if (seenIds) seenAtFetchRef.current = new Set(seenIds);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load + category change
  useEffect(() => {
    if (concepts.length === 0 && !loading) {
      // Snapshot seenIds at load time
      if (seenIds) seenAtFetchRef.current = new Set(seenIds);
      const load = async () => {
        setLoading(true);
        loadingRef.current = true;
        try {
          const params = new URLSearchParams({
            cursor: "0",
            limit: "15",
          });
          if (category) params.set("category", category);
          const res = await fetch(`/api/concepts?${params}`);
          const data = await res.json();
          // Sort initial batch: unseen first
          const snap = seenAtFetchRef.current;
          const sorted = [...data.items].sort((a: Concept, b: Concept) => {
            const aS = snap.has(a.id) ? 1 : 0;
            const bS = snap.has(b.id) ? 1 : 0;
            return aS - bS;
          });
          setConcepts(sorted);
          setCursor(data.nextCursor);
          cursorRef.current = data.nextCursor;
        } finally {
          setLoading(false);
          loadingRef.current = false;
        }
      };
      load();
    }
  }, [concepts.length, category, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection observer for infinite scroll - only active when not searching
  useEffect(() => {
    if (searchResults !== null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          fetchMore();
        }
      },
      { threshold: 0.1, rootMargin: "400px" }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchMore, searchResults]);

  const displayedConcepts = searchResults !== null ? searchResults : concepts;

  return (
    <div className="feed-container">
      {/* Cards */}
      {displayedConcepts.map((concept, idx) => (
        <ConceptCard key={`${concept.id}-${idx}`} concept={concept} onSelect={onConceptSelect} isBookmarked={isBookmarked?.(concept.id)} onToggleBookmark={onToggleBookmark} />
      ))}

      {/* Search empty state */}
      {searchResults !== null && searchResults.length === 0 && (
        <div className="py-12 text-center text-[var(--muted)]">
          <p className="text-[15px]">No concepts found for &quot;{searchQuery}&quot;</p>
        </div>
      )}

      {/* Search result count */}
      {searchResults !== null && searchResults.length > 0 && (
        <div className="py-4 text-center text-[var(--muted)] text-[13px]">
          {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Loading trigger - only for infinite scroll mode */}
      <div ref={loaderRef} className="py-8 flex justify-center">
        {loading && searchResults === null && (
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}

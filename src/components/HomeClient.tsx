"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Category, Concept } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { ConceptSummary } from "@/lib/concepts";
import { Sidebar } from "@/components/Sidebar";
import { Feed } from "@/components/Feed";
import { RightSidebar } from "@/components/RightSidebar";
import { ConceptDetail } from "@/components/ConceptDetail";
import { AchievementToast } from "@/components/AchievementToast";
import { useProgress } from "@/lib/useProgress";

interface HomeClientProps {
  categories: { category: Category; count: number }[];
  totalCount: number;
  suggestionPool: ConceptSummary[];
  initialSuggestions: ConceptSummary[];
}

export function HomeClient({
  categories,
  totalCount,
  suggestionPool,
  initialSuggestions,
}: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileStatsOpen, setMobileStatsOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScrollRef = useRef(0);
  const progress = useProgress();

  // Load post from ?post= query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    if (!postId) return;
    fetch(`/api/concept?id=${encodeURIComponent(postId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.item) {
          setSelectedConcept(data.item);
          progress.markSeen(data.item.id, data.item.term, data.item.category);
        }
      })
      .catch(() => {});
    const onPopState = () => {
      const p = new URLSearchParams(window.location.search);
      const id = p.get("post");
      if (!id) {
        setSelectedConcept(null);
      } else {
        fetch(`/api/concept?id=${encodeURIComponent(id)}`)
          .then((r) => r.json())
          .then((d) => { if (d.item) setSelectedConcept(d.item); })
          .catch(() => {});
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectConcept = useCallback((concept: Concept) => {
    if (scrollRef.current) savedScrollRef.current = scrollRef.current.scrollTop;
    setSelectedConcept(concept);
    progress.markSeen(concept.id, concept.term, concept.category);
    window.history.pushState(null, "", `?post=${encodeURIComponent(concept.id)}`);
  }, [progress]);

  const handleBack = useCallback(() => {
    setSelectedConcept(null);
    window.history.pushState(null, "", window.location.pathname);
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = savedScrollRef.current;
    });
  }, []);

  const handleSelectRelated = useCallback(async (term: string) => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const match = data.items.find(
          (c: Concept) => c.term.toLowerCase() === term.toLowerCase()
        ) || data.items[0];
        setSelectedConcept(match);
        progress.markSeen(match.id, match.term, match.category);
        window.history.pushState(null, "", `?post=${encodeURIComponent(match.id)}`);
      }
    } catch {
      // silently fail
    }
  }, [progress]);

  return (
    <div className="flex justify-center h-dvh overflow-hidden">
      {/* Left sidebar - X style nav */}
      <div className="w-[275px] shrink-0 border-r border-[var(--border)] hidden lg:block overflow-y-auto">
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={categories}
        />
      </div>

      {/* Main feed column */}
      <main className="w-full max-w-[600px] border-r border-[var(--border)] flex flex-col min-h-0">
        {selectedConcept ? (
          /* Detail view - full screen post like X */
          <ConceptDetail concept={selectedConcept} onBack={handleBack} onSelectRelated={handleSelectRelated} />
        ) : (
          <>
            {/* Fixed header above scroll area */}
            <div className="shrink-0 bg-black">
              {/* Mobile: X Tabs style header */}
              <div className="lg:hidden">
                {/* Row 1: logo + progress */}
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <h1 className="text-[18px] font-bold text-white tracking-tight">infomaxxxing</h1>
                  <button
                    onClick={() => setMobileStatsOpen(!mobileStatsOpen)}
                    className="flex items-center gap-1.5 text-white hover:text-[var(--accent)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    {progress.seenCount > 0 && (
                      <span className="text-xs font-mono bg-[var(--accent)]/20 text-[var(--accent)] px-1.5 py-0.5 rounded-full">
                        {progress.seenCount}
                      </span>
                    )}
                  </button>
                </div>
                {/* Row 2: X-style underlined tabs - scrollable */}
                <div className="flex overflow-x-auto border-b border-[var(--border)]" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`shrink-0 px-4 py-3 text-[14px] transition-colors relative ${
                      activeCategory === null
                        ? "text-[var(--foreground)] font-bold"
                        : "text-[var(--muted)] font-medium"
                    }`}
                  >
                    For You
                    {activeCategory === null && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[var(--accent)] rounded-full" />
                    )}
                  </button>
                  {categories.map(({ category }) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`shrink-0 px-4 py-3 text-[14px] transition-colors relative whitespace-nowrap ${
                        activeCategory === category
                          ? "text-[var(--foreground)] font-bold"
                          : "text-[var(--muted)] font-medium"
                      }`}
                    >
                      {CATEGORY_META[category].label}
                      {activeCategory === category && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[var(--accent)] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {/* Feed label - desktop only */}
              <h2 className="px-4 py-3 text-[20px] font-bold text-[var(--foreground)] hidden lg:block border-b border-[var(--border)]">
                {searchQuery?.trim()
                  ? "Search"
                  : activeCategory
                    ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace("-", " ")}`
                    : "For You"}
              </h2>
            </div>

            {/* Scrollable feed area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain min-h-0">
              <Feed
                category={activeCategory}
                searchQuery={searchQuery}
                seenIds={progress.seenIds}
                onConceptSelect={handleSelectConcept}
              />
              {/* Mobile bottom spacer so content isn't hidden behind sticky banner */}
              <div className="h-12 lg:hidden" />
            </div>
          </>
        )}
      </main>

      {/* Right sidebar */}
      <div className="w-[275px] shrink-0 pl-4 pr-4 hidden xl:block overflow-y-auto">
        <RightSidebar
          totalCount={totalCount}
          suggestionPool={suggestionPool}
          initialSuggestions={initialSuggestions}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          seenCount={progress.seenCount}
          milestones={progress.milestones}
          celebratedMilestones={progress.celebratedMilestones}
        />
      </div>

      {/* Achievement toast */}
      {progress.pendingMilestone && (
        <AchievementToast
          milestone={progress.pendingMilestone}
          onDismiss={progress.dismissMilestone}
        />
      )}

      {/* Mobile stats dropdown */}
      {mobileStatsOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileStatsOpen(false)}
          />
          <div className="absolute top-14 right-3 left-3 bg-black border border-[var(--border)] rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-bold text-[var(--foreground)]">
                Your Progress
              </h3>
              <button
                onClick={() => setMobileStatsOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.71a1 1 0 00-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 001.42 1.42L12 13.41l4.88 4.89a1 1 0 001.42-1.42L13.41 12l4.89-4.88a1 1 0 000-1.41z" />
                </svg>
              </button>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[28px] font-bold text-[var(--foreground)]">{progress.seenCount}</span>
              <span className="text-[13px] text-[var(--muted)]">/ {totalCount} concepts</span>
            </div>
            <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((progress.seenCount / totalCount) * 100, 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {progress.milestones.map((m) => {
                const achieved = progress.celebratedMilestones.includes(m);
                return (
                  <span
                    key={m}
                    className={`text-[12px] px-2.5 py-1 rounded-full font-mono transition-colors ${
                      achieved
                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "bg-[var(--border)]/50 text-[var(--muted)]"
                    }`}
                  >
                    {achieved && "\u2713 "}{m}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop CTA - stacked rounded squares, bottom right */}
      <div className="hidden lg:flex fixed bottom-5 right-5 z-50 items-center gap-2.5">
        <a
          href="https://bootoshi.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50px] h-[50px] bg-black border border-[var(--border)] rounded-2xl flex items-center justify-center hover:border-[var(--muted)]/50 transition-colors"
          title="@KingBootoshi"
        >
          <img src="/avatar.png" alt="KingBootoshi" className="w-7 h-7 rounded-lg" style={{ imageRendering: "pixelated" }} />
        </a>
        <a
          href="https://x.com/KingBootoshi"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50px] h-[50px] bg-black border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--muted)]/50 transition-colors"
          title="Follow on X"
        >
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href="https://discord.gg/shnvZhmtRG"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50px] h-[50px] bg-black border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--muted)] hover:text-[#5865F2] hover:border-[#5865F2]/30 transition-colors"
          title="Join Discord"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
          </svg>
        </a>
      </div>

      {/* Mobile CTA - sticky bottom banner */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[var(--border)] px-4 py-2.5 flex items-center justify-center gap-4 safe-bottom">
        <a href="https://bootoshi.ai/" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--muted)] flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">by @KingBootoshi <img src="/avatar.png" alt="" className="w-4 h-4 rounded-md" style={{ imageRendering: "pixelated" as const }} /></a>
        <a
          href="https://x.com/KingBootoshi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[var(--background)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Follow
        </a>
        <a
          href="https://discord.gg/shnvZhmtRG"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#5865F2] rounded-full px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
          </svg>
          Join
        </a>
      </div>
    </div>
  );
}

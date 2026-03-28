"use client";

import { useState } from "react";
import { Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { ConceptSummary } from "@/lib/concepts";
import { Sidebar } from "@/components/Sidebar";
import { Feed } from "@/components/Feed";
import { RightSidebar } from "@/components/RightSidebar";

interface HomeClientProps {
  categories: { category: Category; count: number }[];
  totalCount: number;
  suggestionPool: ConceptSummary[];
}

export function HomeClient({
  categories,
  totalCount,
  suggestionPool,
}: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        {/* Fixed header above scroll area */}
        <div className="shrink-0 bg-black border-b border-[var(--border)]">
          {/* Mobile: title + category pills */}
          <div className="lg:hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-bold">infomaxxing</h1>
            </div>
            <div className="flex overflow-x-auto px-2 pb-2 gap-2" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-[var(--foreground)] text-black"
                    : "bg-[var(--card)] text-[var(--foreground)]"
                }`}
              >
                All
              </button>
              {categories.map(({ category }) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category ? null : category
                    )
                  }
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "text-white"
                      : "bg-[var(--card)] text-[var(--foreground)]"
                  }`}
                  style={
                    activeCategory === category
                      ? { backgroundColor: CATEGORY_META[category].color }
                      : undefined
                  }
                >
                  {CATEGORY_META[category].label}
                </button>
              ))}
            </div>
          </div>
          {/* Feed label - all screen sizes */}
          <h2 className="px-4 py-3 text-[20px] font-bold text-[var(--foreground)]">
            {searchQuery?.trim()
              ? "Search"
              : activeCategory
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace("-", " ")}`
                : "For You"}
          </h2>
        </div>

        {/* Scrollable feed area */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <Feed category={activeCategory} searchQuery={searchQuery} />
          {/* Mobile bottom spacer so content isn't hidden behind sticky banner */}
          <div className="h-12 lg:hidden" />
        </div>
      </main>

      {/* Right sidebar */}
      <div className="w-[350px] shrink-0 pl-6 pr-4 hidden xl:block overflow-y-auto">
        <RightSidebar
          totalCount={totalCount}
          suggestionPool={suggestionPool}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Desktop CTA - bottom right floating pill */}
      <div className="hidden lg:flex fixed bottom-5 right-5 z-50 items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2.5 shadow-lg">
        <span className="text-sm text-[var(--muted)]">by</span>
        <a
          href="https://x.com/KingBootoshi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @KingBootoshi
          <img src="/avatar.png" alt="" className="w-5 h-5 rounded-full" />
        </a>
        <span className="w-px h-4 bg-[var(--border)]" />
        <a
          href="https://discord.gg/shnvZhmtRG"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] hover:text-[#5865F2] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
          </svg>
          Discord
        </a>
      </div>

      {/* Mobile CTA - sticky bottom banner */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--card)] border-t border-[var(--border)] px-4 py-2.5 flex items-center justify-center gap-4">
        <span className="text-xs text-[var(--muted)] flex items-center gap-1.5">by @KingBootoshi <img src="/avatar.png" alt="" className="w-4 h-4 rounded-full" /></span>
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

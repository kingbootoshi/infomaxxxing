"use client";

import { useState, useMemo } from "react";
import { Category } from "@/lib/types";
import { concepts } from "@/data/concepts";
import { Sidebar } from "@/components/Sidebar";
import { Feed } from "@/components/Feed";
import { RightSidebar } from "@/components/RightSidebar";
import { CATEGORY_META } from "@/lib/types";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<Category, number>();
    for (const c of concepts) {
      counts.set(c.category, (counts.get(c.category) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

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
        </div>
      </main>

      {/* Right sidebar */}
      <div className="w-[350px] shrink-0 pl-6 pr-4 hidden xl:block overflow-y-auto">
        <RightSidebar concepts={concepts} searchQuery={searchQuery} onSearch={setSearchQuery} />
      </div>
    </div>
  );
}

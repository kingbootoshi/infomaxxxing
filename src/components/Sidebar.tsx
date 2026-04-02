"use client";

import { Category, CATEGORY_META } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

interface SidebarProps {
  activeCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
  categories: { category: Category; count: number }[];
  showBookmarks: boolean;
  onShowBookmarks: () => void;
  bookmarkCount: number;
}

export function Sidebar({
  activeCategory,
  onCategoryChange,
  categories,
  showBookmarks,
  onShowBookmarks,
  bookmarkCount,
}: SidebarProps) {
  return (
    <nav className="sticky top-0 h-screen flex flex-col justify-between py-3 px-2">
      <div className="space-y-0.5">
        {/* Logo */}
        <div className="px-3 py-3 mb-2">
          <h1 className="text-xl font-bold text-[var(--foreground)] uppercase">
            infoma<span className="text-[#ff1744]">xxx</span>ing
          </h1>
        </div>

        {/* All feed */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-full transition-colors text-left ${
            activeCategory === null && !showBookmarks
              ? "font-bold text-[var(--foreground)] bg-[var(--card)]"
              : "text-[var(--foreground)] hover:bg-[var(--card)]"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[26px] h-[26px]"
          >
            <path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L12 3.696l10.318 6.807 1.06-1.696L12 1.696zM12 16.984l-7.26-4.793-1.06 1.696L12 20.696l8.318-6.807-1.06-1.696L12 16.984z" />
          </svg>
          <span className="text-[20px]">All</span>
        </button>

        {/* Bookmarks */}
        <button
          onClick={onShowBookmarks}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-full transition-colors text-left ${
            showBookmarks
              ? "font-bold text-[var(--foreground)] bg-[var(--card)]"
              : "text-[var(--foreground)] hover:bg-[var(--card)]"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[26px] h-[26px]"
            style={{ color: showBookmarks ? "var(--accent)" : "currentColor" }}
          >
            {showBookmarks ? (
              <path fill="currentColor" d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z" />
            ) : (
              <path fill="currentColor" d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4C6.224 4 6 4.22 6 4.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
            )}
          </svg>
          <span className="text-[20px]">Bookmarks</span>
          {bookmarkCount > 0 && (
            <span className="text-[var(--muted)] text-sm ml-auto">
              {bookmarkCount}
            </span>
          )}
        </button>

        {/* Category nav items */}
        {categories.map(({ category, count }) => {
          const meta = CATEGORY_META[category];
          const isActive = activeCategory === category && !showBookmarks;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(isActive ? null : category)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-full transition-colors text-left ${
                isActive
                  ? "font-bold text-[var(--foreground)] bg-[var(--card)]"
                  : "text-[var(--foreground)] hover:bg-[var(--card)]"
              }`}
            >
              <div
                className="w-[26px] h-[26px] flex items-center justify-center"
                style={{ color: isActive ? meta.color : "currentColor" }}
              >
                <CategoryIcon category={category} />
              </div>
              <span className="text-[20px]">{meta.label}</span>
              <span className="text-[var(--muted)] text-sm ml-auto">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom info */}
      <div className="px-3 py-2 text-[13px] text-[var(--muted)]">
        Scroll to learn. Tap to expand.
      </div>
    </nav>
  );
}

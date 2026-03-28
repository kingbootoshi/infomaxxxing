"use client";

import { Concept, CATEGORY_META } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

function VerifiedBadge({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 22 22"
      className="w-[18px] h-[18px] shrink-0"
      style={{ color }}
    >
      <path
        fill="currentColor"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.893.143.636-.131 1.222-.437 1.69-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
      />
      <path
        fill="white"
        d="M9.585 14.929l-3.28-3.28 1.168-1.168 2.112 2.112 5.276-5.276 1.168 1.168z"
      />
    </svg>
  );
}

interface ConceptCardProps {
  concept: Concept;
  onSelect?: (concept: Concept) => void;
}

export function ConceptCard({ concept, onSelect }: ConceptCardProps) {
  const meta = CATEGORY_META[concept.category];

  return (
    <article
      className="border-b border-[var(--border)] px-4 py-3 hover:bg-[var(--hover)] transition-colors cursor-pointer"
      onClick={() => onSelect?.(concept)}
    >
      {/* Header row - avatar + name + handle */}
      <div className="flex gap-3">
        {/* Category avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: meta.color + "22", color: meta.color }}
        >
          <CategoryIcon category={concept.category} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[var(--foreground)] text-[15px] truncate">
              {concept.term}
            </span>
            <VerifiedBadge color={meta.color} />
            <span className="text-[var(--muted)] text-[15px]">
              @{concept.category}
            </span>
          </div>

          {/* One-liner "tweet" */}
          <p className="text-[var(--foreground)] text-[15px] leading-5 mt-0.5">
            {concept.oneLiner}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {concept.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: meta.color + "18",
                  color: meta.color,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom action bar - X style */}
          <div className="flex items-center justify-between mt-2 max-w-[425px]">
            {/* More indicator */}
            <button className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--accent)] transition-colors group text-[13px]">
              <div className="p-1.5 rounded-full group-hover:bg-[var(--accent)]/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              More
            </button>

            {/* Category label */}
            <span
              className="text-[13px] font-medium"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>

            {/* Related count */}
            <span className="text-[13px] text-[var(--muted)]">
              {concept.relatedTerms.length} related
            </span>

            {/* Share button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const url = `${window.location.origin}?post=${encodeURIComponent(concept.id)}`;
                if (navigator.share) {
                  navigator.share({ title: `${concept.term} - infomaxxxing`, url }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(url);
                }
              }}
              className="flex items-center text-[var(--muted)] hover:text-[var(--accent)] transition-colors group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-[var(--accent)]/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

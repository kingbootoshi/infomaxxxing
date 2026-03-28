"use client";

import { useState } from "react";
import { Concept, CATEGORY_META } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

function VerifiedBadge({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 22 22" className="w-5 h-5 shrink-0" style={{ color }}>
      <path
        fill="currentColor"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.893.143.636-.131 1.222-.437 1.69-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
      />
      <path fill="white" d="M9.585 14.929l-3.28-3.28 1.168-1.168 2.112 2.112 5.276-5.276 1.168 1.168z" />
    </svg>
  );
}

interface ConceptDetailProps {
  concept: Concept;
  onBack: () => void;
  onSelectRelated?: (term: string) => void;
}

export function ConceptDetail({ concept, onBack, onSelectRelated }: ConceptDetailProps) {
  const meta = CATEGORY_META[concept.category];
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}?post=${encodeURIComponent(concept.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${concept.term} - infomaxxxing`, url });
        return;
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with back arrow - like X's "Post" header */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-6 border-b border-[var(--border)] bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-[var(--foreground)] hover:bg-[var(--hover)] rounded-full p-2 -ml-2 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
          </svg>
        </button>
        <h2 className="text-[20px] font-bold text-[var(--foreground)]">Post</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main post */}
        <div className="px-4 pt-3 pb-3">
          {/* Author row */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: meta.color + "22", color: meta.color }}
            >
              <CategoryIcon category={concept.category} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[var(--foreground)] text-[15px]">
                  {concept.term}
                </span>
                <VerifiedBadge color={meta.color} />
              </div>
              <span className="text-[var(--muted)] text-[15px]">
                @{concept.category}
              </span>
            </div>
          </div>

          {/* Main content - larger text like X detail view */}
          <p className="text-[var(--foreground)] text-[17px] leading-relaxed">
            {concept.oneLiner}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {concept.tags.map((tag) => (
              <span
                key={tag}
                className="text-[13px] px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: meta.color + "18",
                  color: meta.color,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Info row - category, related count, share */}
          <div className="flex items-center gap-1 mt-3 pt-3 pb-3 border-t border-b border-[var(--border)] text-[var(--muted)] text-[15px]">
            <span style={{ color: meta.color }} className="font-medium">{meta.label}</span>
            <span className="mx-1">&middot;</span>
            <span>{concept.relatedTerms.length} related</span>
            <button
              onClick={handleShare}
              className="ml-auto text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-1.5 rounded-full hover:bg-[var(--accent)]/10 relative"
            >
              {copied ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Thread-style replies - the detailed content sections */}
        <div className="border-b border-[var(--border)]">
          {/* Body section */}
          <div className="px-4 py-3 flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: meta.color + "22", color: meta.color }}
              >
                <CategoryIcon category={concept.category} />
              </div>
              <div className="w-0.5 flex-1 bg-[var(--border)] mt-1" />
            </div>
            <div className="flex-1 min-w-0 pb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-bold text-[var(--foreground)] text-[15px]">{concept.term}</span>
                <VerifiedBadge color={meta.color} />
                <span className="text-[var(--muted)] text-[15px]">@{concept.category}</span>
              </div>
              <p className="text-[var(--foreground)] text-[15px] leading-relaxed">
                {concept.body}
              </p>
            </div>
          </div>
        </div>

        {/* Example section */}
        {concept.example && (
          <div className="border-b border-[var(--border)]">
            <div className="px-4 py-3 flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: meta.color + "22", color: meta.color }}
                >
                  <CategoryIcon category={concept.category} />
                </div>
                <div className="w-0.5 flex-1 bg-[var(--border)] mt-1" />
              </div>
              <div className="flex-1 min-w-0 pb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-[var(--foreground)] text-[15px]">{concept.term}</span>
                  <VerifiedBadge color={meta.color} />
                  <span className="text-[var(--muted)] text-[15px]">@{concept.category}</span>
                </div>
                <div className="bg-[var(--card)] rounded-xl p-3 mt-1">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5 font-semibold">
                    Example
                  </p>
                  <p className="text-[var(--foreground)] text-[14px] leading-relaxed font-mono">
                    {concept.example}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Why it matters section */}
        <div className="border-b border-[var(--border)]">
          <div className="px-4 py-3 flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: meta.color + "22", color: meta.color }}
              >
                <CategoryIcon category={concept.category} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-bold text-[var(--foreground)] text-[15px]">{concept.term}</span>
                <VerifiedBadge color={meta.color} />
                <span className="text-[var(--muted)] text-[15px]">@{concept.category}</span>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-3 mt-1">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5 font-semibold">
                  Why it matters
                </p>
                <p className="text-[var(--foreground)] text-[14px] leading-relaxed">
                  {concept.whyItMatters}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related terms */}
        {concept.relatedTerms.length > 0 && (
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-[13px] text-[var(--muted)] mb-2">Related concepts</p>
            <div className="flex flex-wrap gap-2">
              {concept.relatedTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => onSelectRelated?.(term)}
                  className="text-[13px] text-[var(--accent)] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom spacer for mobile CTA bar */}
        <div className="h-16 lg:hidden" />
      </div>
    </div>
  );
}

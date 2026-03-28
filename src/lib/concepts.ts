import { concepts } from "@/data/concepts";
import { Category, Concept } from "@/lib/types";

// Pick N random concepts without repeating within the same batch
function pickRandom(source: Concept[], count: number): Concept[] {
  const pool = [...source];
  const result: Concept[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

export function getConcepts(
  _cursor: number,
  limit: number,
  category?: Category
): { items: Concept[]; nextCursor: number | null } {
  const source = category
    ? concepts.filter((c) => c.category === category)
    : concepts;

  const items = pickRandom(source, limit);
  return { items, nextCursor: 1 };
}

export function getCategories(): { category: Category; count: number }[] {
  const counts = new Map<Category, number>();
  for (const c of concepts) {
    counts.set(c.category, (counts.get(c.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function searchConcepts(query: string): Concept[] {
  const q = query.toLowerCase();
  return concepts.filter(
    (c) =>
      c.term.toLowerCase().includes(q) ||
      c.oneLiner.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

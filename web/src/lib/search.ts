"use client";

import Fuse from "fuse.js";
import type { SearchDoc } from "./types";

let fuse: Fuse<SearchDoc> | null = null;
let indexCache: SearchDoc[] | null = null;

export async function getSearchEngine(): Promise<Fuse<SearchDoc>> {
  if (fuse) return fuse;

  if (!indexCache) {
    const res = await fetch("/search-index.json");
    indexCache = await res.json();
  }

  fuse = new Fuse(indexCache!, {
    keys: [
      { name: "title", weight: 3 },
      { name: "tldr", weight: 2 },
      { name: "category", weight: 1 },
      { name: "versionTags", weight: 0.5 },
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
  });

  return fuse;
}

export async function search(query: string): Promise<SearchDoc[]> {
  if (!query.trim()) return [];
  const engine = await getSearchEngine();
  return engine.search(query).map((r) => r.item);
}

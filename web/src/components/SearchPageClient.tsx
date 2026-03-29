"use client";

import { useEffect, useState, use } from "react";
import { search } from "@/lib/search";
import type { SearchDoc } from "@/lib/types";
import Link from "next/link";
import SearchBar from "./SearchBar";

interface Props {
  searchParamsPromise: Promise<{ q?: string }>;
}

export default function SearchPageClient({ searchParamsPromise }: Props) {
  const searchParams = use(searchParamsPromise);
  const initialQuery = searchParams.q ?? "";
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!initialQuery) { setDone(true); return; }
    search(initialQuery).then((r) => { setResults(r); setDone(true); });
  }, [initialQuery]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <SearchBar autoFocus />

      {initialQuery && (
        <p className="text-[#888] text-sm">
          {done ? (
            results.length > 0
              ? `${results.length} results for "${initialQuery}"`
              : `No results for "${initialQuery}"`
          ) : "Searching…"}
        </p>
      )}

      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r._id}>
            <Link
              href={`/${r.categorySlug}/${r.slug}`}
              className="block rounded-xl border border-[#363636] bg-[#242424] px-5 py-4 hover:border-[#e87d0d] hover:bg-[#2a2a2a] transition-all space-y-1"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{r.title}</span>
                <span className="text-xs text-[#888] bg-[#363636] rounded px-2 py-0.5">{r.category}</span>
                {r.versionTags?.map((v) => (
                  <span key={v} className="text-xs text-[#888] bg-[#363636] rounded px-2 py-0.5">{v}</span>
                ))}
              </div>
              <p className="text-sm text-[#888]">{r.tldr}</p>
            </Link>
          </li>
        ))}
      </ul>

      {!initialQuery && (
        <p className="text-center text-[#888] py-12">
          Type something to search…
        </p>
      )}
    </div>
  );
}

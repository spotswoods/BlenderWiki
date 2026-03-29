"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { search } from "@/lib/search";
import type { SearchDoc } from "@/lib/types";
import Link from "next/link";

interface Props {
  autoFocus?: boolean;
  compact?: boolean;
}

export default function SearchBar({ autoFocus, compact }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const r = await search(query);
      setResults(r.slice(0, 8));
      setOpen(r.length > 0);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={compact ? "Search…" : "Search modifiers, nodes, tools… (e.g. 'round edges')"}
          autoFocus={autoFocus}
          className={`w-full rounded-lg border border-[#363636] bg-[#242424] text-[#d4d4d4] placeholder-[#888] outline-none focus:border-[#e87d0d] transition-colors ${
            compact ? "h-8 px-3 text-sm" : "h-12 px-4 text-base"
          }`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#e87d0d] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-50 w-full mt-1 rounded-xl border border-[#363636] bg-[#1e1e1e] shadow-2xl overflow-hidden">
          {results.map((r) => (
            <li key={r._id}>
              <Link
                href={`/${r.categorySlug}/${r.slug}`}
                onClick={() => { setOpen(false); setQuery(""); }}
                className="flex flex-col px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="font-medium text-sm">{r.title}</span>
                <span className="text-xs text-[#888] truncate">{r.tldr}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs text-[#e87d0d] hover:bg-[#2a2a2a] border-t border-[#363636] transition-colors"
            >
              See all results for &quot;{query}&quot; →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

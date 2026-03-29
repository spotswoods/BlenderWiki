"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const isHomePage = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#363636] bg-[#1a1a1a]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-[#e87d0d] font-bold text-lg tracking-tight">
            Blender<span className="text-white">Wiki</span>
          </span>
        </Link>

        {/* Inline search (hidden on home and search pages) */}
        {!isSearchPage && !isHomePage && (
          <div className="flex-1 max-w-sm hidden sm:block">
            <SearchBar compact />
          </div>
        )}

        <div className="ml-auto flex items-center gap-4 text-sm text-[#888]">
          <a
            href="https://www.blender.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e87d0d] transition-colors"
          >
            Blender.org ↗
          </a>
        </div>
      </div>
    </nav>
  );
}

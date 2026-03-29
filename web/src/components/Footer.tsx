import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-[#555]">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-bold">
            <span className="text-[#e87d0d]">Blender</span>
            <span className="text-[#555]">Wiki</span>
          </span>
          <span className="text-[#3a3a3a]">—</span>
          <span>Free, always.</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/contribute" className="hover:text-[#888] transition-colors">
            Contribute
          </Link>
          <Link href="/tracker" className="hover:text-[#888] transition-colors">
            Tracker
          </Link>
          <a
            href="https://github.com/spotswoods/blenderpage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#888] transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.blender.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#888] transition-colors"
          >
            Blender.org ↗
          </a>
        </div>

        {/* Feedback nudge */}
        <p className="text-[#444] text-xs text-center sm:text-right">
          Something wrong or unclear?{" "}
          <a
            href="https://github.com/spotswoods/blenderpage/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#555] hover:text-[#888] underline underline-offset-2 transition-colors"
          >
            Open an issue ↗
          </a>
        </p>
      </div>
    </footer>
  );
}

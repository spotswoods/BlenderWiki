import { client, TRACKER_QUERY } from "@/lib/sanity";
import type { TrackerFlags } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Content Tracker" };
export const revalidate = 60;

interface TrackerPage {
  _id: string;
  title: string;
  slug: { current: string };
  trackerFlags: TrackerFlags;
  category?: { slug: { current: string } };
}

export default async function TrackerPage() {
  const pages = (await client.fetch<TrackerPage[]>(TRACKER_QUERY).catch(() => null)) ?? [];

  const needsHero = pages.filter((p) => p.trackerFlags?.needsHero);
  const needsUI = pages.filter((p) => p.trackerFlags?.needsUI);
  const needsExamples = pages.filter((p) => p.trackerFlags?.needsExamples);
  const complete = pages.filter(
    (p) => !p.trackerFlags?.needsHero && !p.trackerFlags?.needsUI && !p.trackerFlags?.needsExamples
  );

  const total = pages.length;
  const pct = total > 0 ? Math.round((complete.length / total) * 100) : 0;

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Content Tracker</h1>
        <p className="text-[#888]">Your production dashboard. Pick a flag, open Blender, ship.</p>
      </header>

      {/* Progress bar */}
      <div className="rounded-xl border border-[#363636] bg-[#242424] p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#888]">Overall completion</span>
          <span className="font-semibold text-[#e87d0d]">{complete.length} / {total} pages complete</span>
        </div>
        <div className="h-2 rounded-full bg-[#363636] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#e87d0d] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[#888]">{pct}%</p>
      </div>

      {/* Buckets */}
      <TrackerBucket
        emoji="🔴"
        label="To Record — Needs Hero Video"
        pages={needsHero}
        color="red"
      />
      <TrackerBucket
        emoji="🟡"
        label="To Screenshot — Needs UI Update"
        pages={needsUI}
        color="yellow"
      />
      <TrackerBucket
        emoji="🔵"
        label="To Build — Needs .Blend File"
        pages={needsExamples}
        color="blue"
      />
      <TrackerBucket
        emoji="✅"
        label="Complete"
        pages={complete}
        color="green"
        collapsed
      />
    </div>
  );
}

function TrackerBucket({
  emoji,
  label,
  pages,
  color,
  collapsed = false,
}: {
  emoji: string;
  label: string;
  pages: TrackerPage[];
  color: "red" | "yellow" | "blue" | "green";
  collapsed?: boolean;
}) {
  const colorMap = {
    red: "border-red-800 text-red-400",
    yellow: "border-yellow-800 text-yellow-400",
    blue: "border-blue-800 text-blue-400",
    green: "border-green-800 text-green-400",
  };

  if (pages.length === 0) return null;

  return (
    <section className={`rounded-xl border bg-[#242424] overflow-hidden ${colorMap[color].split(" ")[0]}`}>
      <div className={`px-5 py-4 border-b border-[#363636] flex items-center justify-between`}>
        <h2 className={`font-semibold ${colorMap[color].split(" ")[1]}`}>
          {emoji} {label}
        </h2>
        <span className="text-sm text-[#888]">{pages.length} pages</span>
      </div>
      {!collapsed && (
        <ul className="divide-y divide-[#363636]">
          {pages.map((p) => (
            <li key={p._id}>
              <Link
                href={`/${p.category?.slug?.current ?? "unknown"}/${p.slug.current}`}
                className="flex items-center px-5 py-3 hover:bg-[#2a2a2a] transition-colors group"
              >
                <span className="group-hover:text-[#e87d0d] transition-colors">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

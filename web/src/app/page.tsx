import { client } from "@/lib/sanity";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export const revalidate = 3600;

const STATS_QUERY = `{
  "pages": count(*[_type == "referencePage"]),
  "gotchas": count(*[_type == "gotcha"])
}`;

const CATEGORY_COUNTS_QUERY = `
  *[_type == "category"] | order(sortOrder asc, title asc) {
    _id, title, slug, icon, description,
    "count": count(*[_type == "referencePage" && references(^._id)])
  }
`;

// Fallback descriptions for categories that don't have one set in Sanity yet
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "generate":        "Add new geometry — arrays, mirrors, extrusions",
  "deform":          "Bend, twist, and reshape existing geometry",
  "modify":          "Clean up, remesh, and adjust mesh topology",
  "physics":         "Simulate cloth, soft bodies, and collisions",
  "shader-nodes":    "Control how a surface looks — colour, gloss, transparency",
  "geometry-nodes":  "Build and manipulate geometry procedurally",
  "edit-mode-tools": "Direct mesh editing with in-viewport operations",
};

interface CategoryWithCount {
  _id: string;
  title: string;
  slug: { current: string };
  icon?: string;
  description?: string;
  count: number;
}

interface Stats {
  pages: number;
  gotchas: number;
}

export default async function HomePage() {
  const [categories, stats] = await Promise.all([
    client.fetch<CategoryWithCount[]>(CATEGORY_COUNTS_QUERY).catch(() => null),
    client.fetch<Stats>(STATS_QUERY).catch(() => null),
  ]);

  // De-duplicate by slug in case a user manually created a second category with the same name
  const seen = new Set<string>();
  const cats = (categories ?? []).filter((c) => {
    if (seen.has(c.slug.current)) return false;
    seen.add(c.slug.current);
    return true;
  });

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="text-center pt-12 pb-4 space-y-5">
        <div className="inline-flex items-center gap-2 text-xs text-[#e87d0d] bg-[#e87d0d]/10 border border-[#e87d0d]/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e87d0d] animate-pulse inline-block" />
          Early access &mdash; {stats?.pages ?? 0} tools documented so far
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          The Visual Blender Reference
        </h1>
        <p className="text-lg text-[#888] max-w-xl mx-auto leading-relaxed">
          Every modifier, node, and tool &mdash; explained in plain English with short demos and downloadable .blend files.
        </p>
        <div className="max-w-lg mx-auto pt-1">
          <SearchBar autoFocus />
        </div>
        <p className="text-xs text-[#555]">
          Try &ldquo;round edges&rdquo;, &ldquo;scatter objects&rdquo;, or &ldquo;make glass&rdquo;
        </p>
      </section>

      {/* Stats strip — Free first, most trust-building */}
      {stats && (
        <div className="flex items-center justify-center gap-10 border-y border-[#2a2a2a] py-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">Free</p>
            <p className="text-xs text-[#666] mt-0.5 uppercase tracking-wider">Always</p>
          </div>
          <div className="w-px h-8 bg-[#2a2a2a]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#e87d0d]">{stats.pages}</p>
            <p className="text-xs text-[#666] mt-0.5 uppercase tracking-wider">Tools documented</p>
          </div>
          <div className="w-px h-8 bg-[#2a2a2a]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#e87d0d]">{stats.gotchas}</p>
            <p className="text-xs text-[#666] mt-0.5 uppercase tracking-wider">Common mistakes solved</p>
          </div>
        </div>
      )}

      {/* New to Blender callout */}
      <section className="rounded-xl border border-[#e87d0d]/25 bg-[#e87d0d]/5 px-6 py-5 flex items-start gap-4">
        <span className="text-2xl shrink-0 mt-0.5">👋</span>
        <div>
          <p className="font-semibold text-[#e87d0d] mb-1">New to modifiers?</p>
          <p className="text-sm text-[#888] mb-3 leading-relaxed">
            These two are the most common and easiest to understand &mdash; good starting points before exploring the rest.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/generate/subdivision-surface"
              className="text-sm bg-[#1f1f1f] border border-[#363636] hover:border-[#e87d0d] hover:text-white rounded-lg px-3 py-1.5 transition-all"
            >
              Subdivision Surface →
            </Link>
            <Link
              href="/edit-mode-tools/bevel"
              className="text-sm bg-[#1f1f1f] border border-[#363636] hover:border-[#e87d0d] hover:text-white rounded-lg px-3 py-1.5 transition-all"
            >
              Bevel (Edit Mode) →
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">
          Browse by Category
        </h2>
        {cats.length === 0 ? (
          <p className="text-[#888]">No categories yet — add them in Sanity Studio.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cats.map((cat) => {
              const desc =
                cat.description ?? CATEGORY_DESCRIPTIONS[cat.slug.current] ?? null;
              return (
                <Link
                  key={cat._id}
                  href={`/${cat.slug.current}`}
                  className="group relative flex flex-col gap-3 rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-5 hover:border-[#e87d0d]/60 hover:bg-[#242424] transition-all duration-200"
                >
                  {/* Icon */}
                  {cat.icon ? (
                    <div
                      className="w-7 h-7 text-[#e87d0d] opacity-80 group-hover:opacity-100 transition-opacity"
                      dangerouslySetInnerHTML={{ __html: cat.icon }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-[#e87d0d]/10 border border-[#e87d0d]/20 flex items-center justify-center text-[#e87d0d] text-xs font-bold">
                      {cat.title.charAt(0)}
                    </div>
                  )}

                  {/* Text */}
                  <div className="space-y-1 flex-1">
                    <span className="font-semibold text-[#d4d4d4] group-hover:text-white transition-colors block leading-snug">
                      {cat.title}
                    </span>
                    {desc && (
                      <p className="text-xs text-[#666] leading-relaxed">{desc}</p>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#2a2a2a]">
                    {cat.count > 0 ? (
                      <span className="text-xs text-[#555]">{cat.count} tools</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[#3a3a3a] group-hover:text-[#e87d0d] transition-colors text-base leading-none">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

import { client, REFERENCE_PAGE_QUERY, ALL_CATEGORIES_QUERY, CATEGORY_WITH_PAGES_QUERY, SIBLING_PAGES_QUERY } from "@/lib/sanity";
import type { Category, ReferencePage } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import HeroMedia from "@/components/HeroMedia";
import HotspotImage from "@/components/HotspotImage";
import GotchaCard from "@/components/GotchaCard";
import VersionedSettings from "@/components/VersionedSettings";

export const revalidate = 3600;

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

interface PageStub {
  _id: string;
  title: string;
  slug: { current: string };
  tldr: string;
  versionTags: string[];
  trackerFlags: import("@/lib/types").TrackerFlags;
}

export async function generateStaticParams() {
  const categories = await client.fetch<Category[]>(ALL_CATEGORIES_QUERY).catch(() => null);
  const all: { category: string; slug: string }[] = [];

  for (const cat of categories ?? []) {
    const data = await client
      .fetch<Category & { pages: PageStub[] }>(CATEGORY_WITH_PAGES_QUERY, { slug: cat.slug.current })
      .catch(() => null);
    if (data?.pages) {
      for (const p of data.pages) {
        all.push({ category: cat.slug.current, slug: p.slug.current });
      }
    }
  }
  return all;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await client
    .fetch<ReferencePage>(REFERENCE_PAGE_QUERY, { slug })
    .catch(() => null);
  if (!page) return {};
  return {
    title: page.title,
    description: page.tldr,
  };
}

export default async function ReferencePageView({ params }: Props) {
  const { category, slug } = await params;
  const page = await client
    .fetch<ReferencePage>(REFERENCE_PAGE_QUERY, { slug })
    .catch(() => null);

  if (!page) notFound();

  // Sibling pages for prev/next nav
  const siblings = page.category?._id
    ? await client.fetch<{ _id: string; title: string; slug: { current: string } }[]>(
        SIBLING_PAGES_QUERY, { categoryId: page.category._id }
      ).catch(() => null) ?? []
    : [];
  const currentIdx = siblings.findIndex((s) => s.slug.current === slug);
  const prevPage = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextPage = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  const hasGotchas = page.linkedGotchas?.length > 0;
  const hasUseCases = page.useCases?.length > 0;

  return (
    <article className="max-w-4xl mx-auto space-y-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#888]">
        <Link href="/" className="hover:text-[#e87d0d]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${category}`} className="hover:text-[#e87d0d]">
          {page.category?.title ?? category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#d4d4d4]">{page.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-4xl font-bold">{page.title}</h1>
          {page.targetVersion && (
            <span className="text-xs bg-[#e87d0d]/10 border border-[#e87d0d]/30 text-[#e87d0d] rounded-full px-3 py-1 mt-1.5 font-mono">
              Blender {page.targetVersion}
            </span>
          )}
        </div>

        {page.tldr && (
          <p className="text-lg text-[#aaa] leading-relaxed">{page.tldr}</p>
        )}

        {/* Hotkeys — shown right under the title so they're easy to spot */}
        {page.hotkeys?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#666]">Shortcut:</span>
            {page.hotkeys.map((key, i) => (
              <span key={i} className="kbd">{key}</span>
            ))}
          </div>
        )}
      </header>

      {/* Hero Media — collapsed placeholder when missing, not a giant box */}
      {page.heroMedia ? (
        <HeroMedia media={page.heroMedia} title={page.title} />
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#2d2d2d] px-5 py-3 text-sm text-[#555]">
          <span>🎬</span>
          <span>Demo video not yet added — check back soon.</span>
        </div>
      )}

      {/* Use Cases */}
      {hasUseCases && (
        <section className="space-y-5">
          <h2 className="text-xl font-semibold border-b border-[#363636] pb-3">Common Use Cases</h2>
          <div className="grid gap-5">
            {page.useCases.map((uc, i) => (
              <div key={i} className="rounded-xl border border-[#363636] bg-[#1f1f1f] overflow-hidden">
                {uc.media && (
                  <HeroMedia media={uc.media} title={uc.title} />
                )}
                <div className="p-5 space-y-1">
                  <h3 className="font-semibold text-[#e87d0d]">{uc.title}</h3>
                  <p className="text-[#aaa] text-sm leading-relaxed">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Settings Panel — version-aware */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[#363636] pb-3">
          Settings Panel
          {(page.settingsUI || page.versionHistory?.some((v) => v.settingsUI)) && (
            <span className="ml-2 text-sm font-normal text-[#666]">
              — hover the dots to see what each setting does
            </span>
          )}
        </h2>
        <VersionedSettings
          defaultUI={page.settingsUI}
          versions={page.versionHistory}
          title={page.title}
          targetVersion={page.targetVersion}
        />
      </section>

      {/* Gotchas */}
      {hasGotchas && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-[#363636] pb-3">
            ⚠️ Common Gotchas
          </h2>
          <div className="grid gap-4">
            {page.linkedGotchas.map((g) => (
              <GotchaCard key={g._id} gotcha={g} />
            ))}
          </div>
        </section>
      )}

      {/* Download */}
      <section className="flex items-center justify-between rounded-xl border border-[#363636] bg-[#1f1f1f] px-6 py-4">
        <div>
          <p className="font-semibold">Practice .blend File</p>
          <p className="text-sm text-[#888]">Open in Blender and follow along</p>
        </div>
        {page.downloadAsset?.asset?.url ? (
          <a
            href={page.downloadAsset.asset.url}
            download
            className="rounded-lg bg-[#e87d0d] hover:bg-[#d06a00] text-white font-semibold px-5 py-2.5 transition-colors"
          >
            Download
          </a>
        ) : (
          <span className="rounded-lg bg-[#2a2a2a] border border-[#363636] text-[#666] font-semibold px-5 py-2.5 cursor-not-allowed text-sm">
            Coming Soon
          </span>
        )}
      </section>

      {/* Official Docs — prominent card, not buried small text */}
      {page.docsUrl && (
        <a
          href={page.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-xl border border-[#363636] bg-[#1f1f1f] hover:border-[#e87d0d]/60 hover:bg-[#242424] px-6 py-4 transition-all"
        >
          <div>
            <p className="font-semibold group-hover:text-[#e87d0d] transition-colors">
              Official Blender Documentation
            </p>
            <p className="text-sm text-[#666]">Full technical reference and every parameter explained</p>
          </div>
          <span className="text-[#555] group-hover:text-[#e87d0d] transition-colors text-xl shrink-0 ml-4">↗</span>
        </a>
      )}

      {/* Community feedback */}
      <section className="rounded-xl border border-[#2d2d2d] bg-[#1a1a1a] px-6 py-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">💬</span>
          <h3 className="font-semibold text-sm text-[#d4d4d4]">Was this page helpful?</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://github.com/spotswoods/blenderpage/issues/new?template=suggest-improvement.yml&title=Improvement%3A+${encodeURIComponent(page.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm border border-[#363636] bg-[#242424] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2 transition-all"
          >
            ✏️ Suggest a better explanation
          </a>
          <a
            href={`https://github.com/spotswoods/blenderpage/issues/new?template=didnt-understand.yml&title=Confusing%3A+${encodeURIComponent(page.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm border border-[#363636] bg-[#242424] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2 transition-all"
          >
            🤔 I didn&apos;t understand this
          </a>
          <a
            href={`https://github.com/spotswoods/blenderpage/issues/new?template=new-example.yml&title=Example%3A+${encodeURIComponent(page.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm border border-[#363636] bg-[#242424] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2 transition-all"
          >
            📎 Submit an example
          </a>
        </div>
        <p className="text-xs text-[#555]">
          Opens a GitHub issue pre-filled with this page &mdash; no account needed to browse, free to create one.
        </p>
      </section>

      {/* Prev / Next navigation */}
      {(prevPage || nextPage) && (
        <nav className="grid grid-cols-2 gap-4 border-t border-[#2a2a2a] pt-8">
          {prevPage ? (
            <Link
              href={`/${category}/${prevPage.slug.current}`}
              className="group flex flex-col gap-1 rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] px-5 py-4 hover:border-[#e87d0d]/60 transition-all"
            >
              <span className="text-xs text-[#666]">← Previous</span>
              <span className="font-medium group-hover:text-[#e87d0d] transition-colors">
                {prevPage.title}
              </span>
            </Link>
          ) : <div />}
          {nextPage ? (
            <Link
              href={`/${category}/${nextPage.slug.current}`}
              className="group flex flex-col gap-1 rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] px-5 py-4 hover:border-[#e87d0d]/60 transition-all text-right"
            >
              <span className="text-xs text-[#666]">Next →</span>
              <span className="font-medium group-hover:text-[#e87d0d] transition-colors">
                {nextPage.title}
              </span>
            </Link>
          ) : <div />}
        </nav>
      )}
    </article>
  );
}

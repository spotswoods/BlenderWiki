import { client, CATEGORY_WITH_PAGES_QUERY, ALL_CATEGORIES_QUERY } from "@/lib/sanity";
import type { Category, ReferencePage } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await client.fetch<Category[]>(ALL_CATEGORIES_QUERY).catch(() => null);
  return (categories ?? []).map((c) => ({ category: c.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = await client.fetch<{ title: string }>(CATEGORY_WITH_PAGES_QUERY, { slug: category }).catch(() => null);
  if (!data) return {};
  return { title: data.title };
}

interface PageStub {
  _id: string;
  title: string;
  slug: { current: string };
  tldr: string;
  versionTags: string[];
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = await client
    .fetch<Category & { pages: PageStub[] }>(CATEGORY_WITH_PAGES_QUERY, { slug: category })
    .catch(() => null);

  if (!data) notFound();

  const pages = data.pages ?? [];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#888]">
        <Link href="/" className="hover:text-[#e87d0d]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#d4d4d4]">{data.title}</span>
      </nav>

      {/* Category header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {data.description && (
          <p className="text-[#888] text-base">{data.description}</p>
        )}
        <p className="text-xs text-[#555]">{pages.length} tools</p>
      </div>

      {pages.length === 0 ? (
        <p className="text-[#888]">No pages yet — add them in Sanity Studio.</p>
      ) : (
        <div className="grid gap-2">
          {pages.map((page) => (
            <Link
              key={page._id}
              href={`/${category}/${page.slug.current}`}
              className="group flex items-start justify-between gap-4 rounded-lg border border-[#2d2d2d] bg-[#1f1f1f] px-5 py-4 hover:border-[#e87d0d]/60 hover:bg-[#242424] transition-all"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium group-hover:text-[#e87d0d] transition-colors">
                    {page.title}
                  </span>
                  {page.versionTags?.map((v) => (
                    <span key={v} className="text-xs bg-[#2a2a2a] border border-[#363636] rounded px-2 py-0.5 text-[#666]">
                      {v}
                    </span>
                  ))}
                </div>
                {page.tldr && (
                  <p className="text-sm text-[#666] truncate">{page.tldr}</p>
                )}
              </div>
              <span className="text-[#3a3a3a] group-hover:text-[#e87d0d] transition-colors text-base shrink-0 mt-0.5">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

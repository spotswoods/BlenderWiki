import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-01-01";

export const isConfigured = /^[a-z0-9-]+$/.test(projectId);

// Real client when configured; a no-op stub otherwise so builds succeed without credentials.
const _client = isConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

// Wrapper that silently returns a typed empty value when Sanity is not configured.
export const client = {
  fetch<T>(query: string, params?: Record<string, string>): Promise<T> {
    if (!_client) return Promise.resolve(undefined as unknown as T);
    if (params) return _client.fetch<T>(query, params);
    return _client.fetch<T>(query);
  },
};

const builder = isConfigured ? imageUrlBuilder(_client!) : null;

// Chainable stub that matches ImageUrlBuilder method signatures used in the codebase.
const stubBuilder = {
  width: (_w: number) => stubBuilder,
  height: (_h: number) => stubBuilder,
  url: () => "",
};

export function urlFor(source: SanityImageSource) {
  if (!builder) return stubBuilder;
  return builder.image(source) as typeof stubBuilder & ReturnType<typeof builder.image>;
}

// ── Queries ──────────────────────────────────────────────────────────────────

export const ALL_CATEGORIES_QUERY = `
  *[_type == "category"] | order(sortOrder asc, title asc) {
    _id, title, slug, icon, description
  }
`;

export const CATEGORY_WITH_PAGES_QUERY = `
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, slug, icon, description,
    "pages": *[_type == "referencePage" && references(^._id)] | order(title asc) {
      _id, title, slug, tldr, versionTags, trackerFlags
    }
  }
`;

export const REFERENCE_PAGE_QUERY = `
  *[_type == "referencePage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    targetVersion,
    versionHistory[] {
      version,
      changes,
      settingsUI
    },
    versionTags,
    tldr,
    hotkeys,
    heroMedia,
    useCases,
    settingsUI,
    downloadAsset,
    trackerFlags,
    category-> { _id, title, slug },
    linkedGotchas[]-> {
      _id, internalName, symptom, solution, visualAid
    },
    docsUrl
  }
`;

export const ALL_PAGES_FOR_SEARCH_QUERY = `
  *[_type == "referencePage"] {
    _id,
    title,
    "slug": slug.current,
    tldr,
    versionTags,
    "category": category->title,
    "categorySlug": category->slug.current
  }
`;

export const TRACKER_QUERY = `
  *[_type == "referencePage"] | order(title asc) {
    _id, title, slug, trackerFlags,
    category-> { slug }
  }
`;

export const SIBLING_PAGES_QUERY = `
  *[_type == "referencePage" && references($categoryId)] | order(title asc) {
    _id, title, slug
  }
`;

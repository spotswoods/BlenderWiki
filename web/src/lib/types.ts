export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  icon?: string;
  description?: string;
}

export interface Gotcha {
  _id: string;
  internalName: string;
  symptom: string;
  solution: PortableTextBlock[];
  visualAid?: SanityMedia;
}

export interface UseCase {
  title: string;
  description: string;
  media?: SanityMedia;
}

export interface TrackerFlags {
  needsHero: boolean;
  needsUI: boolean;
  needsExamples: boolean;
}

export interface ReferencePage {
  _id: string;
  title: string;
  slug: { current: string };
  category: Category;
  versionTags: string[];
  tldr: string;
  hotkeys: string[];
  heroMedia?: SanityMedia;
  useCases: UseCase[];
  settingsUI?: SanityMedia;
  linkedGotchas: Gotcha[];
  downloadAsset?: { asset: { url: string } };
  trackerFlags: TrackerFlags;
  docsUrl?: string;
}

export interface SanityMedia {
  _type: "image" | "file";
  asset: {
    _ref: string;
    url?: string;
  };
  alt?: string;
}

// Sanity PortableText blocks — intentionally loose-typed
export type PortableTextBlock = { _type: string; [key: string]: unknown };

export interface SearchDoc {
  _id: string;
  title: string;
  slug: string;
  tldr: string;
  versionTags: string[];
  category: string;
  categorySlug: string;
}

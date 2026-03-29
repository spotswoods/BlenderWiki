import { defineType, defineField } from "sanity";

export const referencePage = defineType({
  name: "referencePage",
  title: "Reference Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Meta & Tracker" },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Array", "Bevel", "Principled BSDF"',
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "versionTags",
      title: "Version Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: 'e.g. ["4.0", "4.1", "4.2"]',
      group: "meta",
    }),

    // ── Content ───────────────────────────────────────────────────
    defineField({
      name: "tldr",
      title: "TL;DR",
      type: "string",
      description: "Max 150 characters. One plain-English sentence. No jargon.",
      group: "content",
      validation: (R) => R.required().max(150),
    }),
    defineField({
      name: "hotkeys",
      title: "Hotkeys",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: 'e.g. ["Ctrl", "A"] or ["Shift", "D"]',
      group: "content",
    }),

    // ── Media ─────────────────────────────────────────────────────
    defineField({
      name: "heroMedia",
      title: "Hero Media",
      type: "image",
      description: "5-second MP4 or looping GIF showing the tool in action. No intro. No text. Just the result.",
      options: { accept: "video/mp4,video/webm,image/gif,image/*" },
      group: "media",
    }),
    defineField({
      name: "useCases",
      title: "Use Cases",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          name: "useCase",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", title: "Description", rows: 3 },
            {
              name: "media",
              type: "image",
              title: "Media",
              options: { accept: "video/mp4,image/gif,image/*" },
            },
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "settingsUI",
      title: "Settings UI Screenshot",
      type: "image",
      description: "Screenshot of the modifier/node panel. Hotspots will be added via the website.",
      group: "media",
    }),

    // ── Files ─────────────────────────────────────────────────────
    defineField({
      name: "downloadAsset",
      title: "Download .blend File",
      type: "file",
      description: "The .blend file containing the exact setups from the GIFs.",
      options: { accept: ".blend" },
      group: "media",
    }),

    // ── Relations ─────────────────────────────────────────────────
    defineField({
      name: "linkedGotchas",
      title: "Linked Gotchas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "gotcha" }] }],
      description: "Link global Gotcha entries. The fix appears on this page automatically.",
      group: "content",
    }),

    // ── External Link ─────────────────────────────────────────────
    defineField({
      name: "docsUrl",
      title: "Official Docs URL",
      type: "url",
      description: "Link to the official Blender documentation page for this tool.",
      group: "meta",
    }),

    // ── Tracker ───────────────────────────────────────────────────
    defineField({
      name: "trackerFlags",
      title: "Production Tracker",
      type: "object",
      group: "meta",
      description: "Use the tracker dashboard (/tracker) to see your production queue.",
      fields: [
        {
          name: "needsHero",
          title: "🔴 Needs Hero Video",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "needsUI",
          title: "🟡 Needs UI Screenshot",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "needsExamples",
          title: "🔵 Needs .Blend File",
          type: "boolean",
          initialValue: true,
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      needsHero: "trackerFlags.needsHero",
      needsUI: "trackerFlags.needsUI",
      needsExamples: "trackerFlags.needsExamples",
    },
    prepare({ title, subtitle, needsHero, needsUI, needsExamples }) {
      const flags = [
        needsHero ? "🔴" : "",
        needsUI ? "🟡" : "",
        needsExamples ? "🔵" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return {
        title: `${flags ? flags + " " : ""}${title}`,
        subtitle,
      };
    },
  },
});

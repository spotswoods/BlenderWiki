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
      name: "targetVersion",
      title: "Written for Blender",
      type: "string",
      description: 'The Blender version this page is primarily accurate for, e.g. "4.2"',
      group: "meta",
    }),
    defineField({
      name: "versionHistory",
      title: "Version History",
      type: "array",
      description: "Add an entry whenever this tool changes in a new Blender release. Each entry gets its own settings screenshot and change summary so users can switch between them on the page.",
      group: "meta",
      of: [
        {
          type: "object",
          name: "versionEntry",
          fields: [
            defineField({
              name: "version",
              title: "Blender Version",
              type: "string",
              description: 'e.g. "4.1", "3.6"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: "changes",
              title: "What changed in this version",
              type: "text",
              rows: 2,
              description: "Plain English — what was added, removed, or renamed?",
            }),
            defineField({
              name: "settingsUI",
              title: "Settings Screenshot (this version)",
              type: "image",
              description: "Upload a fresh screenshot of the panel for this specific Blender version.",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "version", subtitle: "changes" },
            prepare({ title, subtitle }: { title: string; subtitle: string }) {
              return { title: `Blender ${title}`, subtitle: subtitle ?? "No change notes yet" };
            },
          },
        },
      ],
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

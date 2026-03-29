import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Generate Modifiers", "Shader Nodes"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      description: 'e.g. /modifiers/generate',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "icon",
      title: "SVG Icon",
      type: "text",
      description: "Paste the raw SVG markup for the Blender category icon.",
      rows: 4,
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "string",
      description: 'One-line plain-English summary shown on the homepage card, e.g. "Add new geometry — arrays, mirrors, extrusions"',
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first in navigation.",
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});

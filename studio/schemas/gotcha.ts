import { defineType, defineField } from "sanity";

export const gotcha = defineType({
  name: "gotcha",
  title: "Gotcha",
  type: "document",
  fields: [
    defineField({
      name: "internalName",
      title: "Internal Name",
      type: "string",
      description: 'e.g. gotcha_apply_scale — for your eyes only.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "symptom",
      title: "Symptom",
      type: "string",
      description: 'Plain-English description of what the user sees wrong. e.g. "My mesh is stretching weirdly."',
      validation: (R) => R.required().max(200),
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Code", value: "code" },
            ],
          },
        },
      ],
      description: "Step-by-step plain-English fix.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "visualAid",
      title: "Visual Aid",
      type: "image",
      description: "Small GIF or screenshot showing the fix. Drag a file here.",
      options: { accept: "image/*,.gif" },
    }),
  ],
  preview: {
    select: { title: "internalName", subtitle: "symptom" },
  },
});

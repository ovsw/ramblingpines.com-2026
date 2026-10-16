import { defineField, defineType } from "sanity";
export default defineType({
  name: "mapMarker",
  title: "Map marker",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "x",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "y",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "labelDirection",
      type: "string",
      options: { list: ["right", "left", "top", "bottom"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            annotations: [],
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "labelDirection", media: "images.0" },
  },
});

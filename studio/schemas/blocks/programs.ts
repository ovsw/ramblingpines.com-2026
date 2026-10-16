import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "programs",
  title: "Programs",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "cards",
      type: "array",
      validation: (rule) => rule.required().length(4),
      of: [
        {
          type: "object",
          name: "programCard",
          fields: [
            defineField({
              name: "icon",
              validation: (rule) => rule.required(),
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "ageRange",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              type: "customUrl",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "ageRange", media: "icon" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Programs",
      subtitle: "Programs",
    }),
  },
});

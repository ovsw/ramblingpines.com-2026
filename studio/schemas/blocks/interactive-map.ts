import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "interactiveMap",
  title: "Interactive map",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "campusImage",
      type: "image",
      validation: (rule) => rule.required(),
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Interactive map",
      subtitle: "Interactive map",
    }),
  },
});

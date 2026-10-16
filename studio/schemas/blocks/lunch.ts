import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "lunch",
  title: "Lunch",
  type: "object",
  fields: [
    sectionTheme,
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "body", type: "simpleRichText" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          description:
            "Describe the image for screen readers. Leave empty if the image is decorative or repeats nearby text.",
        }),
      ],
    }),
    defineField({ name: "button", type: "button" }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Lunch",
      subtitle: "Lunch",
    }),
  },
});

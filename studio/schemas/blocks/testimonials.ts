import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "testimonials",
  title: "Testimonials",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "quotes",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: "object",
          name: "quote",
          fields: [
            defineField({
              name: "quote",
              type: "text",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "quote" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Testimonials",
      subtitle: "Testimonials",
    }),
  },
});

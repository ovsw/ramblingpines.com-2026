import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "reviews",
  title: "Reviews",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "widgetId",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-zA-Z0-9_-]+$/, { name: "widget reference ID" }),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Reviews",
      subtitle: "Reviews",
    }),
  },
});

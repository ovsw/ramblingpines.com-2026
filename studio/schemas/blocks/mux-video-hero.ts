import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "muxVideoHero",
  title: "Mux video hero",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "playbackId",
      type: "string",
      validation: (rule) =>
        rule.required().regex(/^[a-zA-Z0-9]+$/, { name: "Mux playback ID" }),
    }),
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", type: "text" }),
    defineField({
      name: "buttons",
      type: "array",
      of: [{ type: "button" }],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Mux video hero",
      subtitle: "Mux video hero",
    }),
  },
});

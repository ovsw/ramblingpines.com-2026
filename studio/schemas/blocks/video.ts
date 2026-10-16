import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
import { validateYouTubeUrl } from "../validation/embed-urls";
export default defineType({
  name: "video",
  title: "Video",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "url",
      type: "url",
      validation: (rule) => rule.required().custom(validateYouTubeUrl),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Video",
      subtitle: "Video",
    }),
  },
});

import { defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
import { validateGoogleMap } from "../validation/embed-urls";
export default defineType({
  name: "locationMap",
  title: "Location map",
  type: "object",
  fields: [
    sectionTheme,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "location",
      type: "string",
      validation: (rule) => rule.required().custom(validateGoogleMap),
    }),
    defineField({
      name: "address",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Location map",
      subtitle: "Location map",
    }),
  },
});

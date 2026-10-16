import { defineArrayMember, defineField, defineType } from "sanity";
import sectionTheme from "./shared/section-theme";
export default defineType({
  name: "transportation",
  title: "Transportation",
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
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({ name: "button", type: "button" }),
    defineField({
      name: "areasTitle",
      title: "Areas heading",
      type: "string",
      description: "Heading over the county lists, for example “Transportation Areas”.",
    }),
    defineField({
      name: "areas",
      title: "Areas",
      type: "array",
      description: "One entry per county, each with the towns served.",
      of: [
        defineArrayMember({
          name: "area",
          type: "object",
          fields: [
            defineField({
              name: "county",
              title: "County",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "towns",
              title: "Towns",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "county", towns: "towns" },
            prepare: ({ title, towns }) => ({
              title: title || "County",
              subtitle: Array.isArray(towns) ? towns.join(", ") : "",
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title: value }) => ({
      title: value || "Transportation",
      subtitle: "Transportation",
    }),
  },
});

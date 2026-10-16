import {
  Files,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  Settings2,
  PanelBottom,
  House,
  TrendingUpDown,
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .icon(House)
        .child(
          S.editor()
            .id("homePage")
            .schemaType("homePage")
            .documentId("homePage"),
        ),
      S.divider(),
      S.listItem()
        .title("Pages")
        .icon(Files)
        .schemaType("page")
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      S.listItem()
        .title("FAQs")
        .icon(ListCollapse)
        .schemaType("faq")
        .child(
          S.documentTypeList("faq")
            .title("FAQs")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      S.listItem()
        .title("Testimonials")
        .icon(Quote)
        .schemaType("testimonial")
        .child(
          S.documentTypeList("testimonial")
            .title("Testimonials")
            .defaultOrdering([{ field: "name", direction: "asc" }]),
        ),
      S.listItem()
        .title("Redirects")
        .icon(TrendingUpDown)
        .schemaType("redirect")
        .child(
          S.documentTypeList("redirect")
            .title("Redirects")
            .defaultOrdering([{ field: "source.current", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              S.listItem()
                .title("Navigation")
                .icon(Menu)
                .child(
                  S.editor()
                    .id("navigation")
                    .schemaType("navigation")
                    .documentId("navigation"),
                ),
              S.listItem()
                .title("Footer")
                .icon(PanelBottom)
                .child(
                  S.editor()
                    .id("footer")
                    .schemaType("footer")
                    .documentId("footer"),
                ),
              S.listItem()
                .title("Global Settings")
                .icon(Settings)
                .child(
                  S.editor()
                    .id("settings")
                    .schemaType("settings")
                    .documentId("settings"),
                ),
            ]),
        ),
    ]);

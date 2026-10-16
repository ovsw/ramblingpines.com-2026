import { describe, expect, it } from "vitest";
import { hasVideoContent } from "./video";
import { hasReviewsContent } from "./reviews";
import { hasLocationMapContent } from "./location-map";

describe("media section content rules", () => {
  it.each([
    "https://youtu.be/YNCpQNkOUuI",
    "https://www.youtube.com/watch?v=YNCpQNkOUuI",
    "https://www.youtube.com/embed/YNCpQNkOUuI",
    "https://www.youtube.com/shorts/YNCpQNkOUuI",
    "https://www.youtube.com/live/YNCpQNkOUuI",
  ])("accepts a supported video URL: %s", (url) => {
    expect(hasVideoContent({ url })).toBe(true);
  });

  it.each([
    "", "javascript:alert(1)", "https://youtube.com.evil.test/watch?v=YNCpQNkOUuI",
    "http://youtube.com/watch?v=YNCpQNkOUuI", "https://youtube.com/watch?v=invalid",
  ])("excludes an invalid video from section adjacency: %s", (url) => {
    expect(hasVideoContent({ url })).toBe(false);
  });

  it("accepts a widget reference but excludes HTML", () => {
    expect(hasReviewsContent({ widgetId: "widget_123-abc" })).toBe(true);
    expect(hasReviewsContent({ widgetId: '<div data-ref="abc"></div>' })).toBe(false);
    expect(hasReviewsContent({ widgetId: " " })).toBe(false);
  });

  it.each([
    "174 Lambertville Hopewell Road, Hopewell, NJ",
    "https://www.google.com/maps/embed?pb=example",
    "https://maps.google.com/maps?q=Hopewell",
  ])("accepts a Google map or place query: %s", (location) => {
    expect(hasLocationMapContent({ location, address: undefined })).toBe(true);
  });

  it.each([
    "", "javascript:alert(1)", "https://google.com.evil.test/maps/embed",
    "https://example.com/maps/embed", "http://google.com/maps?q=Hopewell",
    "https://www.google.com/maps", "<iframe></iframe>",
  ])("excludes an invalid map from section adjacency: %s", (location) => {
    expect(hasLocationMapContent({ location, address: undefined })).toBe(false);
  });
});

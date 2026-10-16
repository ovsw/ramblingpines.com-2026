import assert from "node:assert/strict";
import test from "node:test";
import { validateGoogleMap, validateYouTubeUrl } from "./embed-urls.ts";

test("video URLs accept YouTube links and reject other sites or code", () => {
  for (const url of [
    "https://youtu.be/abc",
    "https://www.youtube.com/watch?v=abc",
  ])
    assert.equal(validateYouTubeUrl(url), true);
  for (const url of [
    "https://youtube.com.evil.example/watch?v=abc",
    "javascript:alert(1)",
    '<iframe src="https://youtube.com"></iframe>',
    "http://youtube.com/watch?v=abc",
  ])
    assert.notEqual(validateYouTubeUrl(url), true);
});

test("location accepts a place query or Google Maps URL, never embed markup", () => {
  for (const value of [
    "174 Lambertville Hopewell Road",
    "https://www.google.com/maps/embed?pb=abc",
  ])
    assert.equal(validateGoogleMap(value), true);
  for (const value of [
    '<iframe src="https://google.com/maps"></iframe>',
    "javascript:alert(1)",
    "   ",
    "https://evil.example/maps",
    "https://www.google.com/search?q=camp",
  ])
    assert.notEqual(validateGoogleMap(value), true);
});

import assert from "node:assert/strict";
import test from "node:test";

import { validateEntry } from "../lib/entry-validation.js";

const valid = {
  title_en: "Pin Peat", title_kh: "ពិណពាទ្យ",
  description_en: "Court ensemble music.", description_kh: "តន្ត្រីរាជវាំង។",
  contributor_en: "Sokha", contributor_kh: "សុខា",
  place_en: "Siem Reap", place_kh: "សៀមរាប",
  type: "song", youtube_url: "",
};
const photo = { type: "image/jpeg", size: 1000 };
const check = (changes, file = photo) => validateEntry({ ...valid, ...changes }, file);

test("a complete bilingual entry and a single name pass", () => {
  assert.deepEqual(check({}), {});
});

test("Khmer text gets through every field, including the English ones", () => {
  assert.deepEqual(check({
    title_en: "ពិណពាទ្យ", description_en: "រឿងរ៉ាវ",
    contributor_en: "សុខា", place_en: "សៀមរាប",
  }), {});
});

test("empty and blank-space fields are refused with a Khmer message", () => {
  const errors = check({ title_en: "   ", title_kh: "", contributor_en: "" });
  assert.deepEqual(Object.keys(errors).sort(), ["contributor_en", "title_en", "title_kh"]);
  assert.match(errors.title_en, /\p{Script=Khmer}/u);
});

test("a text file, an oversized photo and a missing photo are refused", () => {
  assert.ok(check({}, { type: "text/plain", size: 10 }).photo);
  assert.ok(check({}, { type: "image/png", size: 6 * 1024 * 1024 }).photo);
  assert.ok(check({}, null).photo);
});

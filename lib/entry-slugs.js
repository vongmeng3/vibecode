export function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function entrySlug(entry) {
  return entry.slug || slugify(entry.title);
}

export function findEntryBySlug(entries, slug) {
  return entries.find((entry) => entrySlug(entry) === slug);
}
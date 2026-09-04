export function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findEntryBySlug(entries, slug) {
  return entries.find((entry) => slugify(entry.title) === slug);
}
export function slugify(value) {
  return (value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function entrySlug(entry) {
  return entry.slug || slugify(entry.title_en || entry.titleEn || entry.title) || "entry";
}

export function entryHref(entry) {
  return `/entries/${entrySlug(entry)}/${entry.id}`;
}

export function isEntryId(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function findEntryBySlug(entries, slug) {
  return entries.find((entry) => entrySlug(entry) === slug);
}

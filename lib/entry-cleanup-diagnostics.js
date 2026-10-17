// TEMPORARY: remove this module and its call sites after diagnosing the live failure.
// Development only. Never pass session objects, headers, or the Supabase client.

function safeText(value) {
  if (typeof value !== "string") return typeof value === "number" || typeof value === "boolean" ? value : undefined;
  return value
    .replace(/https?:\/\/[^\s"'<>]+/gi, (text) => {
      try { const url = new URL(text); return `${url.origin}${url.pathname}`; } catch { return "[URL omitted]"; }
    })
    .replace(/\bBearer\s+[^\s,"';]+/gi, "Bearer [redacted]")
    .replace(/\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[redacted]")
    .replace(/\bsb_(?:secret|publishable)_[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/\b((?:api[_-]?key|access[_-]?token|refresh[_-]?token|token|authorization|password|service[_-]?role)["']?\s*[:=]\s*["']?)[^\s,"';&]+/gi, "$1[redacted]");
}

function safeImage(image) {
  if (typeof image !== "string") return null;
  try {
    const url = new URL(image);
    return ["https:", "http:"].includes(url.protocol) ? safeText(`${url.origin}${url.pathname}`) : `[${url.protocol} URL omitted]`;
  } catch {
    return image.startsWith("/") ? safeText(image.split(/[?#]/)[0]) : "[unrecognized relative reference]";
  }
}

function safeError(error) {
  if (!error) return null;
  return Object.fromEntries(["name", "message", "code", "status", "statusCode"].map((key) => [key, safeText(error[key])]));
}

function safeData(data) {
  if (data == null) return data;
  const fields = ["id", "name", "bucket_id", "owner_id", "owner", "version", "is_delete_marker", "is_versioned", "archived_at"];
  const project = (row) => Object.fromEntries(fields.filter((key) => row && Object.hasOwn(row, key)).map((key) => [key, safeText(row[key])]));
  return Array.isArray(data) ? data.map(project) : typeof data === "object" ? project(data) : { type: typeof data };
}

export function cleanupDiagnostic(event, fields = {}) {
  if (process.env.NODE_ENV !== "development") return;
  const output = {};
  for (const key of ["entryId", "ownerId", "path", "stage", "reason", "expectedOrigin", "expectedPrefix"]) {
    if (Object.hasOwn(fields, key)) output[key] = safeText(fields[key]);
  }
  if (Object.hasOwn(fields, "imageUrl")) output.imageUrl = safeImage(fields.imageUrl);
  if (Object.hasOwn(fields, "data")) output.data = safeData(fields.data);
  if (Object.hasOwn(fields, "error")) output.error = safeError(fields.error);
  console.log("[photo-cleanup]", event, output);
}

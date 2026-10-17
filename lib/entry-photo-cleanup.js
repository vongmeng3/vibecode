import { isEntryId } from "./entry-slugs.js";
import { cleanupDiagnostic } from "./entry-cleanup-diagnostics.js";

export const PHOTO_CLEANUP_FAILURE = "Entry deleted, but the photo could not be removed.";

function photoObject(supabase, image, owner) {
  if (!image?.trim()) {
    cleanupDiagnostic("image-not-recognized", { reason: "No image reference", imageUrl: image });
    return null;
  }
  let url;
  try { url = new URL(image); } catch {
    cleanupDiagnostic("image-not-recognized", { reason: "Relative/local asset or invalid URL", imageUrl: image });
    return null;
  }
  const storage = supabase.storage.from("photos");
  const base = new URL(storage.getPublicUrl("").data.publicUrl);
  const prefix = base.pathname.endsWith("/") ? base.pathname : `${base.pathname}/`;
  if (url.origin !== base.origin || !url.pathname.startsWith(prefix)) {
    cleanupDiagnostic("image-not-recognized", { reason: "Origin or bucket prefix mismatch", imageUrl: image, expectedOrigin: base.origin, expectedPrefix: prefix });
    return null;
  }
  if (url.username || url.password) {
    cleanupDiagnostic("invalid-photo-path", { reason: "URL contains credentials", imageUrl: image });
    throw new Error("INVALID_PHOTO_URL");
  }

  let segments;
  try { segments = url.pathname.slice(prefix.length).split("/").map(decodeURIComponent); } catch (error) {
    cleanupDiagnostic("invalid-photo-path", { reason: "Path decoding failed", imageUrl: image, error });
    throw error;
  }
  if (segments.length < 2 || segments[0] !== owner || segments.some((part) =>
    !part || part === "." || part === ".." || /[/\\%\u0000-\u001f\u007f]/.test(part)
  )) {
    cleanupDiagnostic("invalid-photo-path", { reason: "Wrong owner folder or unsafe path segment", ownerId: owner, path: segments.join("/") });
    throw new Error("INVALID_PHOTO_PATH");
  }
  return { storage, path: segments.join("/") };
}

function failed(snapshot) {
  return { status: "failed", warning: PHOTO_CLEANUP_FAILURE, snapshot };
}

export async function cleanEntryPhoto(supabase, snapshot) {
  let stage = "recognize-image";
  try {
    cleanupDiagnostic("cleanup-start", { entryId: snapshot.id, ownerId: snapshot.owner, imageUrl: snapshot.image });
    const object = photoObject(supabase, snapshot.image, snapshot.owner);
    if (!object) return { status: "not-needed", warning: "" };
    const { storage, path } = object;
    stage = "reference-check";
    const encodedPath = new URL(storage.getPublicUrl(path).data.publicUrl).pathname;
    // Check raw and URL-encoded references. Escape LIKE wildcards in filenames.
    const references = new Set([`/storage/v1/object/public/photos/${path}`, encodedPath]);
    for (const reference of references) {
      const pattern = `%${reference.replace(/[\\%_]/g, "\\$&")}%`;
      const { data, error } = await supabase.from("entries").select("id").like("image", pattern).limit(1);
      if (error) cleanupDiagnostic("reference-check-error", { path, data, error });
      else if (!Array.isArray(data)) cleanupDiagnostic("reference-check-invalid-data", { path, data });
      else if (data.length) cleanupDiagnostic("photo-still-referenced", { path, data });
      else cleanupDiagnostic("reference-check-clear", { path, data });
      if (error || !Array.isArray(data) || data.length) return failed(snapshot);
    }

    // RLS enforces BOTH owner_id and the first folder against auth.uid().
    // A public URL or successful listing alone does not prove object ownership.
    stage = "storage-remove";
    cleanupDiagnostic("remove-request", { path });
    const { data, error } = await storage.remove([path]);
    cleanupDiagnostic("remove-response", { path, data, error });
    if (error || !Array.isArray(data) || !data.some((file) => file?.name === path)) return failed(snapshot);
    return { status: "removed", warning: "" };
  } catch (error) {
    cleanupDiagnostic("cleanup-exception", { stage, error });
    return failed(snapshot);
  }
}

export async function retryPhotoCleanup(supabase, snapshot) {
  try {
    if (!snapshot || !isEntryId(snapshot.id) || !snapshot.owner) return failed(snapshot);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== snapshot.owner) return failed(snapshot);
    // Retry only cleanup. Never issue a second entry deletion or remove a live photo.
    const { data, error } = await supabase.from("entries").select("id").eq("id", snapshot.id).maybeSingle();
    if (error || data) return failed(snapshot);
    return await cleanEntryPhoto(supabase, snapshot);
  } catch (error) {
    cleanupDiagnostic("cleanup-exception", { stage: "retry-checks", error });
    return failed(snapshot);
  }
}

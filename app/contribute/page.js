"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase/client.js";
import { slugify } from "../../lib/entry-slugs.js";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 40px 64px",
  },

  container: {
    maxWidth: 800,
    margin: "0 auto",
  },

  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 16,
  },

  title: {
    fontSize: 44,
    fontWeight: 700,
    margin: "0 0 12px",
    lineHeight: 1.1,
    color: "#F4F0E8",
  },

  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "0 0 32px",
    letterSpacing: 0.1,
  },

  card: {
    padding: 32,
    backgroundColor: "rgba(28, 34, 44, 0.92)",
    border: "1px solid rgba(226, 183, 109, 0.2)",
    borderRadius: 20,
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)",
  },

  loginPrompt: {
    textAlign: "center",
    padding: 48,
  },

  loginMessage: {
    color: "#E8EDF2",
    fontSize: 18,
    lineHeight: 1.6,
    marginBottom: 24,
  },

  loginButton: {
    display: "inline-block",
    padding: "12px 24px",
    color: "#14181F",
    background: "#2EE6A8",
    border: 0,
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },

  field: {
    marginBottom: 24,
  },

  label: {
    display: "block",
    color: "#F4F0E8",
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 8,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#14181F",
    color: "#F4F0E8",
    border: "1px solid rgba(226, 183, 109, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 150,
    padding: "13px 14px",
    background: "#14181F",
    color: "#F4F0E8",
    border: "1px solid rgba(226, 183, 109, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#14181F",
    color: "#F4F0E8",
    border: "1px solid rgba(226, 183, 109, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },

  help: {
    display: "block",
    color: "#97A1B3",
    fontSize: 13,
    marginTop: 7,
  },

  error: {
    color: "#FF8A8A",
    fontSize: 14,
    marginTop: 7,
  },

  message: {
    padding: "12px 14px",
    marginBottom: 24,
    background: "rgba(255, 138, 138, 0.08)",
    border: "1px solid rgba(255, 138, 138, 0.25)",
    borderRadius: 8,
    color: "#FFB3B3",
    lineHeight: 1.5,
  },

  sectionTitle: {
    color: "#2EE6A8",
    fontSize: 17,
    fontWeight: 700,
    margin: "8px 0 20px",
    paddingBottom: 10,
    borderBottom: "1px solid rgba(226, 183, 109, 0.2)",
  },

  submitButton: {
    width: "100%",
    padding: "14px 20px",
    color: "#14181F",
    background: "#2EE6A8",
    border: 0,
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },

  submitButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};

const MAX_TITLE_LENGTH = 5000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const YOUTUBE_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
];

// Check whether text contains Khmer characters
function containsKhmer(text) {
  return /[\u1780-\u17FF]/u.test(text);
}

// Check whether text contains English letters
function containsEnglish(text) {
  return /[A-Za-z]/.test(text);
}

// Returns the 11-character video ID, or null if it's not a real YouTube video link
function getYouTubeId(rawUrl) {
  try {
    const parsed = new URL(rawUrl.trim());

    // Only allow http(s) and only real YouTube hostnames
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    if (!YOUTUBE_HOSTS.includes(parsed.hostname.toLowerCase())) return null;

    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let id = null;

    if (host === "youtu.be") {
      id = parsed.pathname.split("/")[1];
    } else if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else if (
      parsed.pathname.startsWith("/shorts/") ||
      parsed.pathname.startsWith("/embed/") ||
      parsed.pathname.startsWith("/live/")
    ) {
      id = parsed.pathname.split("/")[2];
    }

    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export default function ContributePage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [form, setForm] = useState({
    title_en: "",
    title_kh: "",
    type: "",
    description_en: "",
    description_kh: "",
    contributor_en: "",
    contributor_kh: "",
    place_en: "",
    place_kh: "",
    youtube_url: "",
  });

  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setLoadingUser(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setSubmitError("");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0] ?? null;

    setPhoto(file);
    setErrors((current) => ({
      ...current,
      photo: "",
    }));
    setSubmitError("");

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        photo: "Please choose a JPG, PNG, or WebP image.",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((current) => ({
        ...current,
        photo: "The image must be 5 MB or smaller.",
      }));
    }
  }

  function validate() {
    const nextErrors = {};

    const englishFields = [
      { key: "title_en", label: "Title" },
      { key: "description_en", label: "Story / Description" },
      { key: "contributor_en", label: "Contributor" },
      { key: "place_en", label: "Place" },
    ];

    const khmerFields = [
      { key: "title_kh", label: "ចំណងជើង" },
      { key: "description_kh", label: "ការពិពណ៌នា" },
      { key: "contributor_kh", label: "អ្នករួមចំណែក" },
      { key: "place_kh", label: "ទីកន្លែង" },
    ];

    // English fields are required and must not contain Khmer letters
    englishFields.forEach(({ key, label }) => {
      const value = form[key].trim();

      if (!value) {
        nextErrors[key] = `${label} is required. Please enter it in English.`;
      } else if (containsKhmer(value)) {
        nextErrors[key] = `Please enter ${label.toLowerCase()} in English only.`;
      }
    });

    // Khmer fields are optional, but must not contain English letters
    khmerFields.forEach(({ key, label }) => {
      const value = form[key].trim();

      if (value && containsEnglish(value)) {
        nextErrors[key] =
          `សូមបញ្ចូល${label}ជាភាសាខ្មែរ។ Please use Khmer only.`;
      }
    });

    // Title length validation
    if (form.title_en.trim().length > MAX_TITLE_LENGTH) {
      nextErrors.title_en = "Title must be 5,000 characters or fewer.";
    }

    if (form.title_kh.trim().length > MAX_TITLE_LENGTH) {
      nextErrors.title_kh =
        "ចំណងជើងត្រូវមានមិនលើសពី 5,000 តួអក្សរ។";
    }

    // Type validation
    const type = form.type.trim();

    if (!type) {
      nextErrors.type = "Type is required.";
    } else if (!["song", "instrument"].includes(type)) {
      nextErrors.type = "Please choose Song or Instrument.";
    }

    // Photo validation
    if (!photo) {
      nextErrors.photo = "Photo is required.";
    } else if (!ALLOWED_TYPES.includes(photo.type)) {
      nextErrors.photo = "Please choose a JPG, PNG, or WebP image.";
    } else if (photo.size > MAX_FILE_SIZE) {
      nextErrors.photo = "The image must be 5 MB or smaller.";
    }

    // YouTube link is optional, but must be a real YouTube video link if provided
    const youtubeUrl = form.youtube_url.trim();

    if (youtubeUrl && !getYouTubeId(youtubeUrl)) {
      nextErrors.youtube_url =
        "Please enter a valid YouTube video link (for example https://www.youtube.com/watch?v=...).";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    if (!user) {
      setSubmitError("Please log in before contributing an entry.");
      return;
    }

    setSubmitting(true);
    let uploadedPath = null;

    try {
      const extension =
        photo.type === "image/jpeg"
          ? "jpg"
          : photo.type === "image/png"
            ? "png"
            : "webp";

      const randomName =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      uploadedPath = `${user.id}/${randomName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(uploadedPath, photo, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Photo upload failed:", uploadError);
        throw new Error("PHOTO_UPLOAD_FAILED");
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("photos")
        .getPublicUrl(uploadedPath);

      const titleEn = form.title_en.trim();

      // Store a clean, normalized YouTube link (or null if left blank)
      const youtubeId = form.youtube_url.trim()
        ? getYouTubeId(form.youtube_url)
        : null;

      const { data: insertedEntry, error: insertError } = await supabase
        .from("entries")
        .insert({
          owner: user.id,
          title_en: titleEn,
          title_kh: form.title_kh.trim(),
          type: form.type.trim(),
          description_en: form.description_en.trim(),
          description_kh: form.description_kh.trim(),
          contributor_en: form.contributor_en.trim(),
          contributor_kh: form.contributor_kh.trim(),
          place_en: form.place_en.trim(),
          place_kh: form.place_kh.trim(),
          image: publicUrl,
          youtube_url: youtubeId
            ? `https://www.youtube.com/watch?v=${youtubeId}`
            : null,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Supabase entry insert failed:", insertError);

        await supabase.storage.from("photos").remove([uploadedPath]);

        throw new Error(`ENTRY_SAVE_FAILED: ${insertError.message}`);
      }

      if (!insertedEntry?.id) {
        console.error("Entry was inserted without returning an id.");
        throw new Error("ENTRY_ID_MISSING");
      }

      router.push(`/entries/${slugify(titleEn)}`);
    } catch (error) {
      console.error("Contribution failed:", error);

      setSubmitError(
        error?.message === "PHOTO_UPLOAD_FAILED"
          ? "The photo could not be uploaded. Please check the file and try again."
          : error?.message?.startsWith("ENTRY_SAVE_FAILED:")
            ? error.message
            : "Something went wrong while saving your contribution. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingUser) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <p style={styles.description}>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.kicker}>CONTRIBUTE</div>
          <h1 style={styles.title}>Add to the archive</h1>

          <div style={styles.card}>
            <div style={styles.loginPrompt}>
              <p style={styles.loginMessage}>
                You need to be logged in before you can contribute an entry.
              </p>
              <a href="/login" style={styles.loginButton}>
                Log in
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.kicker}>CONTRIBUTE / ចូលរួមចំណែក</div>

        <h1 style={styles.title}>Add to the archive</h1>

        <p style={styles.description}>
          Share a Khmer traditional music entry with the archive.
          Add accurate information in English and Khmer, along with a clear photo.
        </p>

        <div style={styles.card}>
          {submitError && (
            <div role="alert" style={styles.message}>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <h2 style={styles.sectionTitle}>Entry Information / ព័ត៌មានអំពីធាតុ</h2>

            <div style={styles.field}>
              <label htmlFor="title_en" style={styles.label}>
                Title (English) *
              </label>
              <input
                id="title_en"
                name="title_en"
                type="text"
                value={form.title_en}
                onChange={(e) => updateField("title_en", e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
                style={styles.input}
                disabled={submitting}
                lang="en"
                placeholder="Please enter the title in English"
              />
              <small style={styles.help}>
                Maximum {MAX_TITLE_LENGTH.toLocaleString()} characters.
              </small>
              {errors.title_en && (
                <div style={styles.error}>{errors.title_en}</div>
              )}
            </div>

            <div style={styles.field}>
              <label htmlFor="title_kh" style={styles.label}>
                ចំណងជើង (ខ្មែរ)
              </label>
              <input
                id="title_kh"
                name="title_kh"
                type="text"
                value={form.title_kh}
                onChange={(e) => updateField("title_kh", e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
                style={styles.input}
                disabled={submitting}
                placeholder="សូមបញ្ចូលចំណងជើងជាភាសាខ្មែរ"
                lang="km"
              />
              {errors.title_kh && (
                <div style={styles.error}>{errors.title_kh}</div>
              )}
            </div>

            <div style={styles.field}>
              <label htmlFor="type" style={styles.label}>
                Type / ប្រភេទ *
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={(event) => updateField("type", event.target.value)}
                style={styles.select}
                disabled={submitting}
              >
                <option value="">Select a type / ជ្រើសរើសប្រភេទ</option>
                <option value="song">Song / ចម្រៀង</option>
                <option value="instrument">Instrument / ឧបករណ៍តន្ត្រី</option>
              </select>
              {errors.type && (
                <div style={styles.error}>{errors.type}</div>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Story / រឿងរ៉ាវ</h2>

            <div style={styles.field}>
              <label htmlFor="description_en" style={styles.label}>
                Story / Description (English) *
              </label>
              <textarea
                id="description_en"
                name="description_en"
                value={form.description_en}
                onChange={(event) =>
                  updateField("description_en", event.target.value)
                }
                style={styles.textarea}
                disabled={submitting}
              />
              {errors.description_en && (
                <div style={styles.error}>{errors.description_en}</div>
              )}
            </div>

            <div style={styles.field}>
              <label htmlFor="description_kh" style={styles.label}>
                រឿងរ៉ាវ / ការពិពណ៌នា (ខ្មែរ)
              </label>
              <textarea
                id="description_kh"
                name="description_kh"
                value={form.description_kh}
                onChange={(event) =>
                  updateField("description_kh", event.target.value)
                }
                style={styles.textarea}
                disabled={submitting}
              />
              {errors.description_kh && (
                <div style={styles.error}>{errors.description_kh}</div>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Contributor / អ្នករួមចំណែក</h2>

            <div style={styles.field}>
              <label htmlFor="contributor_en" style={styles.label}>
                Contributor (English) *
              </label>
              <input
                id="contributor_en"
                name="contributor_en"
                type="text"
                value={form.contributor_en}
                onChange={(event) =>
                  updateField("contributor_en", event.target.value)
                }
                style={styles.input}
                disabled={submitting}
              />
              {errors.contributor_en && (
                <div style={styles.error}>{errors.contributor_en}</div>
              )}
            </div>

            <div style={styles.field}>
              <label htmlFor="contributor_kh" style={styles.label}>
                អ្នករួមចំណែក (ខ្មែរ)
              </label>
              <input
                id="contributor_kh"
                name="contributor_kh"
                type="text"
                value={form.contributor_kh}
                onChange={(event) =>
                  updateField("contributor_kh", event.target.value)
                }
                style={styles.input}
                disabled={submitting}
              />
              {errors.contributor_kh && (
                <div style={styles.error}>{errors.contributor_kh}</div>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Place / ទីកន្លែង</h2>

            <div style={styles.field}>
              <label htmlFor="place_en" style={styles.label}>
                Place (English) *
              </label>
              <input
                id="place_en"
                name="place_en"
                type="text"
                value={form.place_en}
                onChange={(event) => updateField("place_en", event.target.value)}
                style={styles.input}
                disabled={submitting}
              />
              {errors.place_en && (
                <div style={styles.error}>{errors.place_en}</div>
              )}
            </div>

            <div style={styles.field}>
              <label htmlFor="place_kh" style={styles.label}>
                ទីកន្លែង (ខ្មែរ)
              </label>
              <input
                id="place_kh"
                name="place_kh"
                type="text"
                value={form.place_kh}
                onChange={(event) => updateField("place_kh", event.target.value)}
                style={styles.input}
                disabled={submitting}
              />
              {errors.place_kh && (
                <div style={styles.error}>{errors.place_kh}</div>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Photo / រូបភាព</h2>

            <div style={styles.field}>
              <label htmlFor="photo" style={styles.label}>
                Photo / រូបភាព *
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                style={styles.input}
                disabled={submitting}
              />
              <small style={styles.help}>
                JPG, PNG, or WebP only. Maximum 5 MB.
              </small>
              {errors.photo && (
                <div style={styles.error}>{errors.photo}</div>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Video / វីដេអូ</h2>

            <div style={styles.field}>
              <label htmlFor="youtube_url" style={styles.label}>
                YouTube link (optional) / តំណ YouTube
              </label>
              <input
                id="youtube_url"
                name="youtube_url"
                type="url"
                value={form.youtube_url}
                onChange={(event) =>
                  updateField("youtube_url", event.target.value)
                }
                style={styles.input}
                disabled={submitting}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <small style={styles.help}>
                Optional. Paste a link to a performance or recording on YouTube.
              </small>
              {errors.youtube_url && (
                <div style={styles.error}>{errors.youtube_url}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitButton,
                ...(submitting ? styles.submitButtonDisabled : {}),
              }}
            >
              {submitting ? "Saving..." : "Add to archive / បន្ថែមទៅបណ្ណសារ"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
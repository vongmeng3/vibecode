export const MAX_TITLE_LENGTH = 5000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_TYPES = [
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

// Khmer letters, excluding digits, punctuation, and standalone vowel marks
function containsKhmer(text) {
  return /[\u1780-\u17B3]/u.test(text);
}

// Returns the 11-character video ID, or null if it's not a real YouTube video link
export function getYouTubeId(rawUrl) {
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


export function validateEntry(form, photo, existingImage = "") {
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

  // English fields are required but accept any script, so a contributor can
  // type a Khmer name or place here and it still gets through.
  englishFields.forEach(({ key, label }) => {
    if (!form[key].trim()) {
      nextErrors[key] = `${label} is required. សូមបំពេញប្រអប់នេះ។`;
    }
  });

  // Both translations are required; Khmer may include Latin proper names.
  khmerFields.forEach(({ key, label }) => {
    const value = form[key].trim();

    if (!value) {
      nextErrors[key] = `${label} is required. សូមបំពេញប្រអប់នេះជាភាសាខ្មែរ។`;
    } else if (!containsKhmer(value)) {
      nextErrors[key] = `សូមបញ្ចូល${label}ជាភាសាខ្មែរ។ Please enter Khmer text in this field.`;
    }
  });

  // Title length validation
  if (form.title_en.trim().length > MAX_TITLE_LENGTH) {
    nextErrors.title_en = "Title must be 5,000 characters or fewer. ចំណងជើងត្រូវមានមិនលើសពី 5,000 តួអក្សរ។";
  }

  if (form.title_kh.trim().length > MAX_TITLE_LENGTH) {
    nextErrors.title_kh =
      "ចំណងជើងត្រូវមានមិនលើសពី 5,000 តួអក្សរ។";
  }

  // Type validation
  const type = form.type.trim();

  if (!type) {
    nextErrors.type = "Type is required. សូមជ្រើសរើសប្រភេទ។";
  } else if (!["song", "instrument"].includes(type)) {
    nextErrors.type = "Please choose Song or Instrument. សូមជ្រើសរើស បទចម្រៀង ឬ ឧបករណ៍ភ្លេង។";
  }

  // Photo validation
  if (!photo && !existingImage.trim()) {
    nextErrors.photo = "Photo is required. សូមបញ្ចូលរូបថត។";
  } else if (photo && !ALLOWED_TYPES.includes(photo.type)) {
    nextErrors.photo = "Please choose a JPG, PNG, or WebP image. សូមជ្រើសរើសរូបភាព JPG, PNG ឬ WebP។";
  } else if (photo && photo.size > MAX_FILE_SIZE) {
    nextErrors.photo = "The image must be 5 MB or smaller. រូបភាពត្រូវមានទំហំមិនលើសពី 5 MB។";
  }

  // YouTube link is optional, but must be a real YouTube video link if provided
  const youtubeUrl = form.youtube_url.trim();

  if (youtubeUrl && !getYouTubeId(youtubeUrl)) {
    nextErrors.youtube_url =
      "Please enter a valid YouTube video link (for example https://www.youtube.com/watch?v=...). សូមបញ្ចូលតំណវីដេអូ YouTube ដែលត្រឹមត្រូវ។";
  }

  return nextErrors;
}

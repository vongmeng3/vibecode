import { styles } from "../lib/entry-form-styles.js";
import { MAX_TITLE_LENGTH } from "../lib/entry-validation.js";

const languagePairs = [
  { key: "title", en: "Title", kh: "ចំណងជើង" },
  { key: "description", en: "Story / Description", kh: "រឿងរ៉ាវ / ការពិពណ៌នា" },
  { key: "contributor", en: "Contributor", kh: "អ្នករួមចំណែក" },
  { key: "place", en: "Place", kh: "ទីកន្លែង" },
];

export default function EntryEditFields({ form, errors, onChange, disabled }) {
  return (
    <>
      {languagePairs.map(({ key, en, kh }) => {
        const Input = key === "description" ? "textarea" : "input";
        return (
          <section key={key}>
            <h2 style={styles.sectionTitle}>{en} / {kh}</h2>
            {["en", "kh"].map((language) => {
              const field = `${key}_${language}`;
              return (
                <div key={field} style={styles.field}>
                  <label htmlFor={field} style={styles.label}>{language === "en" ? `${en} (English)` : `${kh} (ខ្មែរ)`} *</label>
                  <Input id={field} name={field} required value={form[field]}
                    lang={language === "kh" ? "km" : "en"}
                    onChange={(event) => onChange(field, event.target.value)}
                    maxLength={key === "title" ? MAX_TITLE_LENGTH : undefined}
                    style={key === "description" ? styles.textarea : styles.input} disabled={disabled}
                    aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} />
                  {errors[field] && <div id={`${field}-error`} role="alert" style={styles.error}>{errors[field]}</div>}
                </div>
              );
            })}
          </section>
        );
      })}
      <div style={styles.field}>
        <label htmlFor="type" style={styles.label}>Type / ប្រភេទ *</label>
        <select id="type" name="type" required value={form.type} onChange={(event) => onChange("type", event.target.value)}
          style={styles.select} disabled={disabled} aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? "type-error" : undefined}>
          <option value="">Select a type / ជ្រើសរើសប្រភេទ</option>
          <option value="song">Song / ចម្រៀង</option>
          <option value="instrument">Instrument / ឧបករណ៍តន្ត្រី</option>
        </select>
        {errors.type && <div id="type-error" role="alert" style={styles.error}>{errors.type}</div>}
      </div>
      <div style={styles.field}>
        <label htmlFor="youtube_url" style={styles.label}>YouTube link (optional) / តំណ YouTube</label>
        <input id="youtube_url" name="youtube_url" type="url" value={form.youtube_url}
          onChange={(event) => onChange("youtube_url", event.target.value)} style={styles.input} disabled={disabled}
          aria-invalid={Boolean(errors.youtube_url)} aria-describedby={errors.youtube_url ? "youtube_url-error" : undefined} />
        {errors.youtube_url && <div id="youtube_url-error" role="alert" style={styles.error}>{errors.youtube_url}</div>}
      </div>
    </>
  );
}

import { styles } from "../lib/entry-form-styles.js";

export default function EntryPhotoField({ entry, error, onChange, disabled }) {
  return (
    <section>
      <h2 style={styles.sectionTitle}>Photo / រូបភាព</h2>
      {entry.image && <img src={entry.image} alt={entry.title_en || entry.title_kh}
        style={{ display: "block", width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 8, marginBottom: 16 }} />}
      <div style={styles.field}>
        <label htmlFor="photo" style={styles.label}>Replacement photo / រូបភាព</label>
        <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)} style={styles.input} disabled={disabled}
          aria-invalid={Boolean(error)} aria-describedby={error ? "photo-error photo-help" : "photo-help"} />
        <small id="photo-help" style={styles.help}>Leave empty to keep the current photo. JPG, PNG, or WebP only. Maximum 5 MB.</small>
        {error && <div id="photo-error" role="alert" style={styles.error}>{error}</div>}
      </div>
    </section>
  );
}

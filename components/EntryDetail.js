import EntryOwnerActions from "./EntryOwnerActions.js";
import { entryHref } from "../lib/entry-slugs.js";
import { styles } from "../lib/entry-detail-styles.js";

function highlight(value, query) {
  if (!query) return value;
  const terms = query.trim().split(/\s+/).filter(Boolean).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return value;
  return String(value).split(new RegExp(`(${terms.join("|")})`, "gi")).map((part, index) =>
    terms.some((term) => part.toLocaleLowerCase() === term.toLocaleLowerCase()) ? <mark key={`${part}-${index}`}>{part}</mark> : part,
  );
}

// The full entry view, shared by the server page (published entries) and
// PrivateEntry (entries only the owner or a reviewer may see).
export default function EntryDetail({ row, query }) {
  const entry = {
    ...row,
    titleEn: row.title_en,
    titleKh: row.title_kh,
    descriptionEn: row.description_en,
    descriptionKh: row.description_kh,
    contributorEn: row.contributor_en,
    contributorKh: row.contributor_kh,
    placeEn: row.place_en,
    placeKh: row.place_kh,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
  };
  const title = entry.titleEn || entry.titleKh;

  return (
    <article className="entry-detail-panel" style={styles.panel}>
      <EntryOwnerActions key={row.id} id={row.id} owner={row.owner} title={title} href={`${entryHref(row)}/edit`} />
      <div style={styles.kicker}>{entry.type === "song" ? "SONG" : "INSTRUMENT"}</div>
      <h1 style={styles.title}><span className="khmer-title">{highlight(entry.titleKh, query)}</span>{entry.titleKh && entry.titleEn && <br />}<span className="english-text">{highlight(entry.titleEn, query)}</span></h1>
      {entry.image ? (
        <img
          src={entry.image}
          alt={title}
          loading="eager"
          decoding="async"
          style={styles.image}
        />
      ) : (
        <div className="entry-image-placeholder" role="img" aria-label={`${title} image update soon`}>
          <span>Update soon</span>
        </div>
      )}
      {entry.youtubeId ? (
        <iframe
          title={`${title} video`}
          src={`https://www.youtube.com/embed/${entry.youtubeId}`}
          style={styles.video}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : entry.youtubeUrl && (
        <p><a href={entry.youtubeUrl} target="_blank" rel="noreferrer" style={styles.back}>Watch on YouTube ↗</a></p>
      )}
      <div style={styles.tags} aria-label="Related keywords">
        {(entry.tags || []).map((tag) => <span key={tag} style={styles.tag}>#{highlight(tag, query)}</span>)}
      </div>
      <section>
        {entry.descriptionKh && <>
          <p style={styles.label}>Khmer description</p>
          <p className="khmer-text" style={styles.language}>{highlight(entry.descriptionKh, query)}</p>
        </>}
        {entry.descriptionEn && <>
          <p style={styles.label}>English description</p>
          <p className="english-text" style={styles.text}>{highlight(entry.descriptionEn, query)}</p>
        </>}
      </section>
      <section>
        <p style={styles.label}>Contributor</p>
        <p style={styles.meta}><span className="khmer-contributor">{entry.contributorKh}</span>{entry.contributorKh && entry.contributorEn && " / "}<span className="english-text">{entry.contributorEn}</span></p>
        <p style={styles.label}>Place</p>
        <p style={styles.meta}><span className="khmer-place">{entry.placeKh}</span>{entry.placeKh && entry.placeEn && " / "}<span className="english-text">{entry.placeEn}</span></p>
      </section>
    </article>
  );
}

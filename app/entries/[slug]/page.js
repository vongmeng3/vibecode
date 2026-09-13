import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../../data/entries.js";
import { entrySlug, findEntryBySlug } from "../../../lib/entry-slugs.js";

function highlight(value, query) {
  if (!query) return value;
  const terms = query.trim().split(/\s+/).filter(Boolean).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return value;
  return String(value).split(new RegExp(`(${terms.join("|")})`, "gi")).map((part, index) =>
    terms.some((term) => part.toLocaleLowerCase() === term.toLocaleLowerCase()) ? <mark key={`${part}-${index}`}>{part}</mark> : part,
  );
}

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entrySlug(entry) }));
}

const styles = {
  page: { maxWidth: 900, margin: "0 auto", padding: "48px 40px 64px" },
  back: { display: "inline-block", color: "#2EE6A8", textDecoration: "none", marginBottom: 36, fontSize: 14, fontWeight: 600 },
  panel: { padding: "clamp(24px, 5vw, 56px)", backgroundColor: "rgba(28, 34, 44, 0.92)", border: "1px solid rgba(226, 183, 109, 0.2)", borderRadius: 20, boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)" },
  kicker: { color: "#2EE6A8", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 1.5 },
  title: { margin: "18px 0 28px", color: "#F4F0E8", fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.15 },
  image: { display: "block", width: "100%", height: "100%", maxHeight: 560, objectFit: "cover", objectPosition: "center", borderRadius: 14, marginBottom: 28 },
  video: { display: "block", width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 14, margin: "12px 0 28px", backgroundColor: "#14181F" },
  tags: { display: "flex", flexWrap: "wrap", gap: 8, margin: "10px 0 28px" },
  tag: { padding: "6px 10px", borderRadius: 999, color: "#BCEBDC", backgroundColor: "rgba(46, 230, 168, 0.1)", border: "1px solid rgba(46, 230, 168, 0.3)", fontSize: 13 },
  language: { margin: "0 0 26px", color: "#E8EDF2", fontSize: 20, lineHeight: 1.6 },
  label: { margin: "26px 0 8px", color: "#E2B76D", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  text: { margin: 0, color: "#B5BFCD", fontSize: 17, lineHeight: 1.8 },
  meta: { color: "#97A1B3", fontSize: 15, lineHeight: 1.7 },
};

export default async function EntryDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const query = (await searchParams)?.q || "";
  const entry = findEntryBySlug(entries, slug);
  if (!entry) notFound();

  return (
    <main className="entry-detail-page" style={styles.page}>
      <Link href="/" style={styles.back}>← Back to Browse</Link>
      <article className="entry-detail-panel" style={styles.panel}>
        <div style={styles.kicker}>{entry.type === "song" ? "SONG" : "INSTRUMENT"}</div>
        <h1 style={styles.title}><span className="khmer-title">{highlight(entry.titleKh, query)}</span><br /><span className="english-text">{highlight(entry.titleEn, query)}</span></h1>
        {entry.image ? (
          <img
            src={entry.image}
            alt={entry.titleEn}
            loading="eager"
            decoding="async"
            style={styles.image}
          />
        ) : (
          <div className="entry-image-placeholder" role="img" aria-label={`${entry.titleEn} image update soon`}>
            <span>Update soon</span>
          </div>
        )}
        {entry.youtubeId ? (
          <iframe
            title={`${entry.titleEn} video`}
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
          <p style={styles.label}>Khmer description</p>
          <p className="khmer-text" style={styles.language}>{highlight(entry.descriptionKh, query)}</p>
          <p style={styles.label}>English description</p>
          <p className="english-text" style={styles.text}>{highlight(entry.descriptionEn, query)}</p>
        </section>
        <section>
          <p style={styles.label}>Contributor</p>
          <p style={styles.meta}><span className="khmer-contributor">{entry.contributorKh}</span> / <span className="english-text">{entry.contributorEn}</span></p>
          <p style={styles.label}>Place</p>
          <p style={styles.meta}><span className="khmer-place">{entry.placeKh}</span> / <span className="english-text">{entry.placeEn}</span></p>
        </section>
      </article>
    </main>
  );
}
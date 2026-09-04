import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../../data/entries.js";
import { findEntryBySlug, slugify } from "../../../lib/entry-slugs.js";

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: slugify(entry.title) }));
}

const styles = {
  page: { maxWidth: 900, margin: "0 auto", padding: "48px 40px 64px" },
  back: { display: "inline-block", color: "#2EE6A8", textDecoration: "none", marginBottom: 36, fontSize: 14, fontWeight: 600 },
  panel: { padding: "clamp(24px, 5vw, 56px)", backgroundColor: "rgba(28, 34, 44, 0.92)", border: "1px solid rgba(226, 183, 109, 0.2)", borderRadius: 20, boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)" },
  kicker: { color: "#2EE6A8", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 1.5 },
  title: { margin: "18px 0 28px", color: "#F4F0E8", fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.15 },
  language: { margin: "0 0 26px", color: "#E8EDF2", fontSize: 20, lineHeight: 1.6 },
  label: { margin: "26px 0 8px", color: "#E2B76D", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  text: { margin: 0, color: "#B5BFCD", fontSize: 17, lineHeight: 1.8 },
  meta: { color: "#97A1B3", fontSize: 15, lineHeight: 1.7 },
};

export default async function EntryDetailPage({ params }) {
  const { slug } = await params;
  const entry = findEntryBySlug(entries, slug);
  if (!entry) notFound();

  return (
    <main className="entry-detail-page" style={styles.page}>
      <Link href="/" style={styles.back}>← Back to Browse</Link>
      <article className="entry-detail-panel" style={styles.panel}>
        <div style={styles.kicker}>{entry.type === "song" ? "SONG" : "INSTRUMENT"}</div>
        <h1 style={styles.title}>{entry.titleKh}<br />{entry.titleEn}</h1>
        <section>
          <p style={styles.label}>Khmer description</p>
          <p style={styles.language}>{entry.descriptionKh}</p>
          <p style={styles.label}>English description</p>
          <p style={styles.text}>{entry.descriptionEn}</p>
        </section>
        <section>
          <p style={styles.label}>Contributor</p>
          <p style={styles.meta}>{entry.contributorKh} / {entry.contributorEn}</p>
          <p style={styles.label}>Place</p>
          <p style={styles.meta}>{entry.placeKh} / {entry.placeEn}</p>
        </section>
      </article>
    </main>
  );
}
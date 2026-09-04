import { useState } from "react";

const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid rgba(226, 183, 109, 0.18)",
    borderRadius: 10,
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.14)",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: "0 0 6px",
  },
  type: {
    display: "inline-block",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 1,
    padding: "3px 8px",
    borderRadius: 4,
    marginBottom: 8,
  },
  typeSong: {
    color: "#2EE6A8",
    backgroundColor: "rgba(46, 230, 168, 0.12)",
  },
  typeInstrument: {
    color: "#7FA8E0",
    backgroundColor: "rgba(127, 168, 224, 0.14)",
  },
  title: {
    fontSize: 19,
    fontWeight: 600,
    margin: "0 0 12px",
    lineHeight: 1.5,
    letterSpacing: 0.1,
  },
  desc: {
    fontSize: 14,
    color: "#97A1B3",
    lineHeight: 1.65,
    margin: "0 0 16px",
  },
  descContent: {
    overflow: "hidden",
    transition: "max-height 280ms ease, opacity 220ms ease",
  },
  descPreview: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
  },
  seeMore: {
    padding: 0,
    color: "#2EE6A8",
    background: "none",
    border: 0,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
  meta: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#5A6373",
    lineHeight: 1.6,
  },
};

export default function EntryCard({
  titleEn,
  titleKh,
  descriptionEn,
  descriptionKh,
  contributorEn,
  contributorKh,
  placeEn,
  placeKh,
  type,
}) {
  const isSong = type === "song";
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongDescription = descriptionKh.length > 120 || descriptionEn.length > 160;

  return (
    <div className="archive-card" style={styles.card}>
      <p style={styles.label}>ENTRY</p>
      <span
        style={{
          ...styles.type,
          ...(isSong ? styles.typeSong : styles.typeInstrument),
        }}
      >
        {isSong ? "SONG" : "INSTRUMENT"}
      </span>
      <h3 style={styles.title}>
        {titleKh}
        <br />
        {titleEn}
      </h3>
      <div style={styles.desc}>
        <div
          className="archive-card-description"
          style={{
            ...styles.descContent,
            ...(isExpanded ? {} : styles.descPreview),
          }}
        >
          <strong>ខ្មែរ:</strong> {descriptionKh}
          <br />
          <strong>English:</strong> {descriptionEn}
        </div>
        {hasLongDescription && (
          <button
            type="button"
            style={styles.seeMore}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        )}
      </div>
      <p style={styles.meta}>
        Contributor: {contributorKh} / {contributorEn} • Place: {placeKh} / {placeEn}
      </p>
    </div>
  );
}
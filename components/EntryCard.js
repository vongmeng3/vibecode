import Link from "next/link";

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
  image,
  href,
  highlight,
  tags = [],
}) {
  const isSong = type === "song";
  const renderHighlight = highlight || ((value) => value);
  return (
    <Link href={href} className="archive-card" style={{ ...styles.card, textDecoration: "none", color: "inherit" }}>
      {image ? (
        <img
          className="archive-card-image"
          src={image}
          alt={titleEn}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="archive-card-image archive-image-placeholder" role="img" aria-label={`${titleEn} image update soon`}>
          <span>Update soon</span>
        </div>
      )}
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
        <span className="khmer-title">{renderHighlight(titleKh)}</span>
        <br />
        <span className="english-text">{renderHighlight(titleEn)}</span>
      </h3>
      <div className="archive-card-tags" aria-label="Keywords">
        {tags.map((tag) => <span key={tag}>{renderHighlight(tag)}</span>)}
      </div>
      <div style={styles.desc}>
        <div
          className="archive-card-description"
          style={{
            ...styles.descContent,
            ...styles.descPreview,
          }}
        >
          <span className="khmer-text"><strong>ខ្មែរ:</strong> {renderHighlight(descriptionKh)}</span>
          <br />
          <span className="english-text"><strong>English:</strong> {renderHighlight(descriptionEn)}</span>
        </div>
      </div>
      <p style={styles.meta}>
        Contributor: <span className="khmer-contributor">{contributorKh}</span> / <span className="english-text">{contributorEn}</span>
        <span aria-hidden="true"> • </span>
        Place: <span className="khmer-place">{placeKh}</span> / <span className="english-text">{placeEn}</span>
      </p>
    </Link>
  );
}
const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
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
    fontSize: 18,
    fontWeight: 600,
    margin: "0 0 12px",
    lineHeight: 1.3,
  },
  desc: {
    fontSize: 14,
    color: "#97A1B3",
    lineHeight: 1.5,
    margin: "0 0 16px",
  },
  meta: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#5A6373",
  },
};

export default function EntryCard({ title, description, contributor, place, type }) {
  const isSong = type === "song";
  return (
    <div style={styles.card}>
      <p style={styles.label}>ENTRY</p>
      <span
        style={{
          ...styles.type,
          ...(isSong ? styles.typeSong : styles.typeInstrument),
        }}
      >
        {isSong ? "SONG" : "INSTRUMENT"}
      </span>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.desc}>{description}</p>
      <p style={styles.meta}>
        Contributor: {contributor} • Place: {place}
      </p>
    </div>
  );
}
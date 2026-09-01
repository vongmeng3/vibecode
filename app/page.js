"use client";

import { useState } from "react";
import collection from "../collection.config.js";
import entries from "../data/entries.js";
import EntryCard from "../components/EntryCard.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  sectionLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    letterSpacing: 1,
    marginTop: 48,
  },
  searchLabel: {
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    letterSpacing: 1,
    margin: "16px 0 8px",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontSize: 16,
    color: "#E8EDF2",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 8,
    outline: "none",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#2EE6A8",
    margin: "16px 0 32px",
  },
  none: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    color: "#97A1B3",
    fontSize: 14,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

// An entry matches when the query appears in any of the fields we
// chose to search: title, story (description), place, contributor,
// or type ("song" / "instrument"). toLowerCase() and includes() are
// Unicode-aware, so this works for both English and Khmer text.
function matches(entry, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true; // empty query shows everything
  return [
    entry.title,
    entry.description,
    entry.place,
    entry.contributor,
    entry.type,
  ].some((field) => (field || "").toLowerCase().includes(q));
}

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = entries.filter((entry) => matches(entry, query));

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <h2 style={styles.sectionLabel}>THE COLLECTION</h2>

      <label style={styles.searchLabel} htmlFor="archive-search">
        SEARCH THE ARCHIVE
      </label>
      <input
        id="archive-search"
        type="search"
        placeholder="Filter by title, story, place, or contributor"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.searchInput}
      />

      <p style={styles.count}>
        showing {filtered.length} of {entries.length} entries
      </p>

      {filtered.map((entry) => (
        <EntryCard
          key={entry.title}
          title={entry.title}
          description={entry.description}
          contributor={entry.contributor}
          place={entry.place}
          type={entry.type}
        />
      ))}

      {filtered.length === 0 && (
        <p style={styles.none}>No entries found.</p>
      )}
      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}



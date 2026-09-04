"use client";

import { useState } from "react";
import collection from "../collection.config.js";
import entries from "../data/entries.js";
import EntryCard from "../components/EntryCard.js";

const styles = {
  wrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 40px 56px",
    position: "relative",
    background: "linear-gradient(145deg, rgba(25, 32, 42, 0.96), rgba(18, 24, 32, 0.94))",
    border: "1px solid rgba(226, 183, 109, 0.16)",
    borderRadius: 28,
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.22)",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 44,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
    color: "#F4F0E8",
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
    letterSpacing: 0.1,
  },
  card: {
    marginTop: 48,
    padding: 20,
    backgroundColor: "#1C222C",
    border: "1px solid rgba(226, 183, 109, 0.18)",
    borderRadius: 14,
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.14)",
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
    letterSpacing: 1,
    marginTop: 48,
    color: "#E2B76D",
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
    padding: "13px 16px 13px 42px",
    fontSize: 16,
    color: "#E8EDF2",
    backgroundColor: "rgba(28, 34, 44, 0.88)",
    border: "1px solid rgba(151, 161, 179, 0.28)",
    borderRadius: 999,
    outline: "none",
    fontFamily: "inherit",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#2EE6A8",
    margin: "16px 0 32px",
    letterSpacing: 0.4,
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
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
    flexWrap: "wrap",
  },
  pageButton: {
    padding: "8px 12px",
    color: "#E8EDF2",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  activePage: {
    color: "#14181F",
    backgroundColor: "#2EE6A8",
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

// Normalize each searchable value without stripping Khmer Unicode, then
// search both language versions of every text field and the entry type.
function normalize(value) {
  return (value || "").normalize("NFC").toLocaleLowerCase();
}

function matches(entry, query) {
  const q = normalize(query.trim());
  if (!q) return true; // empty query shows everything
  return [
    entry.titleEn,
    entry.titleKh,
    entry.descriptionEn,
    entry.descriptionKh,
    entry.placeEn,
    entry.placeKh,
    entry.contributorEn,
    entry.contributorKh,
    entry.type,
  ].some((field) => normalize(field).includes(q));
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = entries.filter((entry) => matches(entry, query));
  const entriesPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * entriesPerPage;
  const paginatedEntries = filtered.slice(pageStart, pageStart + entriesPerPage);

  return (
    <main className="archive-page" style={styles.wrap}>
      <header className="archive-hero">
        <div className="archive-header-row">
          <div>
            <p className="archive-kicker" style={styles.kicker}>KHMER LIVING ARCHIVE</p>
            <h1 className="archive-title" style={styles.title}>{collection.name}</h1>
            <p className="archive-description" style={styles.description}>{collection.description}</p>
          </div>
          <div className="archive-search-wrap">
            <label className="archive-search-label" style={styles.searchLabel} htmlFor="archive-search">
              SEARCH THE ARCHIVE
            </label>
            <div className="archive-search-control">
              <span className="archive-search-icon" aria-hidden="true">⌕</span>
              <input
                className="archive-search-input"
                id="archive-search"
                type="search"
                placeholder="Search music, instruments, places..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={styles.searchInput}
                aria-label="Search the archive"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="archive-info-card" style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div className="archive-info-card" style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <h2 className="archive-section-label" style={styles.sectionLabel}>THE COLLECTION</h2>

      <p style={styles.count}>
        showing {filtered.length} of {entries.length} entries
      </p>

      <div className="archive-results archive-entry-grid">
        {paginatedEntries.map((entry) => (
          <EntryCard
            key={entry.title}
            titleEn={entry.titleEn}
            titleKh={entry.titleKh}
            descriptionEn={entry.descriptionEn}
            descriptionKh={entry.descriptionKh}
            contributorEn={entry.contributorEn}
            contributorKh={entry.contributorKh}
            placeEn={entry.placeEn}
            placeKh={entry.placeKh}
            type={entry.type}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={styles.none}>No entries found.</p>
      )}

      {filtered.length > 0 && totalPages > 1 && (
        <nav className="archive-pagination" style={styles.pagination} aria-label="Pagination">
          <button
            type="button"
            className="archive-page-button"
            style={styles.pageButton}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                className="archive-page-button"
                style={{
                  ...styles.pageButton,
                   ...(safeCurrentPage === page ? styles.activePage : {}),
                }}
                 onClick={() => setCurrentPage(page)}
                 aria-current={safeCurrentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ),
          )}
          <button
            type="button"
            className="archive-page-button"
            style={styles.pageButton}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}
      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}



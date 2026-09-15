import Link from "next/link";

export default function ArchiveNav({ current = "archive" }) {
  return (
    <nav className="archive-nav" aria-label="Primary navigation">
      <Link className="archive-brand" href="/" aria-label="Khmer Traditional Music home">
        <span className="archive-brand-mark" aria-hidden="true">♫</span>
        <span>
          <strong>Khmer Traditional Music</strong>
          <small>Living cultural archive</small>
        </span>
      </Link>
      <div className="archive-nav-links">
      <Link className={`archive-nav-link ${current === "archive" ? "is-active" : ""}`} href="/" aria-current={current === "archive" ? "page" : undefined}>Archive</Link>
      <Link className="archive-nav-link" href="/#collection">Collection</Link>
      <Link className="archive-nav-link" href="/#about">About</Link>
      </div>
    </nav>
  );
}
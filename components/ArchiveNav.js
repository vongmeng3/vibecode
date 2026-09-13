import Link from "next/link";

export default function ArchiveNav({ current = "archive" }) {
  return (
    <nav className="archive-nav" aria-label="Primary navigation">
      <Link className={`archive-nav-link ${current === "archive" ? "is-active" : ""}`} href="/" aria-current={current === "archive" ? "page" : undefined}>Archive</Link>
      <Link className="archive-nav-link" href="/#collection">Collection</Link>
      <Link className="archive-nav-link" href="/#about">About</Link>
    </nav>
  );
}
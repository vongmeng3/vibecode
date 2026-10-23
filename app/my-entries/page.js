"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { entryHref } from "../../lib/entry-slugs.js";
import { styles } from "../../lib/entry-form-styles.js";
import { useArchiveUser } from "../../lib/use-archive-user.js";

// Plain-words label for each review status, in both languages.
const STATUS_LABELS = {
  pending: "Waiting for review / កំពុងរង់ចាំការពិនិត្យ",
  published: "Published / បានផ្សព្វផ្សាយ",
  returned: "Returned to you / បានប្រគល់ត្រឡប់មកអ្នកវិញ",
};

const listStyles = {
  item: { padding: "16px 0", borderBottom: "1px solid rgba(226, 183, 109, 0.2)" },
  title: { color: "#F4F0E8", fontSize: 18, fontWeight: 700, textDecoration: "none" },
  status: { margin: "6px 0 0", color: "#97A1B3", fontSize: 14 },
};

export default function MyEntriesPage() {
  const { user, loading, error: authError, supabase } = useArchiveUser();
  const [record, setRecord] = useState({ entries: [], loading: true, error: "" });

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase.from("entries").select("id, title_en, title_kh, status")
      .eq("owner", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (active) setRecord({ entries: data || [], loading: false, error: error ? "Unable to load your entries. Please try again." : "" });
      });
    return () => { active = false; };
  }, [supabase, user?.id]);

  let content;
  if (loading) {
    content = <p style={styles.description}>Checking your account...</p>;
  } else if (!user) {
    content = <div style={styles.loginPrompt}>
      <p role="alert" style={styles.loginMessage}>{authError || "Please log in to see your entries."}</p>
      <Link href="/login" style={styles.loginButton}>Log in</Link>
    </div>;
  } else if (record.loading) {
    content = <p style={styles.description}>Loading your entries...</p>;
  } else if (record.error) {
    content = <p role="alert" style={styles.message}>{record.error}</p>;
  } else if (record.entries.length === 0) {
    content = <div style={styles.loginPrompt}>
      <p className="english-text" style={styles.loginMessage}>You have not contributed any entries yet.</p>
      <p className="khmer-text" style={styles.loginMessage}>អ្នកមិនទាន់បានចូលរួមចំណែកធាតុណាមួយនៅឡើយទេ។</p>
      <Link href="/contribute" style={styles.loginButton}>Contribute / ចូលរួមចំណែក</Link>
    </div>;
  } else {
    content = <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {record.entries.map((entry) => (
        <li key={entry.id} style={listStyles.item}>
          <Link href={entryHref(entry)} style={listStyles.title}>
            <span className="khmer-title">{entry.title_kh}</span>{entry.title_kh && entry.title_en && " / "}<span className="english-text">{entry.title_en}</span>
          </Link>
          <p style={listStyles.status}>{STATUS_LABELS[entry.status] || entry.status}</p>
        </li>
      ))}
    </ul>;
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={{ color: "#2EE6A8", display: "inline-block", marginBottom: 24, textDecoration: "none" }}>← Back to Browse</Link>
        <div style={styles.kicker}>MY ENTRIES / ការចូលរួមរបស់ខ្ញុំ</div>
        <h1 style={styles.title}>My entries</h1>
        <div style={styles.card}>{content}</div>
      </div>
    </main>
  );
}

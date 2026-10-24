"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewQueueItem from "../../components/ReviewQueueItem.js";
import { styles } from "../../lib/entry-form-styles.js";
import { useArchiveUser } from "../../lib/use-archive-user.js";

export default function ReviewPage() {
  const { user, loading, supabase } = useArchiveUser();
  const [queue, setQueue] = useState({ userId: null, isReviewer: false, entries: [], loading: true, error: "" });

  useEffect(() => {
    if (!user) return;
    let active = true;
    const done = (changes) => { if (active) setQueue({ userId: user.id, isReviewer: false, entries: [], loading: false, error: "", ...changes }); };
    setQueue({ userId: user.id, isReviewer: false, entries: [], loading: true, error: "" });

    async function loadQueue() {
      // Hiding this page is politeness. The database is the gate: review_entry
      // refuses anyone who is not on the reviewers list.
      const { data: isReviewer } = await supabase.rpc("is_reviewer");
      if (isReviewer !== true) return done({});
      const { data, error } = await supabase.from("entries")
        .select("id, title_en, title_kh, contributor_en, contributor_kh, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      done({ isReviewer: true, entries: data || [], error: error ? "Unable to load the review queue. Please try again." : "" });
    }
    loadQueue().catch(() => done({ error: "Unable to load the review queue. Please check your connection and try again." }));
    return () => { active = false; };
  }, [supabase, user?.id]);

  function removeReviewed(id) {
    setQueue((current) => ({ ...current, entries: current.entries.filter((entry) => entry.id !== id) }));
  }

  let content;
  if (loading) {
    content = <p style={styles.description}>Checking your account...</p>;
  } else if (!user) {
    content = <div style={styles.loginPrompt}>
      <p role="alert" style={styles.loginMessage}>Please log in to review entries.</p>
      <Link href="/login" style={styles.loginButton}>Log in</Link>
    </div>;
  } else if (queue.loading || queue.userId !== user.id) {
    content = <p style={styles.description}>Loading the review queue...</p>;
  } else if (queue.error) {
    content = <p role="alert" style={styles.message}>{queue.error}</p>;
  } else if (!queue.isReviewer) {
    content = <p role="alert" style={styles.message}>Only reviewers can open the review queue.</p>;
  } else if (queue.entries.length === 0) {
    content = <div style={styles.loginPrompt}>
      <p className="english-text" style={styles.loginMessage}>Nothing is waiting for review.</p>
      <p className="khmer-text" style={styles.loginMessage}>មិនមានការចូលរួមណាមួយកំពុងរង់ចាំការពិនិត្យទេ។</p>
    </div>;
  } else {
    content = <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {queue.entries.map((entry) => (
        <ReviewQueueItem key={entry.id} entry={entry} supabase={supabase} onReviewed={removeReviewed} />
      ))}
    </ul>;
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={{ color: "#2EE6A8", display: "inline-block", marginBottom: 24, textDecoration: "none" }}>← Back to Browse</Link>
        <div style={styles.kicker}>REVIEW QUEUE / ការពិនិត្យ</div>
        <h1 style={styles.title}>Waiting for review</h1>
        <p style={styles.description}>Oldest first. Open an entry to read it before you decide.</p>
        <div style={styles.card}>{content}</div>
      </div>
    </main>
  );
}

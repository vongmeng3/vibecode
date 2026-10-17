"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { entryHref } from "../lib/entry-slugs.js";
import { styles } from "../lib/entry-form-styles.js";
import { useArchiveUser } from "../lib/use-archive-user.js";
import EntryEditForm from "./EntryEditForm.js";

export default function EntryEditor({ id }) {
  const { user, loading, error: authError, supabase } = useArchiveUser();
  const [record, setRecord] = useState({ entry: null, userId: null, loading: true, error: "" });

  useEffect(() => {
    if (!user) return;
    let active = true;
    setRecord({ entry: null, userId: user.id, loading: true, error: "" });
    async function loadEntry() {
      try {
        const { data, error } = await supabase.from("entries").select("*")
          .eq("id", id).eq("owner", user.id).maybeSingle();
        if (active) setRecord({
          entry: error ? null : data, userId: user.id, loading: false,
          error: error ? "Unable to load this entry. Please try again." : "",
        });
      } catch {
        if (active) setRecord({ entry: null, userId: user.id, loading: false, error: "Unable to load this entry. Please check your connection and try again." });
      }
    }
    loadEntry();
    return () => { active = false; };
  }, [id, supabase, user?.id]);

  let content;
  if (loading) {
    content = <p style={styles.description}>Checking your account...</p>;
  } else if (!user) {
    content = <div style={styles.loginPrompt}>
      <p role="alert" style={styles.loginMessage}>{authError || "Please log in to edit an entry you own."}</p>
      <Link href="/login" style={styles.loginButton}>Log in</Link>
    </div>;
  } else if (record.loading || record.userId !== user.id || (record.entry && record.entry.id !== id)) {
    content = <p style={styles.description}>Loading your entry...</p>;
  } else if (record.error || !record.entry || record.entry.owner !== user.id) {
    content = <p role="alert" style={styles.message}>{record.error || "This entry is unavailable or you do not have permission to edit it."}</p>;
  } else {
    content = <EntryEditForm key={`${id}:${user.id}`} entry={record.entry} supabase={supabase} />;
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href={entryHref(record.entry || { id })} style={{ color: "#2EE6A8", display: "inline-block", marginBottom: 24, textDecoration: "none" }}>← Back to entry</Link>
        <div style={styles.kicker}>EDIT / កែប្រែ</div>
        <h1 style={styles.title}>Edit your entry</h1>
        <p style={styles.description}>Update the archive information. Leave the photo field empty to keep the current photo.</p>
        <div style={styles.card}>{content}</div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useArchiveUser } from "../lib/use-archive-user.js";
import EntryDeleteButton from "./EntryDeleteButton.js";

export default function EntryOwnerActions({ id, owner, title, href }) {
  const { user, loading, supabase } = useArchiveUser();
  const [deleted, setDeleted] = useState(false);
  if (loading || !user || user.id !== owner) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 16, margin: "0 0 24px" }}>
      {!deleted && <Link href={href} style={{ color: "#2EE6A8", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
        Edit / កែប្រែ
      </Link>}
      <EntryDeleteButton id={id} owner={owner} title={title} supabase={supabase} onDeleted={() => setDeleted(true)} />
    </div>
  );
}

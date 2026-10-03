"use client";

import { useParams } from "next/navigation";

export default function EntryDetailPage() {
  const params = useParams();

  return (
    <main style={{ padding: "40px", color: "white" }}>
      <h1>Entry Detail Page Works</h1>
      <p>Entry ID: {params?.id}</p>
    </main>
  );
}
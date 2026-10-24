"use client";

import { useEffect, useRef, useState } from "react";
import { useArchiveUser } from "../lib/use-archive-user.js";

// Reviewers only: take a published entry off the public shelf by returning it
// to its contributor. Hiding the button is politeness; take_down_entry in the
// database refuses non-reviewers and entries that are not published.
export default function ReviewerTakeDown({ id, title }) {
  const { user, supabase } = useArchiveUser();
  const busy = useRef(false);
  const [isReviewer, setIsReviewer] = useState(false);
  const [pending, setPending] = useState(false);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setIsReviewer(false);
      return;
    }
    let active = true;
    supabase.rpc("is_reviewer")
      .then(({ data }) => { if (active) setIsReviewer(data === true); })
      .catch(() => { if (active) setIsReviewer(false); });
    return () => { active = false; };
  }, [supabase, user?.id]);

  async function handleTakeDown() {
    if (busy.current || finished) return;
    if (!window.confirm(`Take down “${title || "this entry"}”? The public will no longer see it, and it goes back to its contributor as returned.`)) return;
    busy.current = true;
    setPending(true);
    setMessage("");
    try {
      const { data, error } = await supabase.rpc("take_down_entry", { entry_id: id });
      if (error || data !== true) {
        setMessage("This entry was not taken down. It may no longer be published, or you may no longer be a reviewer.");
        return;
      }
      setFinished(true);
      setMessage("Taken down. The public can no longer see this entry, and its contributor sees it as returned.");
    } catch {
      setMessage("Unable to take down this entry. Please check your connection and try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  if (!isReviewer) return null;

  return (
    <div style={{ margin: "0 0 24px" }}>
      <button type="button" onClick={handleTakeDown} disabled={pending || finished}
        style={{ padding: "6px 12px", color: "#E2B76D", background: "rgba(226, 183, 109, 0.08)", border: "1px solid rgba(226, 183, 109, 0.4)", borderRadius: 8, fontSize: 14, cursor: pending || finished ? "default" : "pointer" }}>
        {finished ? "Taken down" : pending ? "Taking down..." : "Take down / ដកចេញ"}
      </button>
      {message && <p role={finished ? "status" : "alert"} style={{ color: finished ? "#E2B76D" : "#FFB3B3", fontSize: 14, lineHeight: 1.5 }}>{message}</p>}
    </div>
  );
}

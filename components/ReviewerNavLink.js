"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";

// Shows the review queue link to reviewers only. This is politeness:
// review_entry in the database refuses anyone who is not a reviewer.
export default function ReviewerNavLink({ userId }) {
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    let active = true;
    setIsReviewer(false);
    createClient().rpc("is_reviewer")
      .then(({ data }) => { if (active) setIsReviewer(data === true); })
      .catch(() => { if (active) setIsReviewer(false); });
    return () => { active = false; };
  }, [userId]);

  if (!isReviewer) return null;
  return <Link className="archive-nav-link" href="/review">Review / ការពិនិត្យ</Link>;
}

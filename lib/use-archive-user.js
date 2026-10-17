"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client.js";

export function useArchiveUser() {
  const [supabase] = useState(() => createClient());
  const [auth, setAuth] = useState({ user: null, loading: true, error: "" });

  useEffect(() => {
    let active = true;
    let authChanged = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Verify the initial stored session with getUser before showing owner actions.
      if (event === "INITIAL_SESSION") return;
      authChanged = true;
      if (active) setAuth({ user: session?.user ?? null, loading: false, error: "" });
    });

    supabase.auth.getUser().then(({ data, error }) => {
      if (active && !authChanged) {
        setAuth({ user: error ? null : data.user, loading: false, error: error ? "Please log in again to edit an entry." : "" });
      }
    }).catch(() => {
      if (active && !authChanged) setAuth({ user: null, loading: false, error: "Unable to check your account. Please try again." });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { ...auth, supabase };
}

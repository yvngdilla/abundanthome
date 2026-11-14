"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { browserAuth } from "@/lib/auth/browser";

// "Sign in" or "Account" in the header, read from the local session so public pages stay static.
export function AccountLink({ className }: { className?: string }) {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const sb = browserAuth();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = sb.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!browserAuth()) return null;
  return (
    <Link className={className} href={signedIn ? "/account" : "/account/sign-in"}>
      {signedIn ? "Your account" : "Sign in"}
    </Link>
  );
}

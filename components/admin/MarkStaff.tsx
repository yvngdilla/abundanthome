"use client";

import { useEffect } from "react";
import { visitorId } from "@/lib/visitor-client";

// Runs on the admin page: this browser stops sending page views, and its id is saved as staff
// so visits it made before are left out of the numbers too.
export function MarkStaff() {
  useEffect(() => {
    try {
      localStorage.setItem("ah_staff", "1");
    } catch {}
    const v = visitorId();
    if (v) fetch("/api/admin/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ v }) }).catch(() => {});
  }, []);
  return null;
}

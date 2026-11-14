"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Records the purchase once per order in Vercel Analytics, GA4 and Clarity.
export function PurchaseEvent({ id, product, value }: { id: string; product: string; value: number }) {
  useEffect(() => {
    const key = "ah_purchase_" + id;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    track("purchase", { product, value, currency: "USD", transaction_id: id });
  }, [id, product, value]);
  return null;
}

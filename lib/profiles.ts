import type { SupabaseClient } from "@supabase/supabase-js";

// Profiles are the anchor table: one row per person, keyed on email. Subscriptions, orders and email
// sends point at a profile; a visitor (one browser) is linked to a profile once it signs up or buys.
// Everything here is best-effort: a failure returns null and never blocks a sign-up or an order.

const VISITOR = /^[A-Za-z0-9-]{8,64}$/;

// The browser id if we have a visitors row for it, otherwise null (so foreign keys never fail).
export async function knownVisitor(db: SupabaseClient, id: unknown): Promise<string | null> {
  if (typeof id !== "string" || !VISITOR.test(id)) return null;
  const { data, error } = await db.from("visitors").select("id").eq("id", id).maybeSingle();
  return error || !data ? null : (data.id as string);
}

// Finds or creates the profile for an email and, when a known visitor is given, links that browser to it.
export async function ensureProfile(db: SupabaseClient, email: string | null | undefined, visitorId?: string | null): Promise<string | null> {
  const e = email?.trim().toLowerCase();
  if (!e) return null;
  try {
    await db.from("profiles").upsert({ email: e }, { onConflict: "email", ignoreDuplicates: true });
    const { data, error } = await db.from("profiles").select("id").eq("email", e).maybeSingle();
    if (error || !data) {
      if (error) console.error("profiles: lookup failed", error.message);
      return null;
    }
    const id = data.id as string;
    if (visitorId) {
      const { error: linkError } = await db.from("visitors").update({ profile_id: id }).eq("id", visitorId).is("profile_id", null);
      if (linkError) console.error("profiles: visitor link failed", linkError.message);
    }
    return id;
  } catch (err) {
    console.error("profiles: failed", err instanceof Error ? err.message : err);
    return null;
  }
}

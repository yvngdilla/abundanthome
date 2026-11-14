import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { authEnv } from "@/lib/auth/config";

// Supabase auth on the server, reading and refreshing the session cookie.
export async function authClient() {
  const env = authEnv();
  if (!env) return null;
  const store = await cookies();
  return createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const c of list) store.set(c.name, c.value, c.options);
        } catch {
          // Called from a server component: the proxy refreshes the cookie instead.
        }
      },
    },
  });
}

// The signed-in user, verified with Supabase (not just read from the cookie).
export async function currentUser(): Promise<User | null> {
  const sb = await authClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

export function displayName(user: User): string {
  const m = user.user_metadata ?? {};
  return (m.full_name || m.name || m.given_name || user.email?.split("@")[0] || "there") as string;
}

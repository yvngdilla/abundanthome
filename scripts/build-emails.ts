// npm run emails:auth
// Writes the Supabase sign-in email templates (supabase/templates/*.html) from the same layout as every other
// email. With an output folder as the first argument it also writes every email there, for review.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { authEmails } from "@/lib/email/content";
import { previews } from "@/lib/email/preview";

const groups = previews();
const account = groups.find((g) => g.name === "Account")!;
mkdirSync("supabase/templates", { recursive: true });
for (const def of Object.values(authEmails)) {
  const p = account.items.find((i) => i.key === def.key)!;
  writeFileSync(join("supabase/templates", def.file), p.html);
  console.log("wrote supabase/templates/" + def.file, "| subject:", def.subject);
}

const out = process.argv[2];
if (out) {
  mkdirSync(out, { recursive: true });
  for (const g of groups) for (const p of g.items) writeFileSync(join(out, p.key + ".html"), p.html);
  writeFileSync(join(out, "index.json"), JSON.stringify(groups.map((g) => ({ ...g, items: g.items.map(({ html, ...r }) => r) })), null, 2));
  console.log("wrote", groups.reduce((n, g) => n + g.items.length, 0), "emails to", out);
}

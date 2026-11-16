// Email addresses that belong to the team, left out of every count on the admin dashboard
// (sign-ups, accounts, buyers), together with everyone listed in ADMIN_EMAILS.
// Nancy's personal addresses are here because she signs up and tests with them.
export const staffEmails: string[] = ["nancy@abundanthomedesign.com", "nanbo1228@gmail.com", "nanbwlr@aol.com"];

export function staffEmailSet(): Set<string> {
  const fromEnv = (process.env.ADMIN_EMAILS || "").split(",");
  return new Set([...staffEmails, ...fromEnv].map((e) => e.trim().toLowerCase()).filter(Boolean));
}

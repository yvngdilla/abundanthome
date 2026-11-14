import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const failed = (await searchParams).error;
  const configured = Boolean(process.env.ADMIN_PASSWORD && process.env.SIGNING_SECRET);
  const accounts = Boolean(process.env.ADMIN_EMAILS);
  return (
    <section className="hero">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <p className="eyebrow">Abundant Home</p>
        <h1>Admin</h1>
        {configured ? (
          <form method="post" action="/api/admin/login" className="admin-login">
            <label htmlFor="pw">Password</label>
            <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus />
            {failed && <p className="admin-error" role="alert">That password did not work.</p>}
            <button className="btn" type="submit">Sign in</button>
          </form>
        ) : accounts ? null : (
          <p className="lede">The admin is locked. Set ADMIN_PASSWORD and SIGNING_SECRET in Vercel to turn it on.</p>
        )}
        {accounts && (
          <p style={{ marginTop: 24 }}>
            <a href="/account/sign-in?next=/admin">Sign in with your Abundant Home account</a> (Google or email).
          </p>
        )}
      </div>
    </section>
  );
}

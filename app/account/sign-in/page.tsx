import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { safeNext } from "@/lib/auth/config";
import { SignInForm } from "@/components/SignInForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await currentUser()) redirect(next);
  return (
    <section className="hero">
      <div className="wrap signin-wrap">
        <p className="eyebrow">Your account</p>
        <h1>Sign in or create an account</h1>
        <p className="lede" style={{ marginTop: 12 }}>Keep your workbooks in one place, download them again anytime, and choose which emails you get.</p>
        {sp.error && <p className="signin-error" role="alert">{sp.error}</p>}
        <SignInForm next={next} />
        <p className="signin-note" style={{ marginTop: 24 }}>
          Member of The Guide to Living in Abundance? Your lessons are on the{" "}
          <a href="https://members.abundanthomedesign.com/account">members site</a>.
        </p>
      </div>
    </section>
  );
}

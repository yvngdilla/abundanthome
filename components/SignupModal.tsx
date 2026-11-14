"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { EmailSignup, SIGNED_UP_KEY } from "@/components/EmailSignup";
import { track } from "@/lib/track";
import { pages, site } from "@/lib/site";

const DISMISSED_KEY = "ah_modal_dismissed_at";
const QUIET_DAYS = 14; // after someone closes it, wait this long before showing it again
const DELAY_MS = 40_000; // or after this long on a page
const SCROLL_DEPTH = 0.6; // or once they are past the mid-article form

// Pages where the modal never appears: the challenge page already is the sign-up.
const NEVER = new Set<string>([pages.challenge.path, "/privacy-policy"]);
// Pages where only leaving triggers it, so it never interrupts someone using the tool.
const EXIT_ONLY = new Set<string>([pages.template.path]);

function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function shouldSkip(): boolean {
  if (readStore(SIGNED_UP_KEY)) return true;
  const dismissed = Number(readStore(DISMISSED_KEY));
  return Boolean(dismissed) && Date.now() - dismissed < QUIET_DAYS * 86_400_000;
}

// An inline sign-up form is already on screen: the popup would only cover it.
function inlineFormVisible(): boolean {
  return Array.from(document.querySelectorAll("main .signup")).some((el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  });
}

function copyFor(path: string) {
  if (path.startsWith("/vision-board") || path === pages.howTo.path) {
    return {
      eyebrow: `Free · Starts ${site.challengeStart}`,
      heading: "Before you make your board, make room for it",
      body: "Join the free 5-day declutter challenge. Fifteen minutes a day, and on day five we clear the spot where your vision board will live.",
    };
  }
  if (path === pages.bedroomColors.path) {
    return {
      eyebrow: `Free · Starts ${site.challengeStart}`,
      heading: "Clear the room before you paint it",
      body: "Join the free 5-day declutter challenge. Day one starts with your nightstand: the first and last thing you see each day.",
    };
  }
  return {
    eyebrow: `Free · Starts ${site.challengeStart}`,
    heading: "Start the year with room to grow",
    body: "Join the free 5-day declutter challenge. Fifteen minutes a day, one small space at a time.",
  };
}

export function SignupModal() {
  const path = usePathname() || "/";
  const ref = useRef<HTMLDialogElement>(null);
  const [joined, setJoined] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    shown.current = false;
    if (NEVER.has(path) || shouldSkip()) return;
    const exitOnly = EXIT_ONLY.has(path);

    const open = (trigger: string) => {
      const dialog = ref.current;
      if (shown.current || !dialog || dialog.open || shouldSkip()) return;
      // Never cover a field someone is typing in.
      const active = document.activeElement;
      if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;
      if (trigger !== "exit" && inlineFormVisible()) return;
      shown.current = true;
      dialog.showModal();
      track("modal_view", { trigger, path });
      cleanup();
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (depth >= SCROLL_DEPTH) open("scroll");
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) open("exit");
    };
    const timer = exitOnly ? undefined : window.setTimeout(() => open("time"), DELAY_MS);

    if (!exitOnly) window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    }
    return cleanup;
  }, [path]);

  function close() {
    ref.current?.close();
  }

  function onClose() {
    if (joined) return;
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
    track("modal_dismiss", { path });
  }

  const copy = copyFor(path);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="signup-modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-art" aria-hidden="true" />
      <button type="button" className="modal-close" aria-label="Close" onClick={close}>
        ×
      </button>
      <div className="modal-body">
        <EmailSignup
          list="declutter-challenge"
          source="modal"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
          button="Join the challenge"
          success="You are in. Watch your inbox for day one."
          headingId="signup-modal-title"
          onDone={() => setJoined(true)}
        />
        {!joined && (
          <button type="button" className="modal-skip" onClick={close}>
            Not now
          </button>
        )}
      </div>
    </dialog>
  );
}

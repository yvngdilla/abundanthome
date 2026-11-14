"use client";

import { useEffect, useRef } from "react";
import { EmailSignup, SIGNED_UP_KEY } from "@/components/EmailSignup";
import { track } from "@/lib/track";

// True once this browser has signed up to any list, so a free download is never gated twice.
export function hasUnlocked(): boolean {
  try {
    return Boolean(localStorage.getItem(SIGNED_UP_KEY));
  } catch {
    return false;
  }
}

type Props = {
  open: boolean;
  item: string; // what is being downloaded, for analytics, e.g. "vision-board"
  heading: string;
  body: string;
  button: string;
  onUnlock: () => void;
  onCancel: () => void;
};

// An email gate for free downloads: a dialog that asks for an email, then hands back to the caller to download.
export function EmailGate({ open, item, heading, body, button, onUnlock, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const unlocked = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      unlocked.current = false;
      dialog.showModal();
      track("gate_view", { item, path: window.location.pathname });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, item]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="email-gate-title"
      onClose={() => {
        if (!unlocked.current) {
          track("gate_dismiss", { item, path: window.location.pathname });
          onCancel();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="modal-art" aria-hidden="true" />
      <button type="button" className="modal-close" aria-label="Close" onClick={() => ref.current?.close()}>
        ×
      </button>
      <div className="modal-body">
        <EmailSignup
          list="vision-board"
          source={`gate:${item}`}
          eyebrow="Free download"
          heading={heading}
          headingId="email-gate-title"
          body={body}
          button={button}
          success="Thank you. Your download is starting."
          note="Your download starts right away. You will also get occasional notes from Nancy. Unsubscribe anytime."
          onDone={() => {
            unlocked.current = true;
            track("gate_unlock", { item, path: window.location.pathname });
            ref.current?.close();
            onUnlock();
          }}
        />
      </div>
    </dialog>
  );
}

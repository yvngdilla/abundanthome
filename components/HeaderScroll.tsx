"use client";

import { useEffect } from "react";

// Slides the site header up out of the way while scrolling down, and back when scrolling up.
// Sets data-nav="hidden" on <html> so sticky elements (the "On this page" list) can move up with it.
export function HeaderScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const header = document.querySelector(".site-header");
      const busy = header?.matches(":focus-within") || document.querySelector(".mobile-menu[open]");
      if (y < 120 || busy) root.dataset.nav = "shown";
      else if (y > last + 6) root.dataset.nav = "hidden";
      else if (y < last - 6) root.dataset.nav = "shown";
      if (Math.abs(y - last) > 6 || y < 120) last = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.nav;
    };
  }, []);
  return null;
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISMISS_KEY = "bs-beta-banner-dismissed";

export function BetaBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    // Tiny delay so it doesn't compete with first paint or the PWA prompt.
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setShow(false);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[70] bg-accent text-accent-foreground"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <p className="flex-1 leading-snug">
              <strong className="font-semibold">Early testing.</strong>{" "}
              <span className="opacity-90">
                BuildingSync is under active development — features may change or break. Not yet a live production service. Feedback:{" "}
                <a
                  href="mailto:info@buildingsync.app"
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  info@buildingsync.app
                </a>
                .
              </span>
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss notice"
              className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-accent-foreground/10 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

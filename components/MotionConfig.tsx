"use client";

import { MotionConfig as FramerMotionConfig } from "framer-motion";
import { useEffect, useState } from "react";

// Wraps the whole app in framer-motion's reduced-motion mode when the
// user has prefers-reduced-motion: reduce in their OS settings. Honors
// AODA / WCAG SC 2.3.3 (Animation from Interactions).
export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <FramerMotionConfig reducedMotion={reduced ? "always" : "never"}>
      {children}
    </FramerMotionConfig>
  );
}

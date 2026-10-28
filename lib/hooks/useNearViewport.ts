"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Flags an element once it approaches the viewport, so heavy children (WebGL
 * scenes) can be created on demand instead of during the initial load.
 */
export function useNearViewport<T extends HTMLElement>(rootMargin = "480px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;

    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
}

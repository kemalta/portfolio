"use client";

import { useEffect, useState } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * Holds expensive client-only work (WebGL boot, large dynamic chunks) until
 * after the first paint and, when available, until the main thread is idle.
 * Critical content is therefore never blocked by scene setup.
 */
export function useDeferredMount(delay = 220): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return;
      if (typeof idleWindow.requestIdleCallback === "function") {
        idleHandle = idleWindow.requestIdleCallback(
          () => {
            if (!cancelled) setReady(true);
          },
          { timeout: 1400 },
        );
        return;
      }
      setReady(true);
    };

    const timer = window.setTimeout(schedule, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (
        idleHandle !== undefined &&
        typeof idleWindow.cancelIdleCallback === "function"
      ) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
    };
  }, [delay]);

  return ready;
}

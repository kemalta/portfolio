"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollToTarget = string | HTMLElement | number;

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: ScrollToTarget, offset?: number) => void;
  stop: () => void;
  start: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      gestureOrientation: "vertical",
    });

    const loop = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    setLenis(instance);
    document.documentElement.classList.add("lenis", "lenis-smooth");

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      instance.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: ScrollToTarget, offset = -72) => {
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
        return;
      }
      // Graceful fallback (reduced motion / no JS smooth scroll).
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
      const node =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : target;
      if (node) {
        const top = node.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [lenis],
  );

  const stop = useCallback(() => {
    document.documentElement.classList.add("lenis-stopped");
    if (lenis) lenis.stop();
  }, [lenis]);

  const start = useCallback(() => {
    document.documentElement.classList.remove("lenis-stopped");
    if (lenis) lenis.start();
  }, [lenis]);

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

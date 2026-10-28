"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSmoothScroll } from "@/components/layout/SmoothScrollProvider";
import type { Project } from "@/lib/site";

const loading = () => (
  <div className="flex h-[320px] animate-pulse flex-col gap-3 border border-line bg-ink/[0.02] p-4">
    <div className="h-2 w-24 bg-ink/10" />
    <div className="h-24 w-full bg-ink/[0.06]" />
    <div className="h-2 w-2/3 bg-ink/10" />
    <div className="mt-auto h-2 w-1/3 bg-ink/10" />
  </div>
);

const TopologyExplorerDemo = dynamic(
  () =>
    import("@/components/projects/TopologyExplorerDemo").then(
      (mod) => mod.TopologyExplorerDemo,
    ),
  { ssr: false, loading },
);

const MonitoringDemo = dynamic(
  () =>
    import("@/components/projects/MonitoringDemo").then(
      (mod) => mod.MonitoringDemo,
    ),
  { ssr: false, loading },
);

const SocDemo = dynamic(
  () => import("@/components/projects/SocDemo").then((mod) => mod.SocDemo),
  { ssr: false, loading },
);

const AiWorkflowDemo = dynamic(
  () =>
    import("@/components/projects/AiWorkflowDemo").then(
      (mod) => mod.AiWorkflowDemo,
    ),
  { ssr: false, loading },
);

const CreativeDemo = dynamic(
  () =>
    import("@/components/projects/CreativeDemo").then(
      (mod) => mod.CreativeDemo,
    ),
  { ssr: false, loading },
);

const demoMap: Record<Project["visual"], React.ComponentType> = {
  topology: TopologyExplorerDemo,
  monitoring: MonitoringDemo,
  soc: SocDemo,
  ai: AiWorkflowDemo,
  creative: CreativeDemo,
};

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { stop, start } = useSmoothScroll();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!project) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stop();
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;

      const focusables = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!panel.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      start();
      previousFocus?.focus();
    };
  }, [project, onClose, start, stop]);

  if (typeof document === "undefined") return null;

  const Demo = project ? demoMap[project.visual] : null;
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.23, 1, 0.32, 1] as const };

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          key="modal"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
        >
          <div
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
          />

          <motion.div
            key="panel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={transition}
            className="relative z-10 flex max-h-[94svh] w-full max-w-5xl flex-col border border-line bg-[#080c10] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_40px_120px_rgba(0,0,0,0.6)] sm:max-h-[90svh] sm:pb-0"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">
                    Proje {project.index}
                  </span>
                  <span className="h-3 w-px bg-line" />
                  <span className="border border-amber/35 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-amber">
                    {project.note}
                  </span>
                </div>
                <h2
                  id="project-modal-title"
                  className="mt-2 truncate font-display text-[clamp(1.3rem,3vw,1.9rem)] font-medium tracking-[-0.03em] text-ink"
                >
                  {project.title}
                </h2>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {project.subtitle}
                </p>
              </div>

              <button
                ref={closeButton}
                type="button"
                onClick={onClose}
                aria-label="Demoyu kapat"
                className="grid h-9 w-9 shrink-0 place-items-center border border-line text-dim transition-colors hover:border-ink/35 hover:text-ink"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 3l8 8M11 3l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5"
            >
              {Demo ? <Demo /> : null}

              <div className="mt-5 grid gap-5 border-t border-line pt-4 md:grid-cols-[1.6fr_1fr]">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                    Detay
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
                    {project.detail}
                  </p>
                  <p className="mt-3 text-[11px] leading-relaxed text-faint">
                    Bu bir konsept demodur. Gerçek müşteri verisi, üretim
                    telemetrisi veya bağlı bir sistem içermez.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                    Yığın
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {project.tech.map((item) => (
                      <li
                        key={item}
                        className="border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 sm:px-6">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                Konsept demo · örnek veri
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                ESC ile kapat
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

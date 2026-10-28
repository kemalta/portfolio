"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/components/layout/SmoothScrollProvider";

const menuTransition = { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const };

export function Navbar() {
  const { scrollTo, stop, start } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    const node = menuRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.offsetParent !== null);

    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (href: string) => {
      const wasOpen = open;
      setOpen(false);
      if (wasOpen) {
        // The overlay holds a Lenis stop + body lock. Release both before
        // handing control to the smooth scroll, otherwise the call is a no-op.
        document.body.style.overflow = "";
        start();
        requestAnimationFrame(() => scrollTo(href, -76));
        return;
      }
      scrollTo(href, -76);
    },
    [open, scrollTo, start],
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
          scrolled
            ? "border-line bg-void/85 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="shell flex h-[70px] items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              go("#top");
            }}
            className="group flex items-center gap-3"
            aria-label="Kemal Talha Ekici — başa dön"
          >
            <span className="relative grid h-9 w-9 place-items-center border border-line bg-ink text-[11px] font-semibold tracking-[0.02em] text-void transition-colors duration-200 group-hover:border-cyan">
              KTE
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-cyan" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[13px] font-semibold tracking-[-0.01em] text-ink">
                Kemal Talha Ekici
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
                ICT Systems / Security / AI
              </span>
            </span>
          </a>

          <nav aria-label="Ana navigasyon" className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  go(item.href);
                }}
                aria-current={active === item.href ? "true" : undefined}
                className={cn(
                  "group relative flex items-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200",
                  active === item.href
                    ? "text-ink"
                    : "text-dim hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "h-1 w-1 transition-colors duration-200",
                    active === item.href
                      ? "bg-cyan"
                      : "bg-transparent group-hover:bg-faint",
                  )}
                />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go("#iletisim")}
              className="btn btn-ghost hidden h-9 px-4 text-[9px] sm:inline-flex"
            >
              İletişim
              <ArrowUpRight />
            </button>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className="grid h-9 w-9 place-items-center border border-line text-ink transition-colors duration-200 hover:border-ink/40 lg:hidden"
            >
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span
                  className={cn(
                    "h-px w-full bg-current transition-transform duration-200 ease-out-expo",
                    open && "translate-y-[5.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-current transition-opacity duration-150",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-current transition-transform duration-200 ease-out-expo",
                    open && "-translate-y-[5.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigasyon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-void/96 backdrop-blur-xl lg:hidden"
          >
            <div className="shell flex h-full flex-col justify-between pb-8 pt-28">
              <nav aria-label="Mobil navigasyon bağlantıları">
                <ul className="border-t border-line">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 + index * 0.045,
                        duration: 0.4,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="border-b border-line"
                    >
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          go(item.href);
                        }}
                        className="flex items-baseline justify-between py-5"
                      >
                        <span className="font-display text-[clamp(1.8rem,8vw,2.6rem)] font-medium tracking-[-0.04em] text-ink">
                          {item.label}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
                          {item.index}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  <span className="h-1.5 w-1.5 animate-led bg-lime" />
                  ICT Engineering / AI / Security / Infrastructure
                </div>
                {siteConfig.email ? (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="link-line break-all font-display text-lg text-ink"
                  >
                    {siteConfig.email}
                  </a>
                ) : null}
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  © {siteConfig.year} Kemal Talha Ekici
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

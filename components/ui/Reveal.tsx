"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: boolean;
};

/**
 * Scroll reveal powered by GSAP + ScrollTrigger (one animation library per job).
 * Motion is reserved for UI state changes, not scroll choreography.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger
      ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"))
      : [el];

    if (targets.length === 0) return;

    const tween = gsap.fromTo(
      targets,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.07 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, stagger]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

type MaskedLinesProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  start?: string;
  id?: string;
};

/** Masked line reveal: each line slides out from behind its own clipping box. */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  start = "top 86%",
  id,
}: MaskedLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inners = el.querySelectorAll<HTMLElement>("[data-mask-inner]");
    const tween = gsap.fromTo(
      inners,
      { yPercent: 112 },
      {
        yPercent: 0,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.08,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, start]);

  return (
    <Tag ref={ref as never} className={className} id={id}>
      {lines.map((line, index) => (
        <span key={index} className={cn("block overflow-hidden", lineClassName)}>
          <span data-mask-inner className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

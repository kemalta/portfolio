"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function SiteChrome({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-void" />
        <div className="grid-bg absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(circle_at_50%_0%,#000_0%,transparent_72%)]" />
        <div className="absolute -right-40 top-[-18%] h-[720px] w-[720px] rounded-full bg-cyan/[0.05] blur-[150px]" />
        <div className="absolute left-[-15%] top-[38%] h-[620px] w-[620px] rounded-full bg-[#1b3a44]/20 blur-[160px]" />
        <div className="noise-overlay absolute inset-0 opacity-[0.05] mix-blend-soft-light" />
      </div>

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-px w-full origin-left bg-cyan/70"
      />

      <Navbar />

      <main id="main" className="relative">
        {children}
      </main>

      <Footer />
    </>
  );
}

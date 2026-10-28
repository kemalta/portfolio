"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import { siteConfig, statusReadout } from "@/lib/site";
import { useDeviceProfile } from "@/lib/hooks/useDeviceProfile";
import { useDeferredMount } from "@/lib/hooks/useDeferredMount";
import { gsap } from "@/lib/gsap";
import { TopologyFallback } from "@/components/three/TopologyFallback";

const HeroTopology = dynamic(
  () => import("@/components/three/HeroTopology"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0">
        <TopologyFallback className="opacity-80" />
      </div>
    ),
  },
);

const HEADLINE = ["KEMAL TALHA", "EKİCİ"];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const profile = useDeviceProfile();
  const sceneReady = useDeferredMount();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Feed normalised hero scroll progress to the 3D camera rig.
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      scrollRef.current = Math.min(
        Math.max(-rect.top / Math.max(rect.height, 1), 0),
        1,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      tl.from("[data-hero-kicker]", {
        y: 14,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          "[data-hero-line-inner]",
          { yPercent: 112, duration: 1.15, stagger: 0.09 },
          0.08,
        )
        .from(
          "[data-hero-serif]",
          { y: 22, opacity: 0, duration: 0.9 },
          0.55,
        )
        .from(
          "[data-hero-intro]",
          { y: 18, opacity: 0, duration: 0.8 },
          0.65,
        )
        .from(
          "[data-hero-actions] > *",
          { y: 16, opacity: 0, stagger: 0.08, duration: 0.7 },
          0.75,
        )
        .from("[data-hero-status]", { opacity: 0, duration: 0.8 }, 0.9)
        .from("[data-hero-canvas]", { opacity: 0, duration: 1.4 }, 0.25);

      gsap.to("[data-hero-content]", {
        yPercent: -7,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-canvas]", {
        yPercent: 8,
        scale: 1.03,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-scroll-line]", {
        scaleY: 1,
        transformOrigin: "top",
        duration: 1.4,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 0.4,
        yoyo: true,
        delay: 1.7,
      });
    }, section);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden pt-[70px]"
      aria-labelledby="hero-title"
    >
      <div
        data-hero-canvas
        aria-hidden
        className="absolute inset-y-[70px] right-0 z-0 h-[calc(100%-70px)] w-full lg:w-[64%]"
      >
        <div className="absolute inset-0 mask-radial">
          {profile.ready && sceneReady ? (
            <HeroTopology
              scrollRef={scrollRef}
              reducedMotion={profile.reducedMotion}
              isMobile={profile.isMobile}
            />
          ) : (
            <TopologyFallback />
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,#06080a_0%,rgba(6,8,10,0.94)_30%,rgba(6,8,10,0.55)_52%,rgba(6,8,10,0.1)_75%,transparent_100%)] lg:bg-[linear-gradient(90deg,#06080a_0%,rgba(6,8,10,0.9)_38%,rgba(6,8,10,0.35)_62%,transparent_80%)]"
      />

      <div className="shell relative z-10 flex min-h-[calc(100svh-70px)] flex-col justify-between pb-6 pt-6 sm:pt-10 lg:pb-7">
        <div data-hero-content>
          <div
            data-hero-kicker
            className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-cyan" />
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-ink/90">
                ICT Systems. Cybersecurity. Artificial Intelligence.
              </p>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
              Portfolyo / {siteConfig.year} · TR
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-10 sm:mt-8 lg:mt-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <h1
                id="hero-title"
                className="text-[clamp(3.1rem,10.2vw,9.4rem)] font-bold leading-[0.82] tracking-[-0.06em]"
              >
                {HEADLINE.map((line, index) => (
                  <span key={line} className="block overflow-hidden">
                    <span
                      data-hero-line-inner
                      className={
                        index === 1
                          ? "text-outline-cyan flex items-center gap-4 sm:gap-6"
                          : "block"
                      }
                    >
                      {line}
                      {index === 1 ? (
                        <span
                          aria-hidden
                          className="mt-1 inline-block h-[0.12em] w-[0.12em] shrink-0 bg-cyan sm:mt-2"
                        />
                      ) : null}
                    </span>
                  </span>
                ))}
              </h1>

              <div className="mt-5 flex max-w-2xl flex-col gap-4 border-l border-line pl-5 sm:mt-9 sm:flex-row sm:items-center sm:gap-6">
                <p
                  data-hero-serif
                  className="serif text-[clamp(1.35rem,2.1vw,1.9rem)] leading-[1.2] text-ink"
                >
                  “{siteConfig.tagline}”
                </p>
                <span
                  aria-hidden
                  className="hidden h-10 w-px bg-line sm:block"
                />
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-faint">
                  Ağ · Sunucu · Güvenlik
                  <br />
                  Yapay zekâ · Web
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 lg:pt-2">
              <div className="max-w-[27rem] border-t border-line pt-5 lg:ml-auto">
                <p
                  data-hero-intro
                  className="text-[13px] leading-relaxed text-dim sm:text-sm"
                >
                  {siteConfig.intro}
                </p>

                <div
                  data-hero-actions
                  className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row"
                >
                  <a href="#uzmanlik" className="btn btn-primary">
                    Uzmanlık Alanlarım
                    <ArrowDown />
                  </a>
                  <a href="#projeler" className="btn btn-ghost">
                    Projelerimi İncele
                    <ArrowUpRight />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-hero-status
          className="mt-8 border-t border-line pt-4 lg:mt-16"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
              {statusReadout.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[8px] uppercase tracking-[0.26em] text-faint">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/85">
                    {item.value}
                  </dd>
                </div>
              ))}
              <div className="hidden lg:block">
                <dt className="font-mono text-[8px] uppercase tracking-[0.26em] text-faint">
                  Grid
                </dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/85">
                  KTE—01 / SYS
                </dd>
              </div>
            </dl>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-faint">
                Scroll
              </span>
              <span className="relative h-8 w-px overflow-hidden bg-line">
                <span
                  data-hero-scroll-line
                  className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-cyan"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 2v8M2.5 6.5L6 10l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

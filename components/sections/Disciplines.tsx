"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  DisciplineVisual,
  disciplineAccent,
} from "@/components/visuals/DisciplineVisual";
import { disciplines, type DisciplineId } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Disciplines() {
  const [active, setActive] = useState<DisciplineId | null>("ai");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const current = disciplines.find((item) => item.id === active) ?? null;
  const accent = current ? disciplineAccent[current.id] : "#5fe3ff";

  const moveFocus = (index: number, direction: number) => {
    const next =
      (index + direction + disciplines.length) % disciplines.length;
    buttons.current[next]?.focus();
  };

  return (
    <section
      id="uzmanlik"
      aria-labelledby="uzmanlik-title"
      className="relative py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHeader
          index="02"
          eyebrow="Uzmanlık Alanları"
          id="uzmanlik-title"
          title={[
            <span key="line-1">Altı disiplin,</span>,
            <span key="line-2">
              tek bir{" "}
              <span className="serif text-cyan">sistem görüşü.</span>
            </span>,
          ]}
          description="Her alanı ayrı bir araç kutusu gibi değil, aynı altyapının katmanları olarak ele alıyorum. Bir katmandaki karar diğerini doğrudan etkiler."
          note="Etkileşim: alan seçin, görsel katman değişsin."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Sticky preview */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[92px]">
              <div className="panel relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
                  <span className="label-strong">
                    {current
                      ? `${current.index} / ${current.english}`
                      : "UZMANLIK / —"}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                    Şematik görsel
                  </span>
                </div>

                <div className="relative aspect-[16/11] overflow-hidden border-b border-line bg-[#080c10]">
                  <div className="grid-bg-fine absolute inset-0 opacity-70" />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current?.id ?? "empty"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="absolute inset-0 p-4"
                    >
                      {current ? (
                        <DisciplineVisual id={current.id} />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                          <span className="font-mono text-[clamp(3rem,7vw,4.6rem)] font-medium leading-none text-transparent [-webkit-text-stroke:1px_rgba(233,237,240,0.22)]">
                            06
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
                            Bir uzmanlık alanı seçin
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <span className="absolute left-2.5 top-2.5 h-2 w-2 border-l border-t border-ink/25" />
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 border-r border-t border-ink/25" />
                    <span className="absolute bottom-2.5 left-2.5 h-2 w-2 border-b border-l border-ink/25" />
                    <span className="absolute bottom-2.5 right-2.5 h-2 w-2 border-b border-r border-ink/25" />
                  </div>
                </div>

                <div className="px-5 pb-5 pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-medium tracking-[-0.035em] text-ink">
                      {current ? current.title : "Katman seçimi"}
                    </h3>
                    <span
                      className="h-1.5 w-1.5 shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                  </div>

                  <p className="mt-3 min-h-[3.75rem] max-w-md text-[13px] leading-relaxed text-dim">
                    {current
                      ? current.summary
                      : "Listeden bir alan seçtiğinizde görsel katman, kapsam ve ilgili yetkinlikler burada görünür."}
                  </p>

                  <ul className="mt-5 border-t border-line">
                    {(current
                      ? current.skills
                      : [
                          "Yapay zekâ",
                          "Siber güvenlik",
                          "Network",
                          "Server & altyapı",
                          "Web",
                          "Sistemler",
                        ]
                    ).map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-2.5 border-b border-line-soft py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70"
                      >
                        <span
                          className="h-1 w-1 shrink-0"
                          style={{ backgroundColor: accent, opacity: 0.75 }}
                        />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                  <span>Katman 06</span>
                  <span>{current ? `Seçili ${current.index}` : "Seçim yok"}</span>
                </div>
              </div>

              <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.14em] text-faint">
                Görseller şematik anlatımdır — ölçüm veya sistem verisi değildir.
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-7">
            <ul className="border-t border-line">
              {disciplines.map((item, index) => {
                const isActive = active === item.id;
                const itemAccent = disciplineAccent[item.id];

                return (
                  <li key={item.id} className="border-b border-line">
                    <h3>
                      <button
                        ref={(node) => {
                          buttons.current[index] = node;
                        }}
                        type="button"
                        aria-expanded={isActive}
                        aria-controls={`discipline-detail-${item.id}`}
                        id={`discipline-trigger-${item.id}`}
                        onClick={() =>
                          setActive(isActive ? null : item.id)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            moveFocus(index, 1);
                          }
                          if (event.key === "ArrowUp") {
                            event.preventDefault();
                            moveFocus(index, -1);
                          }
                          if (event.key === "Home") {
                            event.preventDefault();
                            buttons.current[0]?.focus();
                          }
                          if (event.key === "End") {
                            event.preventDefault();
                            buttons.current[disciplines.length - 1]?.focus();
                          }
                        }}
                        className={cn(
                          "group grid w-full grid-cols-[2.6rem_1fr_auto] items-center gap-3 py-5 text-left transition-colors duration-200 sm:gap-5",
                          isActive && "bg-ink/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 place-items-center border font-mono text-[10px] tracking-[0.08em] transition-colors duration-200",
                            isActive
                              ? "border-current"
                              : "border-line text-faint group-hover:border-ink/25 group-hover:text-dim",
                          )}
                          style={isActive ? { color: itemAccent } : undefined}
                        >
                          {item.index}
                        </span>

                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block font-display text-[clamp(1.3rem,2.6vw,1.85rem)] font-medium leading-[1.08] tracking-[-0.035em] transition-colors duration-200",
                              isActive
                                ? "text-ink"
                                : "text-ink/75 group-hover:text-ink",
                            )}
                          >
                            {item.title}
                          </span>
                          <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                            {item.english}
                          </span>
                        </span>

                        <span
                          aria-hidden
                          className="relative grid h-7 w-7 shrink-0 place-items-center border border-line"
                        >
                          <span className="absolute h-px w-2.5 bg-current" />
                          <span
                            className={cn(
                              "absolute h-2.5 w-px bg-current transition-transform duration-300 ease-out-expo",
                              isActive && "rotate-90",
                            )}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key={`${item.id}-detail`}
                          id={`discipline-detail-${item.id}`}
                          role="region"
                          aria-labelledby={`discipline-trigger-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-7 sm:pl-[3.85rem]">
                            <div className="discipline-visual relative mb-5 aspect-[16/10] overflow-hidden border border-line bg-[#080c10] p-3 lg:hidden">
                              <div className="grid-bg-fine absolute inset-0 opacity-70" />
                              <DisciplineVisual
                                id={item.id}
                                className="relative"
                              />
                            </div>

                            <p className="max-w-xl text-[13px] leading-relaxed text-dim">
                              {item.summary}
                            </p>

                            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                              {item.skills.map((skill) => (
                                <li
                                  key={skill}
                                  className="flex items-center gap-2.5 border-t border-line-soft py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70"
                                >
                                  <span
                                    className="h-1 w-1 shrink-0"
                                    style={{ backgroundColor: itemAccent }}
                                  />
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-2 border border-line bg-ink/[0.015] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                Yaklaşım: analiz → tasarım → uygulama → doğrulama
              </p>
              <a
                href="#laboratuvar"
                className="link-line self-start font-mono text-[9px] uppercase tracking-[0.18em] text-cyan sm:self-auto"
              >
                Topolojiyi incele
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const terms = [
  "AI ENGINEERING",
  "CYBERSECURITY",
  "NETWORK ARCHITECTURE",
  "VIRTUALIZATION",
  "STORAGE & BACKUP",
  "WEB SYSTEMS",
  "AUTOMATION",
  "TROUBLESHOOTING",
];

export function Interlude() {
  return (
    <section
      aria-label="Uzmanlık alanları özeti"
      className="relative overflow-hidden border-y border-line bg-[#080b0e]"
    >
      <div className="flex items-center">
        <div className="hidden shrink-0 items-center gap-3 border-r border-line px-5 py-4 sm:flex lg:px-8">
          <span className="h-1.5 w-1.5 bg-lime" />
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
            Yetkinlik alanları
          </span>
        </div>

        <div className="group relative flex-1 overflow-hidden py-4">
          <div className="flex w-max animate-ticker items-center group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center"
              >
                {terms.map((term, index) => (
                  <span
                    key={`${copy}-${term}`}
                    className="flex items-center gap-6 px-6 font-mono text-[10px] uppercase tracking-[0.26em] text-ink/55 sm:gap-8 sm:px-8"
                  >
                    {term}
                    <span className="h-1 w-1 shrink-0 bg-cyan/40" />
                    <span className="sr-only">{index}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#080b0e] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#080b0e] to-transparent"
          />
        </div>

        <div className="hidden shrink-0 items-center gap-2 border-l border-line px-5 py-4 sm:flex lg:px-8">
          <span className="h-1.5 w-1.5 animate-soft-pulse bg-cyan" />
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
            Sistemler / 06
          </span>
        </div>
      </div>
    </section>
  );
}

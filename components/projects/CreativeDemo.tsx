"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const accents = ["#5fe3ff", "#c6f26e", "#f2b36a"];

export function CreativeDemo() {
  const stage = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [accent, setAccent] = useState(accents[0]);
  const [paused, setPaused] = useState(false);

  const reset = () => {
    if (!stage.current) return;
    stage.current.style.setProperty("--px", "0");
    stage.current.style.setProperty("--py", "0");
    if (readout.current) readout.current.textContent = "X 50 / Y 50";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
            Pointer study
          </span>
          <span className="border border-amber/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-amber">
            Konsept
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1" role="group" aria-label="Vurgu rengi">
            {accents.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Vurgu rengi ${color}`}
                aria-pressed={accent === color}
                onClick={() => setAccent(color)}
                className={cn(
                  "h-5 w-5 border transition-transform",
                  accent === color
                    ? "scale-110 border-ink/60"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-dim transition-colors hover:border-ink/30 hover:text-ink"
          >
            {paused ? "Devam et" : "Duraklat"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="border border-line px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-dim transition-colors hover:border-ink/30 hover:text-ink"
          >
            Sıfırla
          </button>
        </div>
      </div>

      <div
        ref={stage}
        data-paused={paused}
        onPointerMove={(event) => {
          if (paused) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          event.currentTarget.style.setProperty("--px", x.toFixed(3));
          event.currentTarget.style.setProperty("--py", y.toFixed(3));
          if (readout.current) {
            readout.current.textContent = `X ${Math.round(x * 100 + 50)} / Y ${Math.round(y * 100 + 50)}`;
          }
        }}
        onPointerLeave={reset}
        className="relative aspect-[16/9] w-full overflow-hidden border border-line bg-[#080c10] [--px:0] [--py:0]"
      >
        <div className="grid-bg absolute inset-0 opacity-50" />

        <div
          className="absolute inset-0 transition-transform duration-500 ease-out-expo"
          style={{
            transform:
              "translate3d(calc(var(--px) * 18px), calc(var(--py) * 10px), 0)",
          }}
        >
          <span className="absolute left-[7%] top-[24%] whitespace-nowrap font-display text-[clamp(2.6rem,9vw,6.4rem)] font-bold leading-[0.8] tracking-[-0.065em] text-transparent [-webkit-text-stroke:1px_rgba(233,237,240,0.5)]">
            SYSTEMS
          </span>
        </div>

        <div
          className="absolute inset-0 transition-transform duration-300 ease-out-expo"
          style={{
            transform:
              "translate3d(calc(var(--px) * 40px), calc(var(--py) * 22px), 0)",
          }}
        >
          <span
            className="absolute left-[20%] top-[50%] whitespace-nowrap font-serif italic text-[clamp(1.4rem,4.6vw,3.2rem)] leading-none"
            style={{ color: accent }}
          >
            in motion
          </span>
        </div>

        <div
          className="absolute inset-0 transition-transform duration-200 ease-out-expo"
          style={{
            transform:
              "translate3d(calc(var(--px) * 74px), calc(var(--py) * 40px), 0)",
          }}
        >
          <span
            className="absolute right-[14%] top-[18%] h-24 w-24 rounded-full border sm:h-36 sm:w-36"
            style={{ borderColor: `${accent}44` }}
          />
          <span
            className={cn(
              "absolute right-[14%] top-[18%] h-24 w-24 rounded-full border border-dashed sm:h-36 sm:w-36",
              !paused && "animate-[spin_26s_linear_infinite]",
            )}
            style={{ borderColor: `${accent}66` }}
          />
          <span
            className="absolute right-[26%] top-[34%] h-2 w-2"
            style={{ backgroundColor: accent }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-line/70 px-4 py-3">
          <div className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.16em] text-faint">
            Katman 01 / type
            <br />
            Katman 02 / light
          </div>
          <span
            ref={readout}
            className="font-mono text-[8px] uppercase tracking-[0.16em]"
            style={{ color: accent }}
          >
            X 50 / Y 50
          </span>
        </div>

        <div className="pointer-events-none absolute left-[7%] top-[16%] flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
          <span className="h-1 w-1 bg-ink/40" />
          İşaretçiyi sahne üzerinde hareket ettirin
        </div>

        {paused ? (
          <span className="pointer-events-none absolute right-3 top-3 border border-amber/40 bg-void/70 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-amber">
            duraklatıldı
          </span>
        ) : null}
      </div>

      <p className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
        Bu çalışma işaretçi konumunu CSS değişkenlerine yazar; her karede React
        render tetiklenmez. Hareket, tarayıcıda tercih edilen azaltılmış hareket
        ayarına saygı gösterir.
      </p>
    </div>
  );
}

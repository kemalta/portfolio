"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type StepState = "idle" | "running" | "done";

const steps = [
  {
    id: "context",
    name: "Bağlam toplama",
    detail: "Dağınık kaynaklardan ilgili parçalar seçilir.",
    duration: 900,
    output: "context: 6 belge / 4 120 token",
  },
  {
    id: "model",
    name: "Model çağrısı",
    detail: "Seçilen bağlamla örnek model yanıtı üretilir.",
    duration: 1400,
    output: "model: simulated / 1 842ms",
  },
  {
    id: "verify",
    name: "Doğrulama",
    detail: "Çıktı biçim ve tutarlılık kurallarına karşı kontrol edilir.",
    duration: 1100,
    output: "verify: 3/3 kontrol başarılı",
  },
  {
    id: "deliver",
    name: "Teslim",
    detail: "Sonuç, hedef arayüze uygun biçimde paketlenir.",
    duration: 700,
    output: "deliver: 1 çıktı / 2 ek",
  },
];

const START_DELAY = 140;

export function AiWorkflowDemo() {
  const [states, setStates] = useState<StepState[]>(() =>
    steps.map(() => "idle"),
  );
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  };

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];
    },
    [],
  );

  const run = () => {
    clearTimers();
    setStates(steps.map(() => "idle"));
    setRunning(true);

    let cursor = START_DELAY;
    steps.forEach((step, index) => {
      const start = cursor;
      timers.current.push(
        setTimeout(() => {
          setStates((previous) =>
            previous.map((state, itemIndex) =>
              itemIndex === index ? "running" : state,
            ),
          );
        }, start),
      );
      timers.current.push(
        setTimeout(() => {
          setStates((previous) =>
            previous.map((state, itemIndex) =>
              itemIndex === index ? "done" : state,
            ),
          );
        }, start + step.duration),
      );
      cursor = start + step.duration + 220;
    });

    timers.current.push(
      setTimeout(() => {
        setRunning(false);
      }, cursor + 80),
    );
  };

  const reset = () => {
    clearTimers();
    setRunning(false);
    setStates(steps.map(() => "idle"));
  };

  const doneCount = states.filter((state) => state === "done").length;
  const progress = (doneCount / steps.length) * 100;
  const allDone = doneCount === steps.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-amber/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-amber">
            Simülasyon
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
            Gerçek model çağrısı yok
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={run}
            className="border border-cyan/45 bg-cyan/[0.09] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan transition-colors hover:bg-cyan/[0.16]"
          >
            {running ? "Yeniden çalıştır" : allDone ? "Tekrar çalıştır" : "Çalıştır"}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!running && doneCount === 0}
            className="border border-line px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sıfırla
          </button>
        </div>
      </div>

      <div className="border border-line bg-ink/[0.015] px-3.5 py-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
            Görev / örnek
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
            hedef: özet + doğrulama
          </span>
        </div>
        <p className="mt-1.5 font-mono text-[10px] leading-relaxed tracking-[0.02em] text-ink/75">
          “Ağ izleme raporundaki son 24 saatlik örnek olayları özetle, tekrar eden
          kalıpları işaretle ve doğrulama adımından geçir.”
        </p>
      </div>

      <div className="grid gap-2.5 lg:grid-cols-[1.05fr_1fr]">
        <div className="border border-line bg-ink/[0.015]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
              Adımlar
            </span>
            <span className="font-mono text-[8px] tracking-[0.12em] text-cyan">
              {doneCount}/{steps.length}
            </span>
          </div>

          <div className="h-px w-full bg-line">
            <div
              className="h-px bg-cyan/70"
              style={{
                width: `${progress}%`,
                transition: "width 500ms cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          </div>

          <ul className="divide-y divide-line/60">
            {steps.map((step, index) => {
              const state = states[index];
              return (
                <li key={step.id} className="flex items-start gap-3 px-3 py-3">
                  <span
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center border font-mono text-[8px]",
                      state === "done" && "border-lime/50 text-lime",
                      state === "running" && "border-cyan/60 text-cyan",
                      state === "idle" && "border-line text-faint",
                    )}
                  >
                    {state === "done" ? "✓" : `0${index + 1}`}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "text-[12px]",
                          state === "idle" ? "text-dim" : "text-ink",
                        )}
                      >
                        {step.name}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[7.5px] uppercase tracking-[0.12em]",
                          state === "done" && "text-lime/80",
                          state === "running" && "text-cyan",
                          state === "idle" && "text-faint",
                        )}
                      >
                        {state === "done"
                          ? `${step.duration}ms`
                          : state === "running"
                            ? "çalışıyor"
                            : "bekliyor"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-faint">
                      {step.detail}
                    </p>
                    {state === "running" ? (
                      <span className="mt-1.5 flex h-px w-full overflow-hidden bg-line">
                        <span className="h-px w-1/3 animate-[visual-scan-x_1.1s_linear_infinite] bg-cyan" />
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border border-line bg-[#080c10]">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
              Çıktı / terminal
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-faint">
              <span
                className={cn(
                  "h-1 w-1",
                  running ? "animate-led bg-cyan" : allDone ? "bg-lime" : "bg-faint",
                )}
              />
              {running ? "çalışıyor" : allDone ? "tamam" : "hazır"}
            </span>
          </div>

          <div className="min-h-[214px] px-3.5 py-3 font-mono text-[9px] leading-[1.9]">
            <p className="text-faint">$ pipeline --simulate</p>
            {steps.map((step, index) =>
              states[index] === "done" ? (
                <p key={step.id} className="text-lime/75">
                  <span className="text-faint">›</span> {step.output}
                </p>
              ) : states[index] === "running" ? (
                <p key={step.id} className="text-cyan">
                  <span className="text-faint">›</span> {step.name.toLowerCase()}…
                </p>
              ) : null,
            )}
            {allDone ? (
              <>
                <p className="mt-1 text-ink/80">pipeline tamamlandı / 4 adım</p>
                <p className="text-faint">
                  not: tüm çıktılar simülasyondur.
                </p>
              </>
            ) : null}
            {!allDone ? (
              <p className="mt-1 text-faint">
                <span className="inline-block h-2.5 w-1.5 animate-pulse bg-cyan/70 align-middle" />
              </p>
            ) : null}
          </div>

          <div className="border-t border-line px-3 py-2 font-mono text-[7.5px] uppercase tracking-[0.12em] text-faint">
            bağlam 6 belge · model simüle · doğrulama 3 kural
          </div>
        </div>
      </div>

      <p className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
        Pipeline adımları zamanlayıcı ile simüle edilir. Harici bir modele istek
        gönderilmez, ağ çağrısı yapılmaz.
      </p>
    </div>
  );
}

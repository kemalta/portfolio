import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Kayıt bulunamadı",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(circle_at_30%_40%,#000,transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 border border-line lg:block"
      >
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-cyan" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan" />
        <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-line" />
        <span className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-line" />
      </div>

      <div className="shell relative">
        <div className="max-w-2xl py-24">
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center border border-line font-mono text-[10px] text-amber">
              404
            </span>
            <span className="label">Route not found</span>
          </div>

          <p className="mt-8 font-mono text-[clamp(4rem,16vw,9rem)] font-medium leading-[0.82] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(233,237,240,0.3)]">
            404
          </p>

          <h1 className="mt-6 font-display text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
            İstenen kayıt bu
            <br />
            <span className="serif text-cyan">düğümde</span> bulunamadı.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-dim">
            Bağlantı taşınmış, adres değişmiş veya hiç var olmamış olabilir.
            Topolojiye geri dönüp devam edebilirsiniz.
          </p>

          <Link
            href="/"
            className="mt-9 inline-flex items-center gap-3 border border-ink/25 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:border-cyan/60 hover:text-cyan"
          >
            <span className="h-1 w-1 bg-cyan" />
            Ana sayfaya dön
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

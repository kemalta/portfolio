"use client";

import { navItems, siteConfig } from "@/lib/site";
import { useSmoothScroll } from "@/components/layout/SmoothScrollProvider";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-void">
      <div className="shell pt-14">
        <div className="grid grid-cols-1 gap-10 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.02] tracking-[-0.04em] text-ink">
              Sistemler karmaşıktır.
              <br />
              <span className="serif text-cyan">Ben onları birlikte çalıştırırım.</span>
            </p>
            <div className="mt-7 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center border border-line text-[10px] font-semibold text-ink">
                KTE
              </span>
              <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-faint">
                ICT Engineering
                <br />
                AI / Security / Infrastructure
              </span>
            </div>
          </div>

          <nav aria-label="Alt navigasyon" className="lg:col-span-3">
            <p className="label mb-4">Bölümler</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo(item.href, -76);
                    }}
                    className="link-line text-[13px] text-dim transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="label mb-4">İletişim</p>
            {siteConfig.email ? (
              <a
                href={`mailto:${siteConfig.email}`}
                className="link-line font-display text-lg text-ink"
              >
                {siteConfig.email}
              </a>
            ) : (
              <p className="max-w-xs text-[13px] leading-relaxed text-dim">
                Doğrudan iletişim kanalı için aşağıdaki formu kullanabilirsiniz.
              </p>
            )}
            {siteConfig.links.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-4">
                {siteConfig.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-line font-mono text-[10px] uppercase tracking-[0.18em] text-dim hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <button
              type="button"
              onClick={() => scrollTo("#top", 0)}
              className="mt-7 inline-flex items-center gap-2 border border-line px-3.5 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-dim transition-colors duration-200 hover:border-ink/35 hover:text-ink"
            >
              Başa dön
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M6 10V2M2.5 5.5L6 2l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-faint">
            © {year} Kemal Talha Ekici · Tüm hakları saklıdır.
          </p>
          <p className="max-w-lg font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-faint">
            Projeler ve panolar konsept demodur · örnek veri kullanır · gerçek
            sistemlere bağlı değildir.
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden border-t border-line"
      >
        <div className="shell">
          <span className="-mb-[0.18em] block whitespace-nowrap pt-6 text-[clamp(3.2rem,13.5vw,12.5rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(233,237,240,0.12)]">
            KEMAL TALHA EKİCİ
          </span>
        </div>
      </div>
    </footer>
  );
}

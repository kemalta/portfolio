import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { capabilityGroups, principles, siteConfig } from "@/lib/site";

const capabilityIndex: Record<string, string> = {
  "AI & Otomasyon": "01",
  Güvenlik: "02",
  Network: "03",
  Altyapı: "04",
  Web: "05",
  Sistemler: "06",
};

export function About() {
  return (
    <section
      id="hakkimda"
      aria-labelledby="hakkimda-title"
      className="relative border-t border-line bg-[#070a0d] py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHeader
          index="05"
          eyebrow="Profile / Hakkımda"
          id="hakkimda-title"
          title={[
            <span key="line-1">Sistemleri birlikte</span>,
            <span key="line-2">
              <span className="serif text-cyan">çalıştırmak.</span>
            </span>,
          ]}
          description="Kemal Talha Ekici — ICT, yapay zekâ, siber güvenlik, network, server altyapısı ve web mühendisliği kesişiminde çalışan bir teknoloji profesyoneli."
          note="Okuma süresi ~2 dk · deneyim iddiası içermez"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.5] tracking-[-0.015em] text-ink/90">
                {siteConfig.intro}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-8 space-y-5 text-[14px] leading-relaxed text-dim">
                <p>
                  Bir sistemi tek bir katmandan okumak eksik bir resim verir.
                  Aynı kullanıcı deneyimi; ağ segmentasyonundan, sunucu
                  yapılandırmasından, erişim politikasından ve uygulama
                  kodundan aynı anda etkilenir. Bu yüzden çalışma biçimim
                  katmanlar arasında gidip gelmeye dayanır.
                </p>
                <p>
                  Yapay zekâ araçlarını gösteriş için değil, tekrar eden işi
                  azaltmak ve karar kalitesini artırmak için kullanıyorum.
                  Güvenliği sonradan eklenen bir kontrol listesi değil, tasarım
                  kısıtı olarak ele alıyorum. Arayüzü ise sistemin görünen
                  yüzü — yani mühendisliğin bir parçası — olarak görüyorum.
                </p>
                <p>
                  Bu site, yaptığım işin kapsamını ve düşünme biçimini
                  göstermek için tasarlandı. Buradaki projeler konsept
                  demolarıdır; geçmiş iş deneyimi, müşteri listesi veya
                  ölçülmüş sonuç iddiası taşımaz.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
                {[
                  { label: "Odak", value: "Sistem bütünlüğü" },
                  { label: "Yaklaşım", value: "Analiz → doğrulama" },
                  { label: "Kapsam", value: "06 disiplin" },
                  { label: "Diller", value: "TR / EN teknik" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-faint">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-snug text-ink/80">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.06}>
              <div className="panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <span className="label-strong">Kimlik / KTE</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                    Portföy profili
                  </span>
                </div>

                <div className="relative px-5 pb-5 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-14 w-14 place-items-center border border-ink/20 font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                      KTE
                    </span>
                    <span className="border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                      ICT / AI / SEC
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
                    Kemal Talha
                    <br />
                    Ekici
                  </h3>
                  <p className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-cyan/80">
                    {siteConfig.role}
                  </p>

                  <dl className="mt-6 border-t border-line">
                    {[
                      { label: "Uzmanlık", value: "06 katman" },
                      { label: "Çalışma alanı", value: "Uçtan uca sistem" },
                      {
                        label: "İletişim",
                        value: siteConfig.email
                          ? "E-posta gönder"
                          : "Yapılandırma bekliyor",
                        href: siteConfig.email
                          ? `mailto:${siteConfig.email}`
                          : undefined,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 border-b border-line-soft py-2.5"
                      >
                        <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
                          {row.label}
                        </dt>
                        <dd className="truncate font-mono text-[9px] uppercase tracking-[0.08em] text-ink/75">
                          {row.href ? (
                            <a
                              href={row.href}
                              className="tap inline-flex items-center transition-colors hover:text-cyan"
                            >
                              {row.value}
                            </a>
                          ) : (
                            row.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-4 font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
                    {siteConfig.email
                      ? "Doğrudan e-posta veya profiller üzerinden ulaşabilirsiniz."
                      : "Bu alan lib/site.ts içindeki merkezi yapılandırmadan doldurulabilir."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
                  <span>Profil / statik</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 bg-cyan" />
                    Doğrulanabilir içerik
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <p className="label">Çalışma ilkeleri</p>
            <p className="mt-3 max-w-[15rem] font-mono text-[9px] leading-relaxed tracking-[0.12em] text-faint">
              Dört kural; hem altyapı hem arayüz kararlarında aynı şekilde
              geçerli.
            </p>
          </div>

          <ul className="border-t border-line lg:col-span-9">
            {principles.map((principle) => (
              <li
                key={principle.index}
                className="group grid grid-cols-[2.6rem_1fr] gap-4 border-b border-line py-5 transition-colors duration-200 hover:bg-ink/[0.015] sm:grid-cols-[3.4rem_11rem_1fr] sm:gap-6"
              >
                <span className="font-mono text-[10px] tracking-[0.12em] text-cyan/70">
                  {principle.index}
                </span>
                <h3 className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.02em] text-ink">
                  {principle.title}
                </h3>
                <p className="col-span-2 max-w-2xl text-[13px] leading-relaxed text-dim sm:col-span-1">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <p className="label">Yetkinlik envanteri</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              Araç değil, kapsam listesi
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {capabilityGroups.map((group) => (
              <div key={group.label} className="border-t border-line pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[15px] font-medium tracking-[-0.02em] text-ink">
                    {group.label}
                  </h3>
                  <span className="font-mono text-[8px] tracking-[0.14em] text-faint">
                    {capabilityIndex[group.label]}
                  </span>
                </div>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-ink/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

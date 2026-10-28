"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useId, useState, type FormEvent } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig, contactMode } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  message: string;
  company: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  message: "",
  company: "",
};

const EASE = [0.23, 1, 0.32, 1] as const;

export function Contact() {
  const formId = useId();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState<{
    name: string;
    email: string;
    message: string;
  } | null>(null);

  const update = useCallback((key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "sending") return;

      const localErrors: Record<string, string> = {};
      if (form.name.trim().length < 2) {
        localErrors.name = "Lütfen adınızı girin (en az 2 karakter).";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        localErrors.email = "Geçerli bir e-posta adresi girin.";
      }
      if (form.message.trim().length < 10) {
        localErrors.message = "Mesaj en az 10 karakter olmalı.";
      }

      if (Object.keys(localErrors).length > 0) {
        setErrors(localErrors);
        setStatus("error");
        setFeedback("Formda eksik alanlar var.");
        return;
      }

      if (contactMode === "mailto") {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        };
        setSent(payload);
        setStatus("success");
        setFeedback(
          "E-posta uygulamanız hazır konu ve mesajla açılıyor. Açılmazsa aşağıdaki bağlantıyı kullanın.",
        );
        setForm(INITIAL_FORM);
        setErrors({});
        if (siteConfig.email) {
          const subject = `Portfolyo iletişim — ${payload.name}`;
          const body = `${payload.message}\n\n— ${payload.name} (${payload.email})`;
          const href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
            subject,
          )}&body=${encodeURIComponent(body)}`;
          // A real anchor click is more reliable than assigning location.href
          // for the mailto: scheme (and keeps the page intact if no client is
          // registered).
          const link = document.createElement("a");
          link.href = href;
          link.rel = "noopener";
          link.click();
        }
        return;
      }

      setStatus("sending");
      setFeedback("");
      setErrors({});

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = (await response.json()) as {
          ok: boolean;
          message: string;
          errors?: Record<string, string>;
        };

        if (!response.ok || !data.ok) {
          setErrors(data.errors ?? {});
          setStatus("error");
          setFeedback(data.message ?? "İstek tamamlanamadı. Tekrar deneyin.");
          return;
        }

        setStatus("success");
        setFeedback(data.message);
        setSent({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        });
        setForm(INITIAL_FORM);
      } catch {
        setStatus("error");
        setFeedback("Bağlantı hatası. Tekrar deneyin.");
      }
    },
    [form, status],
  );

  const hasChannel = Boolean(siteConfig.email) || siteConfig.links.length > 0;

  const mailtoHref =
    sent && siteConfig.email
      ? `mailto:${siteConfig.email}?subject=${encodeURIComponent(
          `Portfolyo iletişim — ${sent.name}`,
        )}&body=${encodeURIComponent(
          `${sent.message}\n\n— ${sent.name} (${sent.email})`,
        )}`
      : null;

  return (
    <section
      id="iletisim"
      aria-labelledby="iletisim-title"
      className="relative border-t border-line py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHeader
          index="06"
          eyebrow="Contact / İletişim"
          id="iletisim-title"
          title={[
            <span key="line-1">Bir sonraki</span>,
            <span key="line-2">
              <span className="serif text-cyan">sistemi</span> konuşalım.
            </span>,
          ]}
          description={
            contactMode === "mailto"
              ? "Kapsam, teknik kısıtlar veya tek bir problem üzerine doğrudan yazabilirsiniz. Form, mesajı kendi e-posta uygulamanızda hazırlar; hiçbir veri sunucuya gönderilmez."
              : "Kapsam, teknik kısıtlar veya tek bir problem üzerine doğrudan e-posta ile yazabilirsiniz. Aşağıdaki form ise bu portföyde demo olarak çalışır; mesajlar yalnızca yerel dosyaya kaydedilir."
          }
          note={
            contactMode === "mailto"
              ? "Doğrudan e-posta · form e-posta uygulamasını açar"
              : "Doğrudan e-posta · demo form"
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="label-strong">Kanallar</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                  Doğrudan
                </span>
              </div>

              <div className="px-5 py-5">
                {siteConfig.email ? (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="tap group flex flex-col gap-1 border-b border-line-soft pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                      E-posta
                    </span>
                    <span className="break-all font-display text-[15px] text-ink transition-colors group-hover:text-cyan">
                      {siteConfig.email}
                    </span>
                  </a>
                ) : null}

                {siteConfig.location ? (
                  <div className="flex flex-col gap-1 border-b border-line-soft py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
                      Konum
                    </span>
                    <span className="text-[13px] text-ink/80">
                      {siteConfig.location}
                    </span>
                  </div>
                ) : null}

                {siteConfig.links.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 pt-4">
                    {siteConfig.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="tap inline-flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-cyan/50 hover:text-cyan"
                        >
                          {link.label}
                          <span aria-hidden>↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {!hasChannel ? (
                  <div className="py-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber/90">
                      Henüz tanımlı kanal yok
                    </p>
                    <p className="mt-2.5 max-w-sm text-[13px] leading-relaxed text-dim">
                      Bu portföyde gerçek e-posta adresi veya sosyal profil
                      bilgisi paylaşılmadı. Kanallar{" "}
                      <code className="border border-line px-1 py-0.5 font-mono text-[11px] text-ink/80">
                        lib/site.ts
                      </code>{" "}
                      içinden tek noktadan doldurulabilir; arayüz otomatik
                      güncellenir.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-line px-4 py-3">
                <p className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
                  Bağlantılar doğrudan ilgili profile gider; aracı katman yoktur.
                </p>
              </div>
            </div>

            <div className="mt-4 border border-amber/30 bg-amber/[0.045] px-4 py-3.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber/90">
                {contactMode === "mailto" ? "Form davranışı" : "Demo davranışı"}
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
                {contactMode === "mailto"
                  ? "Form yalnızca kendi e-posta uygulamanızı hazır konu ve gövdeyle açar. Mesaj bu siteye kaydedilmez, hiçbir üçüncü taraf servise aktarılmaz; gönderimi siz onaylarsınız."
                  : "Gönderdiğiniz mesaj yalnızca bu çalışma ortamındaki yerel demo dosyasına yazılır; hiçbir e-posta servisi, CRM veya üçüncü taraf entegrasyonu bağlı değildir. Doğrudan ulaşmak için yukarıdaki e-posta adresini kullanabilirsiniz."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="border border-line bg-ink/[0.015]"
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="label-strong">
                  {contactMode === "mailto" ? "Mesaj / e-posta" : "Mesaj / demo"}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  {contactMode === "mailto" ? "E-posta uygulaması" : "Yerel kayıt"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 px-4 py-5 sm:grid-cols-2 sm:px-5">
                <Field
                  id={`${formId}-name`}
                  name="name"
                  label="Ad Soyad"
                  value={form.name}
                  error={errors.name}
                  placeholder="Adınız"
                  autoComplete="name"
                  onChange={(value) => update("name", value)}
                />
                <Field
                  id={`${formId}-email`}
                  name="email"
                  label="E-posta"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  placeholder="ad@ornek.com"
                  autoComplete="email"
                  onChange={(value) => update("email", value)}
                />

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`${formId}-message`}
                    className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-faint"
                  >
                    Mesaj
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={5}
                    value={form.message}
                    placeholder="Kapsam, problem veya soru..."
                    onChange={(event) => update("message", event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? `${formId}-message-error` : undefined
                    }
                    className={cn(
                      "input-text w-full resize-y border bg-void/40 px-3.5 py-3 leading-relaxed text-ink outline-none transition-colors placeholder:text-faint",
                      errors.message
                        ? "border-amber/60"
                        : "border-line focus:border-cyan/50",
                    )}
                  />
                  {errors.message ? (
                    <p
                      id={`${formId}-message-error`}
                      className="mt-1.5 font-mono text-[9px] tracking-[0.06em] text-amber"
                    >
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor={`${formId}-company`}>Company</label>
                  <input
                    id={`${formId}-company`}
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(event) => update("company", event.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="tap inline-flex items-center justify-center gap-3 border border-cyan/45 bg-cyan/[0.08] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan transition-colors duration-200 hover:bg-cyan/[0.15] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    className={cn(
                      "h-1 w-1 bg-cyan",
                      status === "sending" && "animate-pulse",
                    )}
                  />
                  {status === "sending"
                    ? contactMode === "mailto"
                      ? "Hazırlanıyor"
                      : "Kaydediliyor"
                    : "Mesajı gönder"}
                </button>

                <AnimatePresence mode="wait" initial={false}>
                  {status === "success" ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="font-mono text-[9px] uppercase tracking-[0.14em] text-lime/90"
                    >
                      {contactMode === "mailto" ? "✓ E-posta hazır" : "✓ Demo kaydı alındı"}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>

              <AnimatePresence initial={false}>
                {feedback ? (
                  <motion.p
                    key={feedback}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: EASE }}
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "overflow-hidden border-t border-line px-4 py-3 text-[12px] leading-relaxed sm:px-5",
                      status === "error" ? "text-amber" : "text-dim",
                    )}
                  >
                    {feedback}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              {status === "success" && mailtoHref ? (
                <div className="flex flex-col gap-2 border-t border-line px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-faint">
                    {contactMode === "mailto"
                      ? "E-posta uygulamanız açılmadıysa:"
                      : "Aynı mesajı gerçek e-posta olarak da gönderebilirsiniz"}
                  </p>
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 border border-cyan/40 bg-cyan/[0.06] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan transition-colors hover:bg-cyan/[0.13]"
                  >
                    {contactMode === "mailto" ? "E-postayı aç" : "E-posta ile gönder"}
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              ) : null}
            </form>

            <p className="mt-3 max-w-xl font-mono text-[8px] leading-relaxed tracking-[0.12em] text-faint">
              {contactMode === "mailto"
                ? "Form, istemci tarafında doğrulanır; gönderim kendi e-posta uygulamanızdan çıkar. Sayfada hiçbir veri toplanmaz veya saklanmaz."
                : "Form gönderimi sunucu tarafında doğrulanır, hız sınırına tabidir ve gizli honeypot alanı içerir. Hiçbir sağlayıcıya veri aktarılmaz."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-faint"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize={type === "email" ? "none" : undefined}
        autoCorrect={type === "email" ? "off" : undefined}
        inputMode={type === "email" ? "email" : undefined}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "input-text w-full border bg-void/40 px-3.5 py-2.5 text-ink outline-none transition-colors placeholder:text-faint",
          error ? "border-amber/60" : "border-line focus:border-cyan/50",
        )}
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 font-mono text-[9px] tracking-[0.06em] text-amber"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

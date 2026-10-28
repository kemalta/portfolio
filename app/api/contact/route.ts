import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_NAME = 120;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 4000;

/**
 * Local demo store. Submissions are appended to a JSONL file inside the
 * project so the form behaves end-to-end without pretending to deliver mail.
 * No third-party service is involved.
 */
const STORE_PATH =
  process.env.CONTACT_STORE_PATH ??
  path.join(process.cwd(), ".data", "contact-submissions.jsonl");

const bucket = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || now > entry.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Çok fazla istek gönderildi. Lütfen biraz bekleyin.",
      },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Geçersiz istek gövdesi." },
      { status: 400 },
    );
  }

  const { name, email, message, company } = (payload ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot: real users never fill this hidden field.
  if (typeof company === "string" && company.trim().length > 0) {
    return NextResponse.json({ ok: true, message: "Mesaj alındı." });
  }

  const errors: Record<string, string> = {};

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > MAX_NAME
  ) {
    errors.name = "Lütfen adınızı girin (2–120 karakter).";
  }
  if (
    typeof email !== "string" ||
    email.trim().length > MAX_EMAIL ||
    !EMAIL_RE.test(email.trim())
  ) {
    errors.email = "Geçerli bir e-posta adresi girin.";
  }
  if (
    typeof message !== "string" ||
    message.trim().length < 10 ||
    message.trim().length > MAX_MESSAGE
  ) {
    errors.message = "Mesajınız 10–4000 karakter arasında olmalı.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Form doğrulanamadı.", errors },
      { status: 422 },
    );
  }

  const submission = {
    name: (name as string).trim(),
    email: (email as string).trim().toLowerCase(),
    message: (message as string).trim(),
    receivedAt: new Date().toISOString(),
    // Coarse origin only; no precise location is derived or stored.
    source: request.headers.get("referer") ?? "direct",
  };

  try {
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    await appendFile(STORE_PATH, `${JSON.stringify(submission)}\n`, "utf8");
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Demo kaydı oluşturulamadı. Bu ortamda yerel dosya yazımı kapalı olabilir.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Mesaj yerel demo kaydına yazıldı. Form e-posta göndermez; doğrudan iletmek için e-posta kanalını kullanın.",
  });
}

/**
 * Builds the static bundle that GitHub Pages serves.
 *
 * GitHub Pages can only host files, so two things differ from the Node build:
 *  1. `app/api` (the demo form endpoint) is moved aside for the duration of the
 *     build — `output: "export"` rejects route handlers that are not GET.
 *  2. The contact form switches to `mailto:` delivery via NEXT_PUBLIC_CONTACT_MODE.
 *
 * The folder is always restored, even when the build fails.
 */
import { execFileSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "app", "api");
const stashDir = path.join(root, ".pages-api-stash");

if (existsSync(stashDir)) rmSync(stashDir, { recursive: true, force: true });
if (!existsSync(apiDir)) {
  console.error("app/api bulunamadı — beklenen demo form endpoint'i yok.");
  process.exit(1);
}

let restored = false;
const restore = () => {
  if (restored) return;
  restored = true;
  if (existsSync(stashDir)) renameSync(stashDir, apiDir);
};

process.on("exit", restore);
process.on("SIGINT", () => {
  restore();
  process.exit(130);
});

try {
  renameSync(apiDir, stashDir);
  execFileSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "1",
      NEXT_PUBLIC_CONTACT_MODE: "mailto",
    },
  });
} finally {
  restore();
}

console.log("\nStatik çıktı hazır: ./out  (GitHub Pages)");

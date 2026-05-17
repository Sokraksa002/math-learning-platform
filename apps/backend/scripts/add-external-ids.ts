import { readdir } from "fs/promises";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import crypto from "crypto";

async function walk(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.isFile() && full.endsWith(".json")) files.push(full);
  }
  return files;
}

function ensureUuid() {
  return crypto.randomUUID();
}

async function main() {
  const base = path.join(__dirname, "..", "data", "exercises");
  const files = await walk(base);
  for (const f of files) {
    try {
      const raw = readFileSync(f, "utf8");
      const parsed = JSON.parse(raw);
      const exercises = Array.isArray(parsed) ? parsed : parsed.exercises ?? null;
      if (!exercises) continue;

      // backup original
      const bak = `${f}.bak`;
      if (!existsSync(bak)) writeFileSync(bak, raw, "utf8");

      const updated = exercises.map((ex: any) => {
        const orig = ex.id ?? null;
        // preserve original external id
        if (orig && !ex.externalId) ex.externalId = orig;
        // always set id to a UUID (keep when it's already a UUID)
        const isUuid = typeof orig === "string" && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(orig);
        ex.id = isUuid ? orig : ensureUuid();
        return ex;
      });

      if (Array.isArray(parsed)) {
        writeFileSync(f, JSON.stringify(updated, null, 2), "utf8");
      } else {
        parsed.exercises = updated;
        writeFileSync(f, JSON.stringify(parsed, null, 2), "utf8");
      }
      console.log("Updated", path.relative(process.cwd(), f));
    } catch (err) {
      console.error("Failed", f, err);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import path from "path";

async function walk(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (e.isFile() && full.endsWith(".json")) {
      files.push(full);
    }
  }
  return files;
}

function pretty(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

async function inspect() {
  const base = path.join(__dirname, "..", "data");
  console.log("Data base:", base);

  for (const sub of ["lessons", "exercises"]) {
    const dir = path.join(base, sub);
    console.log("\n==>", sub, "folder:", dir);
    try {
      const files = await walk(dir);
      console.log("Found JSON files:", files.length);
      for (const f of files.slice(0, 20)) {
        try {
          const raw = readFileSync(f, "utf8");
          const parsed = JSON.parse(raw);
          console.log("\n---", path.relative(process.cwd(), f));
          if (Array.isArray(parsed)) {
            console.log("type: array length =", parsed.length);
            console.log("first item keys:", Object.keys(parsed[0] ?? {}).slice(0, 20));
            console.log("sample:", pretty(parsed[0]));
          } else if (parsed && typeof parsed === "object") {
            console.log("type: object keys:", Object.keys(parsed).slice(0, 50));
            console.log("sample:", pretty(parsed));
          } else {
            console.log("type:", typeof parsed, "value:", pretty(parsed));
          }
        } catch (err) {
          console.error("Failed to read/parse", f, err);
        }
      }
      if (files.length > 20) console.log(`... (${files.length - 20} more files)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log("No folder or error:", msg);
    }
  }
}

inspect().catch((e) => {
  console.error(e);
  process.exit(1);
});
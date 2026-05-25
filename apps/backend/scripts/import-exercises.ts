import { readdir } from "fs/promises";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";
import crypto from "crypto";

/**
 * Import/upsert exercises from apps/backend/data/exercises/*.json
 * - Builds payload using Prisma model field names (camelCase)
 * - Preserves original non-UUID ids in externalId and generates UUIDs for DB id
 * - Only sets lessonId when it's a valid UUID or can be resolved to one from DB (by slug)
 */

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

function safeJsonStringify(v: any) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function isUuid(s: any) {
  return typeof s === "string" && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);
}

async function main() {
  const base = path.join(__dirname, "..", "data", "exercises");
  const files = await walk(base);
  let total = 0;
  const lessonCache = new Map<string, string | null>();

  for (const f of files) {
    try {
      const raw = readFileSync(f, "utf8");
      const parsed = JSON.parse(raw);
      const exercises = Array.isArray(parsed) ? parsed : parsed.exercises ?? [];
      const lessonIdFromFile = parsed.lessonId ?? parsed.lesson_id ?? undefined;

      // resolve lessonIdFromFile (only set payload.lessonId when we have a UUID)
      let resolvedLessonId: string | undefined = undefined;
      if (lessonIdFromFile) {
        if (isUuid(lessonIdFromFile)) {
          resolvedLessonId = lessonIdFromFile;
        } else {
          // Try cached first
          if (lessonCache.has(lessonIdFromFile)) {
            resolvedLessonId = lessonCache.get(lessonIdFromFile) ?? undefined;
          } else {
            // Our Lesson model doesn't have a `slug` field in the schema. Try to resolve
            // by matching Lesson.titleKm (human-readable title stored in DB). We'll also
            // create a normalized slug from the file identifier as a fallback (e.g.
            // "grade12-derivatives-lesson3" -> "Grade 12 Derivatives Lesson 3")
            const normalizedCandidates: string[] = [];

            // candidate 1: try using the raw lessonIdFromFile with simple normalization
            const parts = String(lessonIdFromFile).replace(/[-_]+/g, " ").split(" ").filter(Boolean);
            if (parts.length) {
              const normalized = parts.map((p) => p[0]?.toUpperCase() + p.slice(1)).join(" ");
              normalizedCandidates.push(normalized);
            }

            // candidate 2: also try the original raw value as-is
            normalizedCandidates.push(String(lessonIdFromFile));

            // candidate 3: try file-level title fields from JSON if present
            const parsedTitleCandidates: string[] = [];
            if (parsed.titleKm) parsedTitleCandidates.push(String(parsed.titleKm));
            if (parsed.title_km) parsedTitleCandidates.push(String(parsed.title_km));
            if (parsed.lessonTitle) parsedTitleCandidates.push(String(parsed.lessonTitle));
            if (parsed.lesson_title) parsedTitleCandidates.push(String(parsed.lesson_title));

            const allCandidates = [...parsedTitleCandidates, ...normalizedCandidates];

            let foundId: string | null = null;
            for (const cand of allCandidates) {
              if (!cand) continue;
              const lesson = await (prisma as any).lesson.findFirst({
                where: { titleKm: cand },
                select: { id: true },
              }).catch(() => null);
              if (lesson?.id && isUuid(lesson.id)) {
                foundId = lesson.id;
                break;
              }
            }

            lessonCache.set(lessonIdFromFile, foundId);
            if (foundId) resolvedLessonId = foundId;
            else {
              console.warn(`Could not resolve lesson identifier "${lessonIdFromFile}" to a UUID for file ${path.relative(process.cwd(), f)}; please add a matching Lesson.titleKm or provide per-item lessonId UUIDs.`);
            }
          }
        }
      }

      if (!Array.isArray(exercises) || exercises.length === 0) {
        console.log("No exercises array in", path.relative(process.cwd(), f));
        continue;
      }

      for (const ex of exercises) {
        const payload: any = {};

        // id: prefer provided id; if not UUID generate one and preserve original as externalId
        const origId = ex.id ?? ex._id ?? undefined;
        if (origId && isUuid(origId)) {
          payload.id = origId;
        } else if (origId) {
          payload.id = crypto.randomUUID();
          payload.externalId = origId;
          console.warn(`Generated UUID ${payload.id} for original id "${origId}" (file: ${path.relative(process.cwd(), f)})`);
        } else {
          // no id provided: generate
          payload.id = crypto.randomUUID();
          console.warn(`No id provided for exercise in ${path.relative(process.cwd(), f)} — generated ${payload.id}`);
        }

        // Preserve explicit externalId if present
        if (ex.externalId) payload.externalId = ex.externalId;

        // lessonId: only set when it's a UUID (per-item) or resolved file-level UUID
        const itemLesson = ex.lessonId ?? ex.lesson_id ?? undefined;
        if (itemLesson && isUuid(itemLesson)) {
          payload.lessonId = itemLesson;
        } else if (resolvedLessonId) {
          payload.lessonId = resolvedLessonId;
        }

        // Required text fields mapping
        payload.questionKm = ex.question_km ?? ex.question ?? ex.title ?? undefined;
        payload.solutionKm = ex.solution_km ?? ex.solution ?? ex.explanation ?? undefined;

        // correctAnswer: pick provided or compute from choices + correctIndex
        let correct: any = ex.correct_answer ?? ex.correctAnswer ?? ex.correct ?? undefined;
        if ((!correct || correct === "") && Array.isArray(ex.choices) && Number.isInteger(ex.correctIndex)) {
          correct = ex.choices[ex.correctIndex];
        }
        if (correct != null) payload.correctAnswer = String(correct);

        // optional fields
        if (ex.difficulty != null) payload.difficulty = Number(ex.difficulty);
        if (ex.created_at || ex.createdAt) payload.createdAt = ex.created_at ?? ex.createdAt;

        // validate required for upsert: lessonId + questionKm + solutionKm + correctAnswer
        const missing: string[] = [];
        if (!payload.lessonId) missing.push("lessonId");
        if (!payload.questionKm) missing.push("questionKm");
        if (!payload.solutionKm) missing.push("solutionKm");
        if (!payload.correctAnswer) missing.push("correctAnswer");
        if (missing.length > 0) {
          console.warn(`Skipping exercise id ${payload.id} from ${path.relative(process.cwd(), f)} — missing: ${missing.join(", ")}`);
          continue;
        }

        // Upsert using Prisma
        try {
          await (prisma as any).exercise.upsert({
            where: { id: payload.id },
            update: payload,
            create: payload,
          });
          total++;
        } catch (err: any) {
          console.error(`Failed to upsert id ${payload.id} : ${err?.message ?? safeJsonStringify(err)}`);
        }
      }

      console.log(`Imported ${total} exercises from ${path.relative(process.cwd(), f)}`);
    } catch (err: any) {
      console.error("Failed parsing/importing", f, err?.message ?? safeJsonStringify(err));
    }
  }

  console.log(`Done. Imported/updated ${total} exercises.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
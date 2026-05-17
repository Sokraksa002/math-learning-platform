import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

async function walk(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.isFile() && full.endsWith('.json')) files.push(full);
  }
  return files;
}

function normalizeToTitle(s: string) {
  const parts = String(s).replace(/[-_]+/g, ' ').split(' ').filter(Boolean);
  return parts.map(p => p[0]?.toUpperCase() + p.slice(1)).join(' ');
}

async function main() {
  const base = path.join(__dirname, '..', 'data', 'exercises');
  const files = await walk(base);

  // Map lesson identifier -> example file path and top-level folder
  const lessonMap = new Map<string, { file: string; folder: string }>();

  for (const f of files) {
    try {
      const raw = readFileSync(f, 'utf8');
      const parsed = JSON.parse(raw);
      const lid = parsed.lessonId ?? parsed.lesson_id ?? undefined;
      if (!lid) continue;

      // derive top-level folder under data/exercises (e.g. grade12-integrals)
      const rel = path.relative(base, f);
      const parts = rel.split(path.sep).filter(Boolean);
      const top = parts.length > 0 ? parts[0] : 'Imported';

      if (!lessonMap.has(String(lid))) {
        lessonMap.set(String(lid), { file: f, folder: top });
      }
    } catch (err: any) {
      console.warn('skip', f, err?.message ?? String(err));
    }
  }

  if (lessonMap.size === 0) {
    console.log('No lesson ids found in JSON files');
    process.exit(0);
  }

  // For each unique lesson identifier, create/find a chapter based on top-level folder
  const createdChapters = new Map<string, { id: string; title: string }>();

  for (const [id, info] of Array.from(lessonMap.entries()).sort((a, b) => String(a[0]).localeCompare(String(b[0])))) {
    const title = normalizeToTitle(String(id));

    // determine chapter title from folder name (e.g. 'grade12-integrals' -> 'Grade12 Integrals')
    const chapterKey = info.folder;
    let chapter = createdChapters.get(chapterKey);

    if (!chapter) {
      const chapterTitle = normalizeToTitle(chapterKey);
      // try find existing chapter by titleKm
      const existingChap = await (prisma as any).chapter.findFirst({ where: { titleKm: chapterTitle }, select: { id: true, titleKm: true } }).catch(() => null);
      if (existingChap && existingChap.id) {
        chapter = { id: existingChap.id, title: existingChap.titleKm };
      } else {
        const created = await (prisma as any).chapter.create({ data: { titleKm: chapterTitle, orderIndex: 99999, isPublished: false } }).catch((e: any) => { console.error('chapter create failed', e?.message ?? String(e)); return null; });
        if (created && created.id) chapter = { id: created.id, title: created.titleKm };
      }

      if (!chapter) {
        console.error('Failed to create/find chapter for', chapterKey);
        process.exit(1);
      }

      createdChapters.set(chapterKey, chapter);
      console.log('Using chapter id', chapter.id, 'for folder', chapterKey, '->', chapter.title);
    }

    // check if a lesson already exists with this titleKm
    const existing = await (prisma as any).lesson.findFirst({ where: { titleKm: title }, select: { id: true, chapterId: true } }).catch(() => null);
    if (existing && existing.id) {
      // if it exists but under a different chapter, move it
      if (existing.chapterId !== chapter!.id) {
        const moved = await (prisma as any).lesson.update({ where: { id: existing.id }, data: { chapterId: chapter!.id } }).catch((e: any) => { console.error('failed to move lesson', existing.id, e?.message ?? String(e)); return null; });
        if (moved && moved.id) console.log('Moved:', moved.id, '|', title, '->', chapter!.title);
        else console.log('Exists:', existing.id, '|', title);
      } else {
        console.log('Exists:', existing.id, '|', title);
      }
      continue;
    }

    const created = await (prisma as any).lesson.create({ data: { chapterId: chapter.id, titleKm: title, orderIndex: 99999 } }).catch((e: any) => { console.error('create failed', e?.message ?? String(e)); return null; });
    if (created && created.id) console.log('Created:', created.id, '|', title, '->', chapter.title);
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

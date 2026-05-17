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
  const uniqueIds = new Set<string>();

  for (const f of files) {
    try {
      const raw = readFileSync(f, 'utf8');
      const parsed = JSON.parse(raw);
      const lid = parsed.lessonId ?? parsed.lesson_id ?? undefined;
      if (lid) uniqueIds.add(String(lid).trim());
    } catch (err: any) {
      console.warn('skip', f, err?.message ?? String(err));
    }
  }

  console.log('Found', uniqueIds.size, 'unique lesson identifiers');

  for (const id of Array.from(uniqueIds).sort()) {
    // skip UUIDs
    const uuidRe = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (uuidRe.test(id)) continue;

    // try to figure out chapter key from id prefix, e.g. "grade12-complex-lesson1" -> "grade12-complex"
    const parts = id.split('-');
    if (parts.length < 2) {
      console.warn('Cannot infer chapter from id:', id);
      continue;
    }

    const chapterKey = parts.slice(0, 2).join('-');
    const chapterTitle = normalizeToTitle(chapterKey);
    const chapter = await (prisma as any).chapter.findFirst({ where: { titleKm: chapterTitle }, select: { id: true, titleKm: true } }).catch(() => null);

    if (!chapter) {
      console.warn('No chapter found for', chapterKey, '(expected titleKm:', chapterTitle, ') — skipping', id);
      continue;
    }

    // check if a lesson with titleKm === id already exists
    const existing = await (prisma as any).lesson.findFirst({ where: { titleKm: id }, select: { id: true } }).catch(() => null);
    if (existing && existing.id) {
      console.log('Placeholder already exists for', id, '->', existing.id);
      continue;
    }

    // create placeholder lesson under the chapter
    try {
      const created = await (prisma as any).lesson.create({ data: { chapterId: chapter.id, titleKm: id, orderIndex: 99999, isPublished: false } });
      console.log('Created placeholder lesson', created.id, '|', id, '-> chapter', chapter.titleKm);
    } catch (e: any) {
      console.error('Failed to create placeholder for', id, e?.message ?? String(e));
    }
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

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
  const base = path.join(__dirname, '..', 'data', 'lessons');
  const files = await walk(base);
  if (files.length === 0) {
    console.log('No lesson files found in', base);
    process.exit(0);
  }

  for (const f of files) {
    try {
      const raw = readFileSync(f, 'utf8');
      const parsed = JSON.parse(raw);

      const rel = path.relative(base, f);
      const parts = rel.split(path.sep).filter(Boolean);
      const top = parts.length > 0 ? parts[0] : 'Imported';

      const chapterTitle = normalizeToTitle(top);
      let chapter = await (prisma as any).chapter.findFirst({ where: { titleKm: chapterTitle }, select: { id: true } }).catch(() => null);
      if (!chapter || !chapter.id) {
        chapter = await (prisma as any).chapter.create({ data: { titleKm: chapterTitle, orderIndex: 99999, isPublished: false } }).catch(() => null);
      }
      if (!chapter || !chapter.id) {
        console.error('Failed to create/find chapter for', chapterTitle);
        continue;
      }

      const lid = parsed.lessonId ?? parsed.lesson_id ?? undefined;
      const title = parsed.titleKm ?? parsed.title_km ?? parsed.title ?? normalizeToTitle(lid ?? path.basename(f, '.json'));
      const content = parsed.content ?? parsed.content_json ?? parsed.contentJson ?? parsed;

      // Upsert lesson by matching titleKm OR by external lesson id stored previously as title
      let existing = null;
      if (lid) {
        const normalizedTitle = normalizeToTitle(String(lid));
        existing = await (prisma as any).lesson.findFirst({ where: { OR: [{ titleKm: title }, { titleKm: normalizedTitle }] }, select: { id: true } }).catch(() => null);
      } else {
        existing = await (prisma as any).lesson.findFirst({ where: { titleKm: title }, select: { id: true } }).catch(() => null);
      }

      const payload: any = { chapterId: chapter.id, titleKm: title, orderIndex: parsed.orderIndex ?? 99999 };
      if (content) payload.contentJson = content;

      if (existing && existing.id) {
        await (prisma as any).lesson.update({ where: { id: existing.id }, data: payload }).catch((e: any) => console.error('Failed to update lesson', existing.id, e?.message ?? String(e)));
        console.log('Updated lesson', existing.id, '|', title, '->', chapterTitle);
      } else {
        const created = await (prisma as any).lesson.create({ data: payload }).catch((e: any) => { console.error('Failed to create lesson for', title, e?.message ?? String(e)); return null; });
        if (created && created.id) console.log('Created lesson', created.id, '|', title, '->', chapterTitle);
      }

    } catch (err: any) {
      console.error('Failed parsing', f, err?.message ?? String(err));
    }
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

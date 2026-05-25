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
    console.log('No lesson files found');
    process.exit(0);
  }

  // Group by top-level folder
  const groups = new Map<string, string[]>();
  for (const f of files) {
    const rel = path.relative(base, f);
    const parts = rel.split(path.sep).filter(Boolean);
    const top = parts.length > 0 ? parts[0] : 'Imported';
    if (!groups.has(top)) groups.set(top, []);
    groups.get(top)!.push(f);
  }

  for (const [folder, fileList] of groups.entries()) {
    // sort by filename to produce stable order
    fileList.sort();
    // ensure chapter exists
    const chapterTitle = normalizeToTitle(folder);
    const chapter = await (prisma as any).chapter.findFirst({ where: { titleKm: chapterTitle }, select: { id: true } }).catch(() => null);
    if (!chapter || !chapter.id) {
      console.warn('missing chapter for', chapterTitle);
      continue;
    }

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      try {
        const raw = readFileSync(f, 'utf8');
        const parsed = JSON.parse(raw);
        const lid = parsed.lessonId ?? parsed.lesson_id ?? undefined;
        const titleFromJson = parsed.titleKm ?? parsed.title_km ?? parsed.title ?? undefined;
        const title = titleFromJson ?? (lid ? normalizeToTitle(String(lid)) : normalizeToTitle(path.basename(f, '.json')));

        // find lesson by title matching either normalized lid title or the actual title
        const normalizedLidTitle = lid ? normalizeToTitle(String(lid)) : null;
        const whereClause: any = { OR: [{ titleKm: title }] };
        if (normalizedLidTitle) whereClause.OR.push({ titleKm: normalizedLidTitle });

        const lesson = await (prisma as any).lesson.findFirst({ where: whereClause, select: { id: true } }).catch(() => null);
        if (!lesson || !lesson.id) {
          console.warn('lesson not found for', f, title);
          continue;
        }

        const updateData: any = { orderIndex: i + 1, /* set increasing order */ isPublished: true };
        if (titleFromJson) updateData.titleKm = titleFromJson;

        await (prisma as any).lesson.update({ where: { id: lesson.id }, data: updateData }).catch((e: any) => { console.error('failed update', lesson.id, e?.message ?? String(e)); });
        console.log('Updated lesson', lesson.id, '|', updateData.titleKm ?? title, 'orderIndex=', updateData.orderIndex);
      } catch (err: any) {
        console.error('skip', f, err?.message ?? String(err));
      }
    }
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

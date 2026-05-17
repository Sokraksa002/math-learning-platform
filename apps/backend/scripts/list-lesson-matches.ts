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

function normalizeId(s: string) {
  return s.replace(/^\/+|\/+$/g, '').trim();
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
      if (lid) uniqueIds.add(String(lid));
    } catch (err: any) {
      console.warn('skip', f, err?.message ?? String(err));
    }
  }

  console.log('Found', uniqueIds.size, 'unique lesson identifiers in JSON files');

  for (const id of Array.from(uniqueIds).sort()) {
    console.log('\n===', id, '===');

    // If it's a uuid, just show it
    const uuidRe = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (uuidRe.test(id)) {
      const lesson = await (prisma as any).lesson.findUnique({ where: { id }, select: { id: true, titleKm: true } }).catch(() => null);
      console.log('JSON id is UUID ->', lesson ? `${lesson.id} | ${lesson.titleKm}` : 'not found in DB');
      continue;
    }

    // Not a UUID: try candidates in DB by titleKm
    const candidates = await (prisma as any).lesson.findMany({ where: { titleKm: String(id) }, select: { id: true, titleKm: true } }).catch(() => []);
    if (candidates.length) {
      console.log('Candidates by exact titleKm:');
      for (const c of candidates) console.log('-', c.id, '|', c.titleKm);
      continue;
    }

    // Try normalization: replace dashes/underscores and title-case
    const parts = id.replace(/[-_]+/g, ' ').split(' ').filter(Boolean);
    if (parts.length) {
      const normalized = parts.map(p => p[0]?.toUpperCase() + p.slice(1)).join(' ');
      const cand2 = await (prisma as any).lesson.findMany({ where: { titleKm: normalized }, select: { id: true, titleKm: true } }).catch(() => []);
      if (cand2.length) {
        console.log('Candidates by normalized titleKm:');
        for (const c of cand2) console.log('-', c.id, '|', c.titleKm);
        continue;
      }
    }

    console.log('No candidates found — you should add a Lesson with titleKm matching one of:', Array.from([id]).slice(0,5).join(', '));
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

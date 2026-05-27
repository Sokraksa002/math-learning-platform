import { prisma } from '../src/lib/prisma';

function isHyphenUuid(s: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);
}

function isSimpleUuid(s: string) {
  return /^[0-9a-fA-F]{32}$/.test(s);
}

async function main() {
  console.log('Scanning lessons for invalid UUIDs...');

  const lessons = await prisma.lesson.findMany({ select: { id: true, chapterId: true, titleKm: true } });

  const invalid = lessons.filter((l) => {
    if (!l.id || typeof l.id !== 'string') return true;
    if (isHyphenUuid(l.id) || isSimpleUuid(l.id)) return false;
    return true;
  });

  console.log(`Checked ${lessons.length} lessons. Found ${invalid.length} invalid lesson ids.`);
  if (invalid.length > 0) {
    console.table(invalid.map((i) => ({ id: i.id, chapterId: i.chapterId, titleKm: i.titleKm })));
  }

  // chapters
  console.log('Scanning chapters...');
  const chapters = await prisma.chapter.findMany({ select: { id: true, titleKm: true } });
  const invalidCh = chapters.filter((c) => !c.id || (typeof c.id === 'string' && !(isHyphenUuid(c.id) || isSimpleUuid(c.id))));
  console.log(`Checked ${chapters.length} chapters. Found ${invalidCh.length} invalid chapter ids.`);
  if (invalidCh.length > 0) console.table(invalidCh.map((c) => ({ id: c.id, titleKm: c.titleKm })));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

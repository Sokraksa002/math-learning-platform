import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Checking chapters...');
  let chapters = await prisma.chapter.findMany({ orderBy: { orderIndex: 'asc' } });

  // If no chapters exist, create two defaults
  if (!chapters || chapters.length === 0) {
    console.log('No chapters found — creating default chapters');
    const c1 = await prisma.chapter.create({ data: { titleKm: 'Default Chapter 1', orderIndex: 1, isPublished: true } });
    const c2 = await prisma.chapter.create({ data: { titleKm: 'Default Chapter 2', orderIndex: 2, isPublished: true } });
    chapters = [c1, c2];
  }

  const chapterIds = new Set(chapters.map((c) => c.id));

  console.log('Fetching lessons...');
  const lessons = await prisma.lesson.findMany({ select: { id: true, chapterId: true, titleKm: true } });

  const orphan = lessons.filter((l) => !chapterIds.has(l.chapterId));
  console.log(`Found ${orphan.length} orphan lessons (no matching chapter)`);

  if (orphan.length === 0) {
    console.log('No orphan lessons to update.');
    await prisma.$disconnect();
    return;
  }

  const targetChapter = chapters[0];
  console.log(`Assigning ${orphan.length} lessons to chapter ${targetChapter.id} (${targetChapter.titleKm})`);

  for (const l of orphan) {
    try {
      await prisma.lesson.update({ where: { id: l.id }, data: { chapterId: targetChapter.id } });
      console.log('Updated lesson', l.id, '->', targetChapter.id, '|', l.titleKm);
    } catch (e: any) {
      console.error('Failed to update lesson', l.id, e?.message ?? String(e));
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

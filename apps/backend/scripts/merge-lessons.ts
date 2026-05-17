import { PrismaClient } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Starting lesson merge...');

  const chapters = await prisma.chapter.findMany({ include: { lessons: { orderBy: { orderIndex: 'asc' } } }, orderBy: { orderIndex: 'asc' } });

  for (const ch of chapters) {
    if (!ch.lessons || ch.lessons.length <= 1) continue;

    // canonical lesson: lowest orderIndex
    const canonical = ch.lessons[0];
    const toMerge = ch.lessons.slice(1);

    console.log(`Chapter ${ch.titleKm} (${ch.id}): canonical lesson ${canonical.id} (${canonical.titleKm}), merging ${toMerge.length} placeholders`);

    for (const l of toMerge) {
      // move exercises from l -> canonical
      const moved = await prisma.exercise.updateMany({ where: { lessonId: l.id }, data: { lessonId: canonical.id } });
      console.log(`  Moved ${moved.count} exercises from ${l.id} -> ${canonical.id}`);

      // delete the lesson (its exercises moved)
      try {
        await prisma.lesson.delete({ where: { id: l.id } });
        console.log(`  Deleted placeholder lesson ${l.id} (${l.titleKm})`);
      } catch (e: any) {
        console.error(`  Failed deleting lesson ${l.id}:`, e?.message ?? String(e));
      }
    }
  }

  await prisma.$disconnect();
  console.log('Merge complete');
}

main().catch(e => { console.error(e); process.exit(1); });

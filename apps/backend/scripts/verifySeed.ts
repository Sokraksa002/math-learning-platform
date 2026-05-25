import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Verifying seed data...');
  const users = await prisma.user.count();
  const chapters = await prisma.chapter.count();
  const lessons = await prisma.lesson.count();
  const exercises = await prisma.exercise.count();
  const quizSessions = await prisma.quizSession.count();

  console.log('users', users);
  console.log('chapters', chapters);
  console.log('lessons', lessons);
  console.log('exercises', exercises);
  console.log('quizSessions', quizSessions);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Verification script failed:', e);
  process.exit(1);
});

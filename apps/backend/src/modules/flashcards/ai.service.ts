import { prisma } from '../../lib/prisma';
import { generateFlashcardsWithGemini, AIGeneratedFlashcard } from '../../lib/ai/cloudAIGenerator';
import type { LessonContent } from '../../lib/contentJson';

export async function generateFlashcardsForLesson(lessonId: string, save = false, userId?: string) {
  // load lesson content
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) throw new Error('Lesson not found');

  // lesson.contentJson may be nullable in schema — guard
  const content = (lesson.contentJson ?? null) as unknown as LessonContent | null;
  if (!content) return [];

  // Development fallback: allow mocking AI responses when MOCK_AI=true
  let aiCards: AIGeneratedFlashcard[];
  if (process.env.MOCK_AI === 'true') {
    aiCards = [
      {
        question: (content as any)?.title?.km ?? 'Sample question',
        answer: 'Sample answer',
      },
    ];
  } else {
    aiCards = await generateFlashcardsWithGemini(content);
  }

  if (!save) return aiCards;

  // persist as flashcards belonging to user if provided, otherwise use first user
  const created = [] as any[];
  let ownerId = userId;
  if (!ownerId) {
    // upsert a system user to own generated flashcards if no user provided
    const sys = await prisma.user.upsert({
      where: { email: 'ai-system@example.com' },
      update: { name: 'AI System' },
      create: { email: 'ai-system@example.com', name: 'AI System', passwordHash: 'x' },
    });
    ownerId = sys.id;
  }

  for (const card of aiCards) {
    const fb = await prisma.flashcard.create({
      data: {
        userId: ownerId ?? undefined,
        chapterId: lesson.chapterId,
        questionKm: card.question,
        answerJson: { text: card.answer },
        isUserGenerated: false,
      },
    });
    created.push(fb);
  }

  return created;
}

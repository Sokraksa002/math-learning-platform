import { prisma } from '../../lib/prisma';
import { generateFlashcardsWithGemini } from '../../lib/ai/cloudAIGenerator';

export async function generateAndSaveFlashcard(opts: {
  userId: string;
  lessonId: string;
  topic: string;
}): Promise<{
  flashcard: Awaited<ReturnType<typeof prisma.flashcard.create>>;
}> {
  const { userId, lessonId, topic } = opts;

  console.log('TOPIC SENT TO AI:', topic);

  /* ✅ FIND LESSON */
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  const chapterId = lesson.chapterId;

  /* ✅ ✅ USE GEMINI (REAL AI) */
  const cards = await generateFlashcardsWithGemini({
    topic,
  });

  if (!cards.length) {
    throw new Error('No AI response');
  }

  const firstCard = cards[0];

  /* ✅ SAVE INTO DATABASE */
  const created = await prisma.flashcard.create({
    data: {
      userId,
      chapterId,
      questionKm: firstCard.question,
      answerJson: { text: firstCard.answer },
      isUserGenerated: true,
    },
  });

  return { flashcard: created };
}

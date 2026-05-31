import { prisma } from '../../lib/prisma';
import { generateFlashcardsWithGemini, AIGeneratedFlashcard } from '../../lib/ai/cloudAIGenerator';

export async function generateFlashcardsForLesson(
  lessonId: string,
  topic: string,
  save = false,
  userId?: string,
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) throw new Error('Lesson not found');

  let aiCards: AIGeneratedFlashcard[];

  /* ✅ MOCK MODE */
  if (process.env.MOCK_AI === 'true') {
    aiCards = [
      {
        question: topic,
        answer: `នេះជាចម្លើយគំរូ សម្រាប់: ${topic}`,
      },
    ];
  } else {
    /* ✅ REAL AI USING TOPIC */
    aiCards = await generateFlashcardsWithGemini({
      topic,
    });
  }

  if (!save) return aiCards;

  let ownerId = userId;

  if (!ownerId) {
    const sys = await prisma.user.upsert({
      where: { email: 'ai-system@example.com' },
      update: { name: 'AI System' },
      create: {
        email: 'ai-system@example.com',
        name: 'AI System',
        passwordHash: 'x',
      },
    });
    ownerId = sys.id;
  }

  const created = [];

  for (const card of aiCards) {
    const fb = await prisma.flashcard.create({
      data: {
        userId: ownerId,
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

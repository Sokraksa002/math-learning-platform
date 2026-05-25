import { prisma } from '../../lib/prisma';
import { AiFlashcard, generateFlashcardWithAi } from '../../lib/ai/generateFlashcard';

export async function generateAndSaveFlashcard(opts: {
  userId: string;
  chapterId: string;
  question: string;
}): Promise<{ flashcard: Awaited<ReturnType<typeof prisma.flashcard.create>> } | never> {
  const { userId, chapterId, question } = opts;

  // Call AI
  const aiResult: AiFlashcard = await generateFlashcardWithAi(question);

  // Persist result
  const created = await prisma.flashcard.create({
    data: {
      userId,
      chapterId,
      questionKm: aiResult.question,
      answerJson: aiResult,
      isUserGenerated: true,
    },
  });

  return { flashcard: created };
}

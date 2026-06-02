import { prisma } from '../../lib/prisma';

export interface AIGeneratedFlashcard {
  question: string;
  answer: string;
}

export async function generateFlashcardsForLesson(
  lessonId: string,
  topicOrSave?: string | boolean,
  saveOrUserId?: boolean | string,
  maybeUserId?: string,
) {
  const normalized = normalizeFlashcardArgs(topicOrSave, saveOrUserId, maybeUserId);
  let aiCards: AIGeneratedFlashcard[] = [];

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      exercises: {
        select: { questionKm: true },
        take: 1,
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!lesson) throw new Error('Lesson not found');

  const lessonTopic =
    (lesson as any)?.titleKm ||
    (lesson as any)?.fallbackTitle ||
    (lesson as any)?.title?.km ||
    (lesson as any)?.title?.en ||
    (lesson as any)?.title ||
    lesson.exercises?.[0]?.questionKm ||
    `Lesson ${lessonId}`;

  const topic = normalized.topic?.trim() || lessonTopic;

  /* ✅ MOCK MODE */
  if (process.env.MOCK_AI === 'true') {
    aiCards = [
      {
        question: topic,
        answer: `នេះជាចម្លើយគំរូ សម្រាប់: ${topic}`,
      },
    ];
  } else {
    /* ✅ REAL AI USING GROQ SDK (100% FREE & ULTRA FAST) */
    try {
      // ប្រើប្រាស់ Dynamic Import ដើម្បីកុំឱ្យជួបបញ្ហា CommonJS vs ESM Module របស់ Vite/Node
      const { default: Groq } = await import('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

      const chatCompletion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `You are an expert math teacher. Create an array of exactly 3 educational flashcards in Khmer for the topic "${topic}".
            Each flashcard must be a single JSON object containing exactly two fields: "question" and "answer".
            The answer must be a short solution flow like a worked example.
            Use 3 to 5 short lines.
            Each line should show one step of the derivation.
            Do not number the lines.
            Use simple Khmer words, and when useful show equations with LaTeX.
            Keep the explanation concise and easy to follow.
            End with a final line that states the answer clearly.
            Return ONLY a clean JSON object containing a "flashcards" array.`,
          },
        ],
        response_format: { type: 'json_object' }, // បង្ខំឱ្យ Groq ឆ្លើយតបមកវិញជាទម្រង់ JSON ស្អាត
      });

      const responseText = chatCompletion.choices?.[0]?.message?.content;
      if (!responseText) throw new Error('No response text from Groq API');

      const parsedData = JSON.parse(responseText);
      // ចាប់យកអារេកាតរំលឹកពី Groq
      const rawCards = parsedData.flashcards || parsedData.data?.flashcards || parsedData;
      if (Array.isArray(rawCards)) {
        aiCards = rawCards.map((c: any) => ({
          question: c.question || c.questionKm || '',
          answer: c.answer || c.answerJson?.text || '',
        }));
      }
    } catch (error) {
      console.error('❌ Groq Flashcard Error:', error);
      // បើសិនជា AI មានបញ្ហា ឱ្យវាលោតចូល Fallback Card កុំឱ្យគាំងវេបសាយ
      aiCards = [
        {
          question: topic,
          answer: `មិនអាចបង្កើតកាតពី AI បានទេ៖ ${error instanceof Error ? error.message : 'Unknown Error'}`,
        },
      ];
    }
  }

  /* ✅ រក្សាទុកកាតចូលទៅក្នុង Database (Prisma) */
  if (!normalized.save) return aiCards;

  let ownerId = normalized.userId;
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

  return aiCards;
}

function normalizeFlashcardArgs(
  topicOrSave?: string | boolean,
  saveOrUserId?: boolean | string,
  maybeUserId?: string,
) {
  if (typeof topicOrSave === 'string') {
    return {
      topic: topicOrSave,
      save: typeof saveOrUserId === 'boolean' ? saveOrUserId : false,
      userId:
        typeof maybeUserId === 'string'
          ? maybeUserId
          : typeof saveOrUserId === 'string'
            ? saveOrUserId
            : undefined,
    };
  }

  return {
    topic: undefined,
    save: typeof topicOrSave === 'boolean' ? topicOrSave : false,
    userId:
      typeof saveOrUserId === 'string'
        ? saveOrUserId
        : typeof maybeUserId === 'string'
          ? maybeUserId
          : undefined,
  };
}

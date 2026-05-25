export function buildGeminiPrompt(text: string): string {
  return `
You are a mathematics teacher.

Generate flashcards from the lesson below.
Each flashcard must include:
- question
- answer

Rules:
- Answer ONLY in Khmer language.
- Explain concepts clearly for students.
- Use simple math explanations.
- Output ONLY valid JSON in this format:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Lesson content:
${text}
`;
}
``;

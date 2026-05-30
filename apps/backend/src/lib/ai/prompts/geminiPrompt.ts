export function buildGeminiPrompt(text: string): string {
  return `
You are a mathematics teacher.

Generate flashcards from the lesson below. Each flashcard must include these keys exactly:
- "question": the question in Khmer (ភាសាខ្មែរ)
- "answer": the answer in Khmer (ភាសាខ្មែរ)

Rules (STRICT):
- Answer ONLY in Khmer script (ភាសាខ្មែរ). Do NOT transliterate to Latin.
- Do NOT include any commentary, metadata, or explanation outside the JSON.
- Use simple, clear math explanations suitable for students.
- If the lesson has no useful flashcards, return an empty JSON array `[]`.
- Output ONLY valid JSON and nothing else. The JSON must be an array of objects in this exact format:

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


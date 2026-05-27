import { LessonContent, TextBlock, FormulaBlock } from './contentJson';

export function extractLessonText(content: LessonContent): string {
  return content.blocks
    .filter((b): b is TextBlock | FormulaBlock => b.type === 'text' || b.type === 'formula')
    .map((b) => b.value)
    .join('\n');
}
``;

import { LessonContent } from './contentJson';

export function extractLessonText(content: LessonContent): string {
  return content.blocks
    .filter((b) => b.type === 'text' || b.type === 'formula')
    .map((b) => b.value)
    .join('\n');
}
``;

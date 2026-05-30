const STORAGE_KEY = "math-learning-completed-lessons";

/**
 * ✅ READ PROGRESS
 */
const readCompletedLessonIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
};

/**
 * ✅ WRITE PROGRESS
 */
const writeCompletedLessonIds = (lessonIds: string[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessonIds));
};

/**
 * ✅ GET PROGRESS
 */
export const getCompletedLessonIds = (): string[] => {
  return readCompletedLessonIds();
};

/**
 * ✅ MARK COMPLETE
 */
export const markLessonCompleted = (lessonId: string): string[] => {
  const current = readCompletedLessonIds();

  if (current.includes(lessonId)) {
    return current;
  }

  const updated = [...current, lessonId];
  writeCompletedLessonIds(updated);

  return updated;
};

/**
 * ✅ REMOVE (optional)
 */
export const unmarkLessonCompleted = (lessonId: string): string[] => {
  const current = readCompletedLessonIds();
  const updated = current.filter((id) => id !== lessonId);

  writeCompletedLessonIds(updated);
  return updated;
};

/**
 * ✅ CHECK SINGLE LESSON
 */
export const isLessonCompleted = (lessonId: string): boolean => {
  return readCompletedLessonIds().includes(lessonId);
};

/**
 * ✅ COUNT COMPLETED (for Ability page)
 */
export const getCompletedCount = (): number => {
  return readCompletedLessonIds().length;
};

/**
 * ✅ OPTIONAL: CHECK ALL COMPLETED (dynamic)
 */
export const areAllLessonsCompleted = (allLessonIds: string[]): boolean => {
  const completed = readCompletedLessonIds();
  return allLessonIds.every((id) => completed.includes(id));
};

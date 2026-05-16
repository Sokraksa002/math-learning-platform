const COMPLETED_LESSON_STORAGE_KEY = 'math-learning-completed-lessons';

export const REQUIRED_LESSON_IDS = [101, 102, 201, 202] as const;

const readCompletedLessonIds = (): number[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(COMPLETED_LESSON_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed)
      ? parsed.map((value) => Number(value)).filter((value) => Number.isFinite(value))
      : [];
  } catch {
    return [];
  }
};

const writeCompletedLessonIds = (lessonIds: number[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(COMPLETED_LESSON_STORAGE_KEY, JSON.stringify(lessonIds));
};

export const getCompletedLessonIds = (): number[] => readCompletedLessonIds();

export const markLessonCompleted = (lessonId: number): number[] => {
  const currentLessonIds = readCompletedLessonIds();
  if (currentLessonIds.includes(lessonId)) {
    return currentLessonIds;
  }

  const updatedLessonIds = [...currentLessonIds, lessonId];
  writeCompletedLessonIds(updatedLessonIds);
  return updatedLessonIds;
};

export const areAllLessonsCompleted = (): boolean =>
  REQUIRED_LESSON_IDS.every((lessonId) => readCompletedLessonIds().includes(lessonId));

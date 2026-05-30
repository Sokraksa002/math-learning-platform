type StudyTime = {
  date: string;
  minutes: number;
};

const STORAGE_KEY = "getStudyTime";

/**
 * ✅ SAVE STUDY TIME
 */
export const logStudyTime = (minutes: number) => {
  const data: StudyTime[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  data.push({
    date: new Date().toISOString(),
    minutes,
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * ✅ GET STUDY TIME
 */
export const getStudyTime = (): StudyTime[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
// ================= BASE URL =================
const API_URL = "";

// ================= TYPES =================

export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  role?: string;
};

export type LoginData = {
  token: string;
  user?: User;
};

export type Chapter = {
  id: string;
  titleKm: string;
};

// ✅ ✅ ✅ FIXED LESSON TYPE (IMPORTANT)
export type Lesson = {
  id: string;

  // backend fields
  titleKm?: string;
  chapterId?: string;

  // frontend used fields
  title?: string | { en?: string; km?: string };
  fallbackTitle?: string;

  contentJson?: {
    summary?: string | Record<string, string>;
    paragraphs?: string[];
    description?: string;
    html?: string | Record<string, string>;
    [key: string]: unknown;
  };
};

export type Progress = {
  completedLessons: number;
  score: number;
};

// ================= QUIZ TYPES =================

export type Exercise = {
  id: string;
  questionKm: string;
  solutionKm: string;
  correctAnswer: string;
};

export type QuizItem = {
  id: string;
  exerciseId: string;
  exercise: Exercise;
};

export type QuizSession = {
  id: string;
  lessonId: string;
  items: QuizItem[];
};

export type QuizAnswer = {
  exerciseId: string;
  selectedChoice: string;
};

export type QuizResult = {
  score: number;
  total: number;
  correct: number;
  wrongAnswers: {
    question?: string;
    correctAnswer?: string;
    selected?: string;
    solutionKm?: string;
  }[];
};

// ================= TOKEN =================

export function saveToken(token: string) {
  localStorage.setItem("mlp_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("mlp_token");
}

export function clearToken() {
  localStorage.removeItem("mlp_token");
}

// ================= HEADERS =================

function buildHeaders(): Record<string, string> {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ================= RESPONSE HANDLER =================

async function handleResponse<T>(res: Response): Promise<T> {
  let data: unknown;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data
    ) {
      throw new Error((data as { message: string }).message);
    }
    throw new Error(`HTTP ${res.status}`);
  }

  return data as T;
}

// ================= GENERIC =================

export async function publicPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function protectedPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function protectedGet<T>(
  path: string
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(),
  });

  return handleResponse<T>(res);
}

// ================= AUTH =================

export async function login(
  email: string,
  password: string
): Promise<LoginData> {
  return publicPost<LoginData>("/api/auth/login", {
    email,
    password,
  });
}

// ================= CHAPTER =================

export async function getChapters(): Promise<Chapter[]> {
  return protectedGet<Chapter[]>("/api/chapters");
}

// ================= LESSON =================

export async function getAllLessons(): Promise<Lesson[]> {
  return protectedGet<Lesson[]>("/api/lessons");
}

export async function getLesson(id: string): Promise<Lesson> {
  return protectedGet<Lesson>(`/api/lesson/${id}`);
}

// ✅ ✅ ✅ REQUIRED FOR LessonDetail
export async function getLessonExercises(
  id: string
): Promise<{ count: number }> {
  return protectedGet<{ count: number }>(
    `/api/lesson-exercises/${id}`
  );
}

// ================= QUIZ =================

export async function startQuiz(
  lessonId: string,
  count = 10
): Promise<QuizSession> {
  return protectedPost<QuizSession>("/api/quiz/start", {
    lessonId,
    count,
  });
}

export async function submitQuiz(
  sessionId: string,
  answers: QuizAnswer[]
): Promise<QuizResult> {
  return protectedPost<QuizResult>("/api/quiz/submit", {
    sessionId,
    answers,
  });
}

export async function getQuizResult(
  sessionId: string
): Promise<QuizSession> {
  return protectedGet<QuizSession>(
    `/api/quiz/result/${sessionId}`
  );
}

// ================= PROGRESS =================

export async function getProgress(): Promise<Progress> {
  return protectedGet<Progress>("/api/progress");
}
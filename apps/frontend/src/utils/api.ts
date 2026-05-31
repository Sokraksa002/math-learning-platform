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

export type QuizLessonSummary = {
  lessonId: string;
  title: string;
  subject: string;
  exerciseCount: number;
  orderIndex: number;
};

export type AdminChapter = {
  id: string;
  title?: { km?: string } | null;
  fallbackTitle?: string | null;
  orderIndex?: number;
  isPublished?: boolean;
  createdAt?: string;
};

export type CreateAdminChapterPayload = {
  titleKm: string;
  orderIndex: number;
};

export type AdminUserSummary = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  isBanned: boolean;
  createdAt: string;
};

export type CreateAdminUserPayload = {
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  password: string;
};

export type UpdateAdminUserPayload = {
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  isBanned: boolean;
};

export async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<T>(res);
}

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
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  totalQuizzes: number;
  averageScore: number;
};

export type CertificateRecord = {
  id: string;
  userId: string;
  certificateCode: string;
  course: string;
  averageScore: number;
  totalLessons: number;
  issuedAt: string;
  revokedAt?: string | null;
  pdfUrl?: string | null;
};

export type CertificateVerificationRecord = {
  certificateCode: string;
  course: string;
  issuedAt: string;
  student: {
    name: string;
    email: string;
  };
};

export type AdminCertificateRecord = CertificateRecord & {
  status: 'verified' | 'revoked';
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type CertificateEligibility = {
  course: string;
  totalLessons: number;
  completedLessons: number;
  completedQuizzes: number;
  averageScore: number;
  eligible: boolean;
  certificate: CertificateRecord | null;
};

export type AdminLessonSummary = {
  id: string;
  titleKm: string;
  chapterId: string;
  exerciseCount: number;
};

export type AdminLessonExercise = {
  id: string;
  questionKm: string;
  solutionKm: string;
  correctAnswer: string;
  createdAt?: string;
};

export type AdminLessonDetail = {
  id: string;
  titleKm: string;
  chapterId: string;
  exercises: AdminLessonExercise[];
};

export type AdminLessonBlock =
  | { type: 'text'; value: string }
  | { type: 'formula'; value: string }
  | { type: 'flashcard'; question: string; answer: string }
  | { type: 'quiz'; question: string; choices: string[]; correctIndex: number; explanation?: string };

export type AdminLessonContent = {
  blocks: AdminLessonBlock[];
};

export type CreateAdminLessonPayload = {
  chapterId: string;
  titleKm: string;
  orderIndex: number;
  contentJson: AdminLessonContent;
};

// ================= QUIZ TYPES =================

export type Exercise = {
  id: string;
  questionKm: string;
  solutionKm: string;
  correctAnswer: string;

  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

};

export type QuizItem = {
  id: string;
  exerciseId: string;
  question?: string;
  correctAnswer?: string;
  solutionKm?: string;
  choices?: Exercise['choices'];
  exercise?: Exercise;
};

export type QuizSession = {
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
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
  const res = await publicPost<{
    success: boolean;
    data: LoginData;
  }>("/api/auth/login", {
    email,
    password,
  });

  return res.data;
}


// ================= ✅ CHAPTER =================

export async function getChapters(): Promise<Chapter[]> {
  const res = await publicGet<{
    success: boolean;
    data: Chapter[];
  }>("/api/chapters");

  return res.data || [];
}

// ================= ADMIN CHAPTERS =================

export async function getAdminChapters(): Promise<AdminChapter[]> {
  const res = await protectedGet<{
    success: boolean;
    data: AdminChapter[];
  }>("/api/admin/chapters");

  return res.data || [];
}

export async function createAdminChapter(payload: CreateAdminChapterPayload) {
  return protectedPost<{ success: boolean; data: unknown }>("/api/admin/chapters", payload);
}

export async function publishAdminChapter(id: string, isPublished: boolean) {
  return protectedPost<{ success: boolean; data: unknown }>(`/api/admin/chapters/${id}/publish`, {
    isPublished,
  });
}

// ================= ADMIN USERS =================

export async function getAdminUsers(): Promise<AdminUserSummary[]> {
  const res = await protectedGet<{
    success: boolean;
    data: AdminUserSummary[];
  }>("/api/admin/users");

  return res.data || [];
}

export async function createAdminUser(payload: CreateAdminUserPayload) {
  return protectedPost<{ success: boolean; data: unknown }>("/api/admin/users", payload);
}

export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload) {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse<{ success: boolean; data: unknown }>(res);
}

export async function deleteAdminUser(id: string) {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
  });

  return handleResponse<{ success: boolean; data: unknown }>(res);
}

// ================= ✅ LESSON =================

export async function getAllLessons(): Promise<Lesson[]> {
  const res = await publicGet<{
    success: boolean;
    data: Lesson[];
  }>("/api/lessons");

  return res.data || [];
}

export async function getQuizLessons(): Promise<QuizLessonSummary[]> {
  const res = await publicGet<{
    success: boolean;
    data: QuizLessonSummary[];
  }>("/api/quiz/lessons");

  return res.data || [];
}

export async function getLesson(id: string): Promise<Lesson> {
  const res = await publicGet<{
    success: boolean;
    data: Lesson;
  }>(`/api/lesson/${id}`);

  return res.data;
}

// ✅ ✅ ✅ REQUIRED FOR LessonDetail
export async function getLessonExercises(
  id: string
): Promise<{ count: number }> {
  return protectedGet<{ count: number }>(
    `/api/lesson-exercises/${id}`
  );
}

// ================= ADMIN LESSONS =================

export async function getAdminLessons(): Promise<AdminLessonSummary[]> {
  const res = await protectedGet<{
    success: boolean;
    data: AdminLessonSummary[];
  }>("/api/admin/lessons");

  return res.data || [];
}

export async function createAdminLesson(payload: CreateAdminLessonPayload) {
  return protectedPost<{ success: boolean; data: unknown }>("/api/admin/lessons", payload);
}

export async function getAdminLessonDetails(id: string): Promise<AdminLessonDetail> {
  const res = await protectedGet<{
    success: boolean;
    data: AdminLessonDetail;
  }>(`/api/admin/lesson/${id}`);

  return res.data;
}

export async function addAdminExercise(payload: {
  lessonId: string;
  questionKm: string;
  solutionKm: string;
  correctAnswer: string;
}) {
  return protectedPost<{ success: boolean; data: unknown }>("/api/admin/exercise", payload);
}

export async function moveAdminExercise(payload: {
  exerciseId: string;
  newLessonId: string;
}) {
  return protectedPost<{ success: boolean; data: unknown }>("/api/admin/exercise/move", payload);
}

export async function deleteAdminExercise(id: string) {
  const res = await fetch(`${API_URL}/api/admin/exercise/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
  });

  return handleResponse<{ success: boolean; data: unknown }>(res);
}


// ================= QUIZ =================

export async function startQuiz(
  lessonId: string,
  count = 10
): Promise<QuizSession> {
  if (!lessonId) {
    throw new Error("Missing lessonId");
  }

  const res = await fetch(`${API_URL}/api/quiz/start`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      lessonId,   // ✅ MUST MATCH BACKEND
      count,
    }),
  });

  return handleResponse<QuizSession>(res);
}

export async function submitQuiz(
  sessionId: string,
  answers: QuizAnswer[],
  lessonId: string
): Promise<QuizResult> {
  if (!sessionId) {
    throw new Error("Missing sessionId");
  }

  if (!lessonId) {
    throw new Error("Missing lessonId");
  }

  const res = await fetch(`${API_URL}/api/quiz/submit`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      sessionId,
      answers,
      lessonId,
    }),
  });

  return handleResponse<QuizResult>(res);
}

export async function getQuizResult(
  sessionId: string
): Promise<QuizSession> {
  if (!sessionId) {
    throw new Error("Missing sessionId");
  }

  return protectedGet<QuizSession>(
    `/api/quiz/result/${sessionId}`
  );
}

// ================= Flashcard =================

export type AiFlashcardResponse = {
  flashcards: unknown;
};

export async function generateFlashcards(
  lessonId: string,
  save = false
): Promise<AiFlashcardResponse> {
  return protectedPost<AiFlashcardResponse>(
    "/api/ai/flashcards",
    {
      lessonId,
      save,
    }
  );
}
// ================= PROGRESS =================

let progressInFlight: Promise<Progress> | null = null;
let progressCache: { data: Progress; at: number } | null = null;
const PROGRESS_CACHE_MS = 5000;

export async function getProgress(): Promise<Progress> {
  const now = Date.now();

  if (progressCache && now - progressCache.at < PROGRESS_CACHE_MS) {
    return progressCache.data;
  }

  if (progressInFlight) {
    return progressInFlight;
  }

  progressInFlight = protectedGet<Progress>("/api/progress")
    .then((data) => {
      progressCache = { data, at: Date.now() };
      return data;
    })
    .finally(() => {
      progressInFlight = null;
    });

  return progressInFlight;
}

export async function getCompletedLessons(): Promise<string[]> {
  const res = await protectedGet<{
    success: boolean;
    data: string[];
  }>("/api/me/completed-lessons");

  return res.data || [];
}

export async function completeLesson(lessonId: string) {
  const res = await protectedPost<{
    success: boolean;
    data: unknown;
  }>(`/api/lessons/${lessonId}/complete`, {});

  return res.data;
}

// ================= CERTIFICATE =================

export async function getCertificateEligibility(): Promise<CertificateEligibility> {
  const res = await protectedGet<{
    success: boolean;
    data: CertificateEligibility;
  }>("/api/certificates/eligibility");

  return res.data;
}

export async function getMyCertificate(): Promise<CertificateRecord | null> {
  const res = await protectedGet<{
    success: boolean;
    data: CertificateRecord | null;
  }>("/api/certificates/me");

  return res.data ?? null;
}

export async function issueCertificate(): Promise<CertificateRecord> {
  const res = await protectedPost<{
    success: boolean;
    data: CertificateRecord;
  }>("/api/certificates/issue", {});

  return res.data;
}

export async function verifyCertificate(certificateCode: string): Promise<CertificateVerificationRecord> {
  const res = await publicGet<{
    success: boolean;
    data: CertificateVerificationRecord;
  }>(`/api/certificates/verify/${certificateCode}`);

  return res.data;
}

export async function getAdminCertificates(): Promise<AdminCertificateRecord[]> {
  const res = await protectedGet<{
    success: boolean;
    data: AdminCertificateRecord[];
  }>("/api/admin/certificates");

  return res.data || [];
}

export async function revokeAdminCertificate(id: string): Promise<AdminCertificateRecord> {
  const res = await protectedPost<{
    success: boolean;
    data: AdminCertificateRecord;
  }>(`/api/admin/certificates/${id}/revoke`, {});

  return res.data;
}
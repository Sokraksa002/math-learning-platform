export type AdminUserRole = 'admin' | 'student' | 'teacher';
export type AdminUserStatus = 'active' | 'inactive';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminUserRole;
  joinDate: string;
  status: AdminUserStatus;
  progress: number;
  attempts: number;
}

export interface QuizExercise {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  externalId: string;
}

export interface QuizBankItem {
  chapter?: string;
  lessonId: string;
  exercises: QuizExercise[];
}

const USERS_STORAGE_KEY = 'math-admin-users';
const QUIZZES_STORAGE_KEY = 'math-admin-quizzes';

const createExerciseId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `exercise-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const DEFAULT_USERS: AdminUser[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'admin',
    joinDate: '2025-01-01',
    status: 'active',
    progress: 100,
    attempts: 0,
  },
  {
    id: 2,
    name: 'Student One',
    email: 'student1@gmail.com',
    role: 'student',
    joinDate: '2025-01-15',
    status: 'active',
    progress: 78,
    attempts: 14,
  },
  {
    id: 3,
    name: 'Student Two',
    email: 'student2@gmail.com',
    role: 'student',
    joinDate: '2025-02-20',
    status: 'active',
    progress: 64,
    attempts: 11,
  },
  {
    id: 4,
    name: 'Student Three',
    email: 'student3@gmail.com',
    role: 'student',
    joinDate: '2025-03-10',
    status: 'inactive',
    progress: 32,
    attempts: 6,
  },
];

const DEFAULT_QUIZZES: QuizBankItem[] = [
  {
    chapter: 'Limits and Continuity',
    lessonId: 'grade12-limits-and-continuity-lesson2',
    exercises: [
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 1) (x^3 - 1) / (x - 1)',
        choices: ['1', '2', '3', '0'],
        correctIndex: 2,
        explanation: 'ប្រើរូបមន្តផលដកគូប x^3 - 1 = (x - 1)(x^2 + x + 1)។ សម្រួល (x - 1) ចោល រួចជំនួស x = 1 ចូលក្នុង x^2 + x + 1 យើងបាន 1 + 1 + 1 = 3។',
        externalId: 'ex-001',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 0) x / |x|',
        choices: ['1', '-1', '0', 'មិនមានលីមីត'],
        correctIndex: 3,
        explanation: 'លីមីតខាងឆ្វេង (x -> 0-) គឺ -1 និងលីមីតខាងស្តាំ (x -> 0+) គឺ 1។ ដោយលីមីតសងខាងមិនស្មើគ្នា នោះអនុគមន៍មិនមានលីមីតត្រង់ 0 ទេ។',
        externalId: 'ex-002',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 1) (1 - x^2) / (x^2 - 2x + 1)',
        choices: ['No limit', '-infinity', 'infinity', '0'],
        correctIndex: 0,
        explanation: 'សម្រួលបាន -(x+1)/(x-1)។ពេល x → 1 ខាងឆ្វេង លីមីតទៅ +∞ និងខាងស្តាំទៅ -∞។ដោយលីមីតសងខាងខុសគ្នា ⇒ មិនមានលីមីត។',
        externalId: 'ex-003',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 3) (x - 3) / (x^2 - 9)',
        choices: ['1/6', '1/3', '0', '6'],
        correctIndex: 0,
        explanation: 'x^2 - 9 = (x - 3)(x + 3)។ សម្រួល (x - 3) ចោល នៅសល់ 1 / (x + 3)។ ជំនួស x = 3 ចូល បាន 1/6។',
        externalId: 'ex-004',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> -1) (x^2 - x - 2) / (x + 1)^2',
        choices: ['-3', '-infinity', 'infinity', '0'],
        correctIndex: 1,
        explanation: 'x^2 - x - 2 = (x + 1)(x - 2)។ ដូចនេះកន្សោមស្មើ (x - 2) / (x + 1)។ ខណៈដែល x → -1, x - 2 → -3 (< 0) និង (x + 1)^2 > 0 ជានិច្ច។ ដូចនេះលីមីតខិតទៅរក -infinity។',
        externalId: 'ex-005',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 0) (x^2 - x) / (x^2 + x)',
        choices: ['1', '-1', '0', 'infinity'],
        correctIndex: 1,
        explanation: 'ដាក់ x ជាកត្តារួម រួចសម្រួលចោល បាន (x - 1) / (x + 1)។ ជំនួស x = 0 ចូល បាន -1/1 = -1។',
        externalId: 'ex-006',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 0) x^5 / (2x^4 + 3x^2 - x)',
        choices: ['0', '1', '2', 'infinity'],
        correctIndex: 0,
        explanation: 'ដាក់ x ជាកត្តារួមនៅភាគបែង រួចសម្រួលជាមួយភាគយក បាន x^4 / (2x^3 + 3x - 1)។ ជំនួស x = 0 ចូល បាន 0 / -1 = 0។',
        externalId: 'ex-007',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 1) (x^4 - 1) / (x^5 - 1)',
        choices: ['4/5', '1', '0', '5/4'],
        correctIndex: 0,
        explanation: 'ប្រើរូបមន្ត x^n - 1 = (x-1)(x^{n-1} + ... + 1)។ សម្រួល (x-1) ចោល រួចជំនួស x=1 ចូល បាន 4/5។',
        externalId: 'ex-008',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 1) (x^2026 - 1) / (x^2027 - 1)',
        choices: ['2026/2027', '1', '0', '2027/2026'],
        correctIndex: 0,
        explanation: 'តាមរូបមន្ត lim (x -> 1) (x^n - 1) / (x^m - 1) = n/m។ ដូចនេះលទ្ធផលគឺ 2026/2027។',
        externalId: 'ex-009',
      },
      {
        id: createExerciseId(),
        question: 'គណនាលីមីត lim (x -> 2) (x^2 - 4) / (x^2 - 2x)',
        choices: ['2', '4', '0', '1'],
        correctIndex: 0,
        explanation: '(x^2 - 4) / (x^2 - 2x) = (x-2)(x+2) / x(x-2) = (x+2)/x។ ជំនួស x=2 ចូល បាន 4/2 = 2។',
        externalId: 'ex-010',
      },
    ],
  },
];

const readStorageArray = <T,>(storageKey: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return fallback;
    }

    const parsedValue = JSON.parse(rawValue) as T[];
    return Array.isArray(parsedValue) ? parsedValue : fallback;
  } catch {
    return fallback;
  }
};

const writeStorageArray = <T,>(storageKey: string, value: T[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
};

export const loadAdminUsers = (): AdminUser[] => readStorageArray(USERS_STORAGE_KEY, DEFAULT_USERS);
export const saveAdminUsers = (users: AdminUser[]): void => writeStorageArray(USERS_STORAGE_KEY, users);

export const loadQuizBank = (): QuizBankItem[] => readStorageArray(QUIZZES_STORAGE_KEY, DEFAULT_QUIZZES);
export const saveQuizBank = (quizzes: QuizBankItem[]): void => writeStorageArray(QUIZZES_STORAGE_KEY, quizzes);

export const createBlankExercise = (): QuizExercise => ({
  id: createExerciseId(),
  question: '',
  choices: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
  externalId: '',
});

export const createBlankQuiz = (): QuizBankItem => ({
  chapter: '',
  lessonId: '',
  exercises: [createBlankExercise()],
});

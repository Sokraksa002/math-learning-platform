import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { getQuizHistory, type QuizHistory as QuizHistoryEntry } from "../../utils/quizHistory";

type QuizAnswer = {
  question: string;
  selected: string;
  correct: string;
  explanation: string;
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const LESSON_TITLE_KM: Record<string, string> = {
  "Lesson 1 - Complex Numbers": "មេរៀនទី 1 - ចំនួនកុំផ្លិច",
  "Lesson 2 - Conic Sections": "មេរៀនទី 2 - កោនិក",
  "Lesson 3 - Derivatives": "មេរៀនទី 3 - ដេរីវេ",
  "Lesson 4 - Differential Equations": "មេរៀនទី 4 - សមីការឌីផេរ៉ង់ស្យែល",
  "Lesson 5 - Functions": "មេរៀនទី 5 - អនុគមន៍",
  "Lesson 6 - Integrals": "មេរៀនទី 6 - អាំងតេក្រាល",
  "Lesson 7 - Limits": "មេរៀនទី 7 - លីមីត",
  "Lesson 8 - Probability": "មេរៀនទី 8 - ប្រូបាប៊ីលីតេ",
};

const LESSON_SLUG_KM: Record<string, string> = {
  "grade12-complex": "មេរៀនទី 1 - ចំនួនកុំផ្លិច",
  "grade12-conics": "មេរៀនទី 2 - កោនិក",
  "grade12-derivatives": "មេរៀនទី 3 - ដេរីវេ",
  "grade12-differential": "មេរៀនទី 4 - សមីការឌីផេរ៉ង់ស្យែល",
  "grade12-functions": "មេរៀនទី 5 - អនុគមន៍",
  "grade12-integrals": "មេរៀនទី 6 - អាំងតេក្រាល",
  "grade12-limits": "មេរៀនទី 7 - លីមីត",
  "grade12-probability": "មេរៀនទី 8 - ប្រូបាប៊ីលីតេ",
};

const localizeAttemptTitle = (value: string, locale: string): string => {
  const trimmed = value.trim();
  if (locale !== "km") return trimmed;

  if (LESSON_TITLE_KM[trimmed]) return LESSON_TITLE_KM[trimmed];
  if (LESSON_SLUG_KM[trimmed]) return LESSON_SLUG_KM[trimmed];

  const normalized = trimmed.match(/^Lesson\s*(\d+)\s*-\s*(.+)$/i);
  if (!normalized) return trimmed;

  const lessonNumber = normalized[1];
  const topic = normalized[2].trim();
  const topicKm = LESSON_TITLE_KM[`Lesson ${lessonNumber} - ${topic}`] ?? topic;
  return `មេរៀនទី ${lessonNumber} - ${topicKm.replace(/^មេរៀនទី\s*\d+\s*-\s*/, "")}`;
};

const tOr = (t: (key: string, fallback: string) => string, key: string, fallback: string) =>
  t(key, fallback);

export default function QuizHistory() {
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const quizAttempts = getQuizHistory();
  const [openAttemptId, setOpenAttemptId] = useState<string | null>(quizAttempts[0]?.date ?? null);

  const stats = useMemo(() => {
    const totalAttempts = quizAttempts.length;
    const averageScore =
      totalAttempts === 0
        ? 0
        : Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts);
    const reviewableAttempts = quizAttempts.filter((attempt) => {
      const attemptDate = new Date(attempt.date);
      const now = new Date();
      const daysDifference = Math.floor(
        (now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDifference <= 7;
    }).length;

    return { totalAttempts, averageScore, reviewableAttempts };
  }, [quizAttempts]);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)" }}>
      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #2563eb 100%)",
            color: "white",
            boxShadow: "0 18px 40px rgba(37, 99, 235, 0.22)",
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
            {tOr(t, 'pages.QuizHistory.quiz_history', locale === 'km' ? 'ប្រវត្តិកម្រងសំណួរ' : 'Quiz history')}
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={1} mb={1}>
            {tOr(t, 'pages.QuizHistory.your_quiz_attempts', locale === 'km' ? 'ការប្រឡងរបស់អ្នក' : 'Your quiz attempts')}
          </Typography>
          <Typography sx={{ maxWidth: 720, opacity: 0.9 }}>
            {tOr(
              t,
              'pages.QuizHistory.subtitle',
              locale === 'km'
                ? 'ពិនិត្យមើលការប្រឡងថ្មីៗ ប្រៀបធៀបពិន្ទុ និងបើកមើលការត្រួតពិនិត្យឡើងវិញក្នុងរយៈពេល 7 ថ្ងៃ។'
                : 'Review your recent attempts, compare scores, and reopen any review that is still within the 7-day window.'
            )}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
            <Box>
              <Typography fontWeight={800} color="#1d4ed8">
                {tOr(t, 'pages.QuizHistory.jump_back_into_quizzes', locale === 'km' ? 'ត្រឡប់ទៅកម្រងសំណួរ' : 'Jump back into quizzes')}
              </Typography>
              <Typography color="text.secondary">
                {tOr(
                  t,
                  'pages.QuizHistory.quiz_page_hint',
                  locale === 'km'
                    ? 'បើកទំព័រកម្រងសំណួរដោយផ្ទាល់ នៅពេលអ្នកចង់ហ្វឹកហាត់ម្ដងទៀត។'
                    : 'Open the quiz page directly when you want to practice again.'
                )}
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => navigate("/quiz") }>
              {tOr(t, 'pages.QuizHistory.go_to_quiz', locale === 'km' ? 'ទៅកាន់កម្រងសំណួរ' : 'Go to Quiz')}
            </Button>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {tOr(t, 'pages.QuizHistory.total_attempts', locale === 'km' ? 'ចំនួនការប្រឡងសរុប' : 'Total attempts')}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#1d4ed8">
              {stats.totalAttempts}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {tOr(t, 'pages.QuizHistory.average_score', locale === 'km' ? 'ពិន្ទុមធ្យម' : 'Average score')}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#1d4ed8">
              {stats.averageScore}%
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {tOr(t, 'pages.QuizHistory.reviewable_now', locale === 'km' ? 'អាចត្រួតពិនិត្យឥឡូវនេះ' : 'Reviewable now')}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#1d4ed8">
              {stats.reviewableAttempts}
            </Typography>
          </Paper>
        </Box>

        <Stack spacing={2}>
          {quizAttempts.length === 0 ? (
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', border: '1px solid #dbeafe' }}>
              <Typography fontWeight={800} mb={1}>
                {locale === 'km' ? 'មិនទាន់មានការប្រឡងទេ' : 'No quiz attempts yet'}
              </Typography>
              <Typography color="text.secondary" mb={2}>
                {locale === 'km'
                  ? 'បញ្ចប់កម្រងសំណួរមួយ ហើយការប្រឡងថ្មីៗរបស់អ្នកនឹងបង្ហាញនៅទីនេះ។'
                  : 'Finish a quiz and your recent attempts will appear here.'}
              </Typography>
              <Button variant="contained" onClick={() => navigate('/quiz')}>
                {locale === 'km' ? 'ចាប់ផ្តើមកម្រងសំណួរ' : 'Start a quiz'}
              </Button>
            </Paper>
          ) : null}

          {quizAttempts.map((attempt: QuizHistoryEntry) => {
            const answers = (attempt.answers ?? []) as QuizAnswer[];
            const totalQuestions = attempt.totalQuestions ?? answers.length;
            const progress = totalQuestions > 0 ? Math.round((attempt.score / totalQuestions) * 100) : attempt.score;
            const attemptDate = new Date(attempt.date);
            const now = new Date();
            const daysDifference = Math.floor(
              (now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const isReviewAvailable = daysDifference <= 7;
            const isOpen = openAttemptId === attempt.date;

            return (
              <Card key={attempt.date} sx={{ borderRadius: 3, boxShadow: "0 12px 28px rgba(37, 99, 235, 0.08)", border: "1px solid #dbeafe" }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                        <Chip
                          label={isReviewAvailable ? (locale === 'km' ? 'បើក' : 'Open') : (locale === 'km' ? 'បានចាក់សោ' : 'Locked')}
                          color={isReviewAvailable ? "success" : "default"}
                          size="small"
                        />
                        <Chip
                          label={locale === 'km' ? `ពិន្ទុ ${progress}%` : `${progress}% score`}
                          color={progress >= 80 ? "success" : progress >= 50 ? "warning" : "error"}
                          size="small"
                        />
                      </Stack>

                      <Typography variant="h6" fontWeight={800} mb={0.5}>
                        {localizeAttemptTitle(attempt.chapterTitle || attempt.quizTitle || attempt.lesson, locale)}
                      </Typography>

                      <Typography color="text.secondary" mb={1}>
                        {localizeAttemptTitle(attempt.quizTitle || attempt.lesson, locale)}
                      </Typography>

                      <Typography color="text.secondary" fontSize="0.9rem">
                        {locale === 'km' ? 'បានធ្វើនៅ' : 'Attempted on'} {formatDate(attempt.date)}
                      </Typography>
                    </Box>

                    <Box sx={{ minWidth: { xs: "100%", md: 260 } }}>
                      <Typography fontWeight={700} mb={0.5}>
                        {attempt.score}/{totalQuestions || 0}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={progress >= 80 ? "success" : progress >= 50 ? "warning" : "error"}
                        sx={{ height: 10, borderRadius: 999, mb: 1.5 }}
                      />
                      <Typography color="text.secondary" fontSize="0.9rem" mb={2}>
                        {isReviewAvailable
                          ? locale === 'km'
                            ? `នៅសល់ ${7 - daysDifference} ថ្ងៃសម្រាប់ពិនិត្យចម្លើយ`
                            : `${7 - daysDifference} day${7 - daysDifference !== 1 ? "s" : ""} left to review answers`
                          : locale === 'km'
                            ? 'ការពិនិត្យចម្លើយផុតកំណត់ក្រោយ 7 ថ្ងៃ'
                            : 'Answer review expired after 7 days'}
                      </Typography>
                      <Stack spacing={1.2}>
                        <Button
                          variant={isOpen ? "contained" : "outlined"}
                          onClick={() => setOpenAttemptId(isOpen ? null : attempt.date)}
                        >
                          {isOpen ? (locale === 'km' ? 'លាក់' : 'Hide') : (locale === 'km' ? 'បើក' : 'Open')}
                        </Button>
                        <Button variant="text" onClick={() => navigate("/quiz")}>
                          {locale === 'km' ? 'បើកកម្រងសំណួរ' : 'Open Quiz'}
                        </Button>
                      </Stack>
                    </Box>
                  </Box>

                  {isOpen ? (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      {isReviewAvailable ? (
                        <Stack spacing={1.5}>
                          {answers.map((answer, index) => {
                            const isCorrect = answer.selected === answer.correct;

                            return (
                              <Paper
                                key={`${attempt.date}-${index}`}
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isCorrect ? "#f8fffb" : "#fff7f7",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    mb: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography fontWeight={700}>
                                    {locale === 'km' ? `សំណួរ ${index + 1}` : `Question ${index + 1}`}
                                  </Typography>
                                  <Chip
                                    label={isCorrect ? (locale === 'km' ? 'ត្រឹមត្រូវ' : 'Correct') : (locale === 'km' ? 'ខុស' : 'Wrong')}
                                    color={isCorrect ? "success" : "error"}
                                    size="small"
                                  />
                                </Box>
                                <Typography mb={1}>{answer.question}</Typography>
                                <Typography>
                                  {locale === 'km' ? 'ចម្លើយរបស់អ្នក៖' : 'Your answer:'} <strong>{answer.selected}</strong>
                                </Typography>
                                <Typography>
                                  {locale === 'km' ? 'ចម្លើយត្រឹមត្រូវ៖' : 'Correct answer:'} <strong>{answer.correct}</strong>
                                </Typography>
                                <Typography fontSize="0.9rem" color="text.secondary" mt={1}>
                                  {answer.explanation}
                                </Typography>
                              </Paper>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f8f9fa",
                            textAlign: "center",
                          }}
                        >
                          <Typography fontWeight={700} mb={0.5}>
                            {locale === 'km' ? 'ការពិនិត្យផុតកំណត់' : 'Review expired'}
                          </Typography>
                          <Typography color="text.secondary" fontSize="0.9rem">
                            {locale === 'km'
                              ? 'ធ្វើកម្រងសំណួរម្ដងទៀត ដើម្បីពិនិត្យចម្លើយភ្លាមៗបន្ទាប់ពីបញ្ចប់។'
                              : 'Retake the quiz to review answers immediately after completion.'}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

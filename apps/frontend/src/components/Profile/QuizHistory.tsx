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

export default function QuizHistory() {
  const navigate = useNavigate();
  const { t } = useLocale();
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
            {t('pages.QuizHistory.quiz_history', 'Quiz history')}
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={1} mb={1}>
            {t('pages.QuizHistory.your_quiz_attempts', 'Your quiz attempts')}
          </Typography>
          <Typography sx={{ maxWidth: 720, opacity: 0.9 }}>
            {t('pages.QuizHistory.subtitle', 'Review your recent attempts, compare scores, and reopen any review that is still within the 7-day window.')}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
            <Box>
              <Typography fontWeight={800} color="#1d4ed8">
                {t('pages.QuizHistory.jump_back_into_quizzes', 'Jump back into quizzes')}
              </Typography>
              <Typography color="text.secondary">
                {t('pages.QuizHistory.quiz_page_hint', 'Open the quiz page directly when you want to practice again.')}
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => navigate("/quiz") }>
              {t('pages.QuizHistory.go_to_quiz', 'Go to Quiz')}
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
              {t('pages.QuizHistory.total_attempts', 'Total attempts')}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#1d4ed8">
              {stats.totalAttempts}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {t('pages.QuizHistory.average_score', 'Average score')}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="#1d4ed8">
              {stats.averageScore}%
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 10px 24px rgba(37, 99, 235, 0.06)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {t('pages.QuizHistory.reviewable_now', 'Reviewable now')}
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
                No quiz attempts yet
              </Typography>
              <Typography color="text.secondary" mb={2}>
                Finish a quiz and your recent attempts will appear here.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/quiz')}>
                Start a quiz
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
                        <Chip label={isReviewAvailable ? "Open" : "Locked"} color={isReviewAvailable ? "success" : "default"} size="small" />
                        <Chip
                          label={`${progress}% score`}
                          color={progress >= 80 ? "success" : progress >= 50 ? "warning" : "error"}
                          size="small"
                        />
                      </Stack>

                      <Typography variant="h6" fontWeight={800} mb={0.5}>
                        {attempt.chapterTitle || attempt.quizTitle || attempt.lesson}
                      </Typography>

                      <Typography color="text.secondary" mb={1}>
                        {attempt.quizTitle || attempt.lesson}
                      </Typography>

                      <Typography color="text.secondary" fontSize="0.9rem">
                        Attempted on {formatDate(attempt.date)}
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
                          ? `${7 - daysDifference} day${7 - daysDifference !== 1 ? "s" : ""} left to review answers`
                          : "Answer review expired after 7 days"}
                      </Typography>
                      <Stack spacing={1.2}>
                        <Button
                          variant={isOpen ? "contained" : "outlined"}
                          onClick={() => setOpenAttemptId(isOpen ? null : attempt.date)}
                        >
                          {isOpen ? "Hide" : "Open"}
                        </Button>
                        <Button variant="text" onClick={() => navigate("/quiz")}>
                          Open Quiz
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
                                    Question {index + 1}
                                  </Typography>
                                  <Chip
                                    label={isCorrect ? "Correct" : "Wrong"}
                                    color={isCorrect ? "success" : "error"}
                                    size="small"
                                  />
                                </Box>
                                <Typography mb={1}>{answer.question}</Typography>
                                <Typography>
                                  Your answer: <strong>{answer.selected}</strong>
                                </Typography>
                                <Typography>
                                  Correct answer: <strong>{answer.correct}</strong>
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
                            Review expired
                          </Typography>
                          <Typography color="text.secondary" fontSize="0.9rem">
                            Retake the quiz to review answers immediately after completion.
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

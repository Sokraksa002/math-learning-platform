import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Header from "../Home/Header";

type QuizAnswer = {
  question: string;
  selected: string;
  correct: string;
  explanation: string;
};

type QuizAttempt = {
  id: string;
  quizTitle: string;
  chapterTitle: string;
  score: number;
  totalQuestions: number;
  attemptDate: string;
  answers: QuizAnswer[];
};

const buildAttemptDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const quizAttempts: QuizAttempt[] = [
  {
    id: "attempt-1",
    quizTitle: "Algebra Basics",
    chapterTitle: "Chapter 1: Numbers",
    score: 8,
    totalQuestions: 10,
    attemptDate: buildAttemptDate(2),
    answers: [
      {
        question: "1 + 1 = ?",
        selected: "2",
        correct: "2",
        explanation: "Adding 1 and 1 results in 2.",
      },
      {
        question: "5 x 2 = ?",
        selected: "10",
        correct: "10",
        explanation: "Multiplication of 5 and 2 gives 10.",
      },
      {
        question: "10 - 3 = ?",
        selected: "6",
        correct: "7",
        explanation: "Subtraction removes 3 from 10, leaving 7.",
      },
      {
        question: "12 / 4 = ?",
        selected: "3",
        correct: "3",
        explanation: "Division of 12 by 4 equals 3.",
      },
      {
        question: "2^3 = ?",
        selected: "8",
        correct: "8",
        explanation: "2 raised to the power of 3 is 8.",
      },
      {
        question: "sqrt(16) = ?",
        selected: "4",
        correct: "4",
        explanation: "The square root of 16 is 4.",
      },
      {
        question: "7 + 8 = ?",
        selected: "15",
        correct: "15",
        explanation: "Adding 7 and 8 results in 15.",
      },
      {
        question: "20 - 5 = ?",
        selected: "15",
        correct: "15",
        explanation: "Subtracting 5 from 20 gives 15.",
      },
      {
        question: "9 x 3 = ?",
        selected: "24",
        correct: "27",
        explanation: "Nine groups of three make 27.",
      },
      {
        question: "100 / 5 = ?",
        selected: "20",
        correct: "20",
        explanation: "Division of 100 by 5 equals 20.",
      },
    ],
  },
  {
    id: "attempt-2",
    quizTitle: "Fractions Practice",
    chapterTitle: "Chapter 2: Fractions",
    score: 6,
    totalQuestions: 10,
    attemptDate: buildAttemptDate(5),
    answers: [
      {
        question: "1/2 + 1/2 = ?",
        selected: "1",
        correct: "1",
        explanation: "Two halves make one whole.",
      },
      {
        question: "3/4 - 1/4 = ?",
        selected: "1/2",
        correct: "1/2",
        explanation: "Subtracting one quarter from three quarters leaves one half.",
      },
      {
        question: "2/3 + 1/3 = ?",
        selected: "1",
        correct: "1",
        explanation: "Fractions with the same denominator can be combined directly.",
      },
      {
        question: "5/6 - 1/6 = ?",
        selected: "4/6",
        correct: "2/3",
        explanation: "Five sixths minus one sixth equals four sixths, which simplifies to two thirds.",
      },
      {
        question: "1/4 of 8 = ?",
        selected: "2",
        correct: "2",
        explanation: "A quarter of 8 is 2.",
      },
      {
        question: "3/5 of 10 = ?",
        selected: "6",
        correct: "6",
        explanation: "Three fifths of ten is six.",
      },
      {
        question: "Which is larger: 2/3 or 3/5?",
        selected: "2/3",
        correct: "2/3",
        explanation: "Two thirds is greater than three fifths.",
      },
      {
        question: "1/8 + 3/8 = ?",
        selected: "1/2",
        correct: "1/2",
        explanation: "Four eighths simplify to one half.",
      },
      {
        question: "4/7 of 14 = ?",
        selected: "8",
        correct: "8",
        explanation: "Four sevenths of fourteen is eight.",
      },
      {
        question: "2/5 + 2/5 = ?",
        selected: "4/5",
        correct: "4/5",
        explanation: "Add the numerators and keep the denominator.",
      },
    ],
  },
  {
    id: "attempt-3",
    quizTitle: "Geometry Warmup",
    chapterTitle: "Chapter 4: Shapes",
    score: 9,
    totalQuestions: 10,
    attemptDate: buildAttemptDate(11),
    answers: [
      {
        question: "How many sides does a triangle have?",
        selected: "3",
        correct: "3",
        explanation: "A triangle always has three sides.",
      },
      {
        question: "How many angles does a square have?",
        selected: "4",
        correct: "4",
        explanation: "A square has four right angles.",
      },
      {
        question: "What is the perimeter of a 2x2 square?",
        selected: "8",
        correct: "8",
        explanation: "Each side is 2, so the perimeter is 2 + 2 + 2 + 2.",
      },
      {
        question: "A circle has how many corners?",
        selected: "0",
        correct: "0",
        explanation: "A circle has no corners.",
      },
      {
        question: "How many vertices does a cube have?",
        selected: "8",
        correct: "8",
        explanation: "A cube has eight vertices.",
      },
      {
        question: "A rectangle has opposite sides that are...",
        selected: "Equal",
        correct: "Equal",
        explanation: "Opposite sides of a rectangle are equal and parallel.",
      },
      {
        question: "How many faces does a cube have?",
        selected: "6",
        correct: "6",
        explanation: "A cube has six faces.",
      },
      {
        question: "What shape has 5 sides?",
        selected: "Pentagon",
        correct: "Pentagon",
        explanation: "A pentagon has five sides.",
      },
      {
        question: "How many edges does a cube have?",
        selected: "12",
        correct: "12",
        explanation: "A cube has twelve edges.",
      },
      {
        question: "What do we call a 3D shape with 6 equal square faces?",
        selected: "Cube",
        correct: "Cube",
        explanation: "That is the definition of a cube.",
      },
    ],
  },
];

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
  const [openAttemptId, setOpenAttemptId] = useState<string | null>(
    quizAttempts[0]?.id ?? null
  );

  const stats = useMemo(() => {
    const totalAttempts = quizAttempts.length;
    const averageScore = Math.round(
      quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts
    );
    const reviewableAttempts = quizAttempts.filter((attempt) => {
      const attemptDate = new Date(attempt.attemptDate);
      const now = new Date();
      const daysDifference = Math.floor(
        (now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDifference <= 7;
    }).length;

    return { totalAttempts, averageScore, reviewableAttempts };
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)",
        }}
      >
        <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, md: 3 }, py: 4 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 3,
              borderRadius: 4,
                background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #2563eb 100%)",
              color: "white",
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
              Quiz history
            </Typography>
            <Typography variant="h4" fontWeight={800} mt={1} mb={1}>
              Your quiz attempts
            </Typography>
            <Typography sx={{ maxWidth: 720, opacity: 0.9 }}>
              Review your recent attempts, compare scores, and reopen any review that is still
              within the 7-day window.
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
              <Box>
                <Typography fontWeight={800} color="#0f172a">
                  Jump back into quizzes
                </Typography>
                <Typography color="text.secondary">
                  Open the quiz page directly when you want to practice again.
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => navigate("/quiz")}>
                Go to Quiz
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
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                Total attempts
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {stats.totalAttempts}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                Average score
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {stats.averageScore}%
              </Typography>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                Reviewable now
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {stats.reviewableAttempts}
              </Typography>
            </Paper>
          </Box>

          <Stack spacing={2}>
            {quizAttempts.map((attempt) => {
              const progress = Math.round((attempt.score / attempt.totalQuestions) * 100);
              const attemptDate = new Date(attempt.attemptDate);
              const now = new Date();
              const daysDifference = Math.floor(
                (now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              const isReviewAvailable = daysDifference <= 7;
              const isOpen = openAttemptId === attempt.id;

              return (
                <Card key={attempt.id} sx={{ borderRadius: 3, boxShadow: 2 }}>
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
                            label={isReviewAvailable ? "Review available" : "Review expired"}
                            color={isReviewAvailable ? "success" : "default"}
                            size="small"
                          />
                          <Chip
                            label={`${progress}% score`}
                            color={progress >= 80 ? "success" : progress >= 50 ? "warning" : "error"}
                            size="small"
                          />
                        </Stack>

                        <Typography variant="h6" fontWeight={800} mb={0.5}>
                          {attempt.quizTitle}
                        </Typography>

                        <Typography color="text.secondary" mb={1}>
                          {attempt.chapterTitle}
                        </Typography>

                        <Typography color="text.secondary" fontSize="0.9rem">
                          Attempted on {formatDate(attempt.attemptDate)}
                        </Typography>
                      </Box>

                      <Box sx={{ minWidth: { xs: "100%", md: 260 } }}>
                        <Typography fontWeight={700} mb={0.5}>
                          {attempt.score}/{attempt.totalQuestions}
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
                            onClick={() => setOpenAttemptId(isOpen ? null : attempt.id)}
                          >
                            {isOpen ? "Hide answers" : "View answers"}
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
                            {attempt.answers.map((answer, index) => {
                              const isCorrect = answer.selected === answer.correct;

                              return (
                                <Paper
                                  key={`${attempt.id}-${index}`}
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
    </>
  );
}

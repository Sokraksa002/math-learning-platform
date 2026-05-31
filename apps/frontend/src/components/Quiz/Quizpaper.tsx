import {
  Box,
  Button,
  Container,
  Typography,
  LinearProgress,
  CircularProgress,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import {
  startQuiz,
  submitQuiz,
  getCertificateEligibility,
} from "../../utils/api";

import type {
  QuizSession,
  QuizAnswer,
  QuizResult,
} from "../../utils/api";

import { saveQuizHistory } from "../../utils/quizHistory";
import { logout } from "../../utils/auth";

export default function QuizPaper() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const [lessonTitle, setLessonTitle] = useState("Quiz");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ✅ CERTIFICATE STATUS */
  const [isRequired, setIsRequired] = useState(false);

  function renderMathText(text: string) {
    try {
      return <InlineMath math={text} />;
    } catch {
      return text;
    }
  }

  function normalizeLessonTitle(value: string) {
    return value
      .split(' - ')
      .pop()
      ?.trim()
      .toLowerCase() ?? value.trim().toLowerCase();
  }

  /* ✅ LOAD QUIZ */
  useEffect(() => {
    if (!lessonId) return;

    const load = async () => {
      try {
        setLoading(true);

        const quizData = await startQuiz(lessonId);

        setLessonTitle(quizData.lessonTitle);

        setSession({
          sessionId: quizData.sessionId,
          lessonId: quizData.lessonId,
          lessonTitle: quizData.lessonTitle,
          items: quizData.items,
        });
      } catch (err) {
        console.error(err);

        if (err instanceof Error && err.message === "Unauthorized") {
          logout();
          navigate("/login");
          return;
        }

        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [lessonId, navigate]);

  /* ✅ CHECK IF THIS QUIZ IS REQUIRED */
  useEffect(() => {
    const check = async () => {
      try {
        const data = await getCertificateEligibility();
        const currentLessonTitle = normalizeLessonTitle(lessonTitle);
        const certificateData = data as typeof data & {
          missingQuizLessons?: { title: string }[];
        };

        const missing = certificateData.missingQuizLessons?.some(
          (lesson) => normalizeLessonTitle(lesson.title) === currentLessonTitle
        );

        setIsRequired(Boolean(missing));
      } catch (err) {
        console.error(err);
      }
    };

    if (lessonId && lessonTitle) check();
  }, [lessonId, lessonTitle]);

  /* ✅ SELECT */
  const handleSelect = (choice: string) => {
    if (selected || !session) return;

    const question = session.items[currentIndex];

    const nextAnswers = [
      ...answers,
      {
        exerciseId: question.exerciseId,
        selectedChoice: choice,
      },
    ];

    setSelected(choice);
    setShowAnswer(true);
    setAnswers(nextAnswers);

    setTimeout(() => {
      if (currentIndex === session.items.length - 1) {
        handleSubmit(nextAnswers);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setShowAnswer(false);
      }
    }, 1500);
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (submitted: QuizAnswer[]) => {
    if (!session) return;

    const res = await submitQuiz(
      session.sessionId,
      submitted,
      lessonId ?? session.lessonId
    );

    setResult(res);
    setFinished(true);

    saveQuizHistory({
      lesson: lessonTitle,
      lessonId: lessonId ?? session.lessonId,
      quizTitle: lessonTitle,
      chapterTitle: lessonTitle,
      score: res.score,
      totalQuestions: res.total,
      date: new Date().toISOString(),
      answers: session.items.map((item, i) => ({
        question: item.question ?? '',
        selected: submitted[i]?.selectedChoice ?? "",
        correct: item.correctAnswer ?? '',
        explanation: item.solutionKm ?? '',
      })),
    });
  };

  /* ✅ STATES */
  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!session) return null;

  const question = session.items[currentIndex];
  const total = session.items.length;
  const progress = ((currentIndex + 1) / total) * 100;

  /* ✅ RESULT SCREEN */
  if (finished) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4">🎉 Quiz Completed</Typography>

          <Typography variant="h2" sx={{ mt: 2 }}>
            {result?.score}%
          </Typography>

          <Typography>
            {result?.correct}/{result?.total} correct
          </Typography>

          {/* ✅ FEEDBACK */}
          <Typography mt={2}>
            {result?.score !== undefined && result.score >= 80
              ? "✅ This quiz counts for your certificate"
              : "❌ Score too low. Retry to unlock certificate"}
          </Typography>

          <Stack mt={4} spacing={2}>
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/quiz/paper/${lessonId}`)
              }
            >
              Retry Quiz 🔁
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/certificate")}
            >
              Back to Certificate
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  /* ✅ MAIN UI */
  return (
    <Box sx={{ minHeight: "100vh", py: 6, background: "#f4f6fb" }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>

          <Typography variant="h5">{lessonTitle}</Typography>

          <Typography color="text.secondary">
            Question {currentIndex + 1} / {total}
          </Typography>

          {/* ✅ STATUS */}
          <Box mt={2}>
            {isRequired ? (
              <Chip label="❌ Required for Certificate" color="warning" />
            ) : (
              <Chip label="✅ Already Completed" color="success" />
            )}
          </Box>

          <Chip label={`${Math.round(progress)}%`} sx={{ mt: 2 }} />
          <LinearProgress value={progress} sx={{ mt: 2 }} />

          {/* QUESTION */}
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography>
                {renderMathText(question.question ?? '')}
            </Typography>
          </Paper>

          {/* OPTIONS */}
          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            {Object.entries(question.choices ?? {}).map(([key, value]) => {
              const isCorrect = key === question.correctAnswer;
              const isSelected = selected === key;

              let bg = "#fff";
              if (showAnswer) {
                if (isCorrect) bg = "#e8f5e9";
                else if (isSelected) bg = "#ffe4e6";
              }

              return (
                <Box
                  key={key}
                  onClick={() => handleSelect(key)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: selected ? "default" : "pointer",
                    background: bg,
                  }}
                >
                  {key}. {renderMathText(value)}
                </Box>
              );
            })}
          </Box>

          {/* EXPLANATION */}
          {showAnswer && (
            <Box mt={3} p={3} sx={{ bgcolor: "#eef2ff" }}>
              <Typography fontWeight={700}>
                ✅ Correct Answer: {question.correctAnswer}
              </Typography>

              <Typography mt={1}>
                📘 {renderMathText(question.solutionKm || "")}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
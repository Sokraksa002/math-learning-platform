import { Box, Button, Container, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { startQuiz, submitQuiz } from "../../utils/api";
import type { QuizSession, QuizAnswer, QuizResult } from "../../utils/api";

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

  // ✅ Load quiz
  useEffect(() => {
    if (!lessonId) return;

    const load = async () => {
      try {
        const data = await startQuiz(lessonId);
        setSession(data);
      } catch (err) {
        console.error("Error loading quiz:", err);
      }
    };

    load();
  }, [lessonId]);

  if (!session) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography>Loading quiz...</Typography>
      </Container>
    );
  }

  const question = session.items[currentIndex];
  const total = session.items.length;

  // ✅ Handle answer
  const handleSelect = (choice: string) => {
    if (selected) return;

    setSelected(choice);
    setShowAnswer(true);

    setAnswers((prev) => [
      ...prev,
      {
        exerciseId: question.exerciseId,
        selectedChoice: choice,
      },
    ]);

    setTimeout(() => {
      if (currentIndex === total - 1) {
        handleSubmit();
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setShowAnswer(false);
      }
    }, 2000);
  };

  // ✅ Submit quiz
  const handleSubmit = async () => {
    if (!session) return;

    try {
      const res = await submitQuiz(session.id, answers);
      setResult(res);
      setFinished(true);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F4F6FB", py: 8 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 4,
            p: 5,
            boxShadow: "0 12px 25px rgba(0,0,0,0.05)",
          }}
        >
          {!finished ? (
            <>
              {/* HEADER */}
              <Typography fontWeight={700}>
                Question {currentIndex + 1} / {total}
              </Typography>

              {/* ✅ QUESTION */}
              <Typography sx={{ mt: 2 }}>
                {question.exercise.questionKm}
              </Typography>

              {/* ✅ OPTIONS */}
              <Box mt={3} display="flex" flexDirection="column" gap={2}>
                {["A", "B", "C", "D"].map((opt) => {
                  const correct = question.exercise.correctAnswer;
                  const isCorrect = opt === correct;
                  const isSelected = selected === opt;

                  let bg = "#fff";
                  let border = "#ccc";

                  if (showAnswer) {
                    if (isCorrect) {
                      bg = "#E8F5E9";
                      border = "green";
                    } else if (isSelected) {
                      bg = "#FFF3E0";
                      border = "orange";
                    }
                  }

                  return (
                    <Box
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      sx={{
                        border: `2px solid ${border}`,
                        borderRadius: 2,
                        p: 2,
                        cursor: selected ? "default" : "pointer",
                        backgroundColor: bg,
                      }}
                    >
                      {opt}
                    </Box>
                  );
                })}
              </Box>

              {/* ✅ EXPLANATION */}
              {showAnswer && (
                <Box mt={3} p={2} bgcolor="#F9FAFB" borderRadius={2}>
                  <Typography fontWeight={600}>Explanation:</Typography>
                  <Typography>
                    {question.exercise.solutionKm || "No explanation available"}
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box textAlign="center">
              <Typography variant="h5">🎉 Finished</Typography>

              <Typography mt={2}>
                Score: {result?.score} / {result?.total}
              </Typography>

              {/* ✅ WRONG ANSWERS */}
              {result?.wrongAnswers.map((w, i) => (
                <Box key={i} mt={2} p={2} bgcolor="#FFF3E0">
                  <Typography>{w.question}</Typography>
                  <Typography>Your: {w.selected}</Typography>
                  <Typography>Correct: {w.correctAnswer}</Typography>
                  <Typography>{w.solutionKm}</Typography>
                </Box>
              ))}

              <Button sx={{ mt: 3 }} onClick={() => navigate("/dashboard")}>
                Back
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";
import QuizHeader from "../components/Quiz/QuizHeader"; // ✅ NEW HEADER
import { getQuizLessons, type QuizLessonSummary } from "../utils/api";


const palette = ["#4F9CF9", "#6BB6FF", "#3D86E8", "#8EC5FF", "#2563EB", "#0EA5E9"];

export default function Quiz() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [lessons, setLessons] = useState<QuizLessonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getQuizLessons()
      .then((rows) => {
        if (!mounted) return;
        setLessons(rows);
      })
      .catch((err) => {
        console.error("Failed to load quiz lessons", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const quizLessons = useMemo(
    () =>
      [...lessons]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((lesson, index) => ({
          id: lesson.lessonId,
          title: lesson.title,
          subject: lesson.subject,
          color: palette[index % palette.length],
          exerciseCount: lesson.exerciseCount,
        })),
    [lessons],
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8fbff", // ✅ cleaner background
      }}
    >
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* ✅ DASHBOARD HEADER */}
        <QuizHeader navigate={navigate} />

        {/* ✅ TITLE */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          {t("pages.Quiz.pick_a_lesson", "Pick a lesson")}
        </Typography>

        {/* ✅ LESSON LIST */}
        {loading ? (
          <Stack spacing={2}>
            <Typography color="text.secondary">Loading quiz lessons...</Typography>
          </Stack>
        ) : quizLessons.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Typography fontWeight={700} mb={1}>
              No quiz lessons available
            </Typography>
            <Typography color="text.secondary">
              Publish lessons with exercises in the backend to make them appear here.
            </Typography>
          </Paper>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
          {quizLessons.map((lesson) => (
            <Card
              key={lesson.id}
              onClick={() => navigate(`/quiz/paper/${lesson.id}`)}
              sx={{
                borderLeft: `5px solid ${lesson.color}`,
                borderRadius: 2,
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)", // ✅ softer
                cursor: "pointer",
                transition: "all 0.2s ease",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* ✅ LEFT */}
                <Box>
                  <Typography fontWeight={600}>
                    {lesson.title}
                  </Typography>

                  <Typography
                    fontSize={13}
                    color="text.secondary"
                  >
                    {lesson.subject} • {lesson.exerciseCount} questions
                  </Typography>
                </Box>

                {/* ✅ RIGHT */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quiz/paper/${lesson.id}`);
                  }}
                  sx={{ minWidth: "auto" }}
                >
                  →
                </Button>
              </CardContent>
            </Card>
          ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

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

const SUBJECT_TITLE_MAP: Record<string, { en: string; km: string }> = {
  "grade12-complex": {
    en: "Lesson 1 - Complex Numbers",
    km: "មេរៀនទី 1 - ចំនួនកុំផ្លិច",
  },
  "grade12-conics": {
    en: "Lesson 2 - Conic Sections",
    km: "មេរៀនទី 2 - កោនិក",
  },
  "grade12-derivatives": {
    en: "Lesson 3 - Derivatives",
    km: "មេរៀនទី 3 - ដេរីវេ",
  },
  "grade12-differential": {
    en: "Lesson 4 - Differential Equations",
    km: "មេរៀនទី 4 - សមីការឌីផេរ៉ង់ស្យែល",
  },
  "grade12-functions": {
    en: "Lesson 5 - Functions",
    km: "មេរៀនទី 5 - អនុគមន៍",
  },
  "grade12-integrals": {
    en: "Lesson 6 - Integrals",
    km: "មេរៀនទី 6 - អាំងតេក្រាល",
  },
  "grade12-limits": {
    en: "Lesson 7 - Limits",
    km: "មេរៀនទី 7 - លីមីត",
  },
  "grade12-probability": {
    en: "Lesson 8 - Probability",
    km: "មេរៀនទី 8 - ប្រូបាប៊ីលីតេ",
  },
};

const getTitleFromSubject = (subject: string, fallbackTitle: string, locale: string): string => {
  const mapped = SUBJECT_TITLE_MAP[subject];
  if (!mapped) return fallbackTitle;
  return locale === "km" ? mapped.km : mapped.en;
};


const palette = ["#4F9CF9", "#6BB6FF", "#3D86E8", "#8EC5FF", "#2563EB", "#0EA5E9"];

export default function Quiz() {
  const navigate = useNavigate();
  const { t, locale } = useLocale();
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
          displayTitle: getTitleFromSubject(lesson.subject, lesson.title, locale),
          subject: lesson.subject,
          color: palette[index % palette.length],
          exerciseCount: lesson.exerciseCount,
        })),
    [lessons, locale],
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
           {t("pages.Quiz.pick_a_lesson", "ជ្រើសរើសមេរៀន")}
        </Typography>

        {/* ✅ LESSON LIST */}
        {loading ? (
          <Stack spacing={2}>
              <Typography color="text.secondary">កំពុងផ្ទុកកម្រងសំណួរ...</Typography>
          </Stack>
        ) : quizLessons.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Typography fontWeight={700} mb={1}>
                មិនមានមេរៀនកម្រងសំណួរទេ
            </Typography>
            <Typography color="text.secondary">
                បោះផ្សាយមេរៀនដែលមានលំហាត់នៅ backend ដើម្បីឱ្យបង្ហាញទីនេះ។
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
                    {lesson.displayTitle}
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

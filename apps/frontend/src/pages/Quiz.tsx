import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";
import QuizHeader from "../components/Quiz/QuizHeader"; // ✅ NEW HEADER

/* ✅ LESSON LIST (STATIC FOR NOW) */
const quizLessons = [
  {
    id: "grade12-complex-lesson1",
    title: "Lesson 1",
    subject: "Complex Numbers",
    color: "#4F9CF9",
  },
  {
    id: "grade12-limits-lesson2",
    title: "Lesson 2",
    subject: "Limits",
    color: "#6BB6FF",
  },
  {
    id: "grade12-derivatives-lesson3",
    title: "Lesson 3",
    subject: "Derivatives",
    color: "#3D86E8",
  },
  {
    id: "grade12-integrals-lesson4",
    title: "Lesson 4",
    subject: "Integrals",
    color: "#8EC5FF",
  },
  {
    id: "grade12-derivatives-lesson5",
    title: "Lesson 5",
    subject: "Derivatives",
    color: "#3D86E8",
  },
  {
    id: "grade12-functions-lesson6",
    title: "Lesson 6",
    subject: "Functions",
    color: "#6BB6FF",
  },
  {
    id: "grade12-conics-lesson7",
    title: "Lesson 7",
    subject: "Conic Sections",
    color: "#6BB6FF",
  },
  {
    id: "grade12-probability-lesson8",
    title: "Lesson 8",
    subject: "Probability",
    color: "#6BB6FF",
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const { t } = useLocale();

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
                    {lesson.subject}
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
      </Container>
    </Box>
  );
}

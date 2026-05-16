import { Box, Button, Container, Paper, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const COMPLETED_LESSON_STORAGE_KEY = 'math-learning-completed-lessons';

const areAllLessonsCompleted = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const rawValue = window.localStorage.getItem(COMPLETED_LESSON_STORAGE_KEY);
    const completedLessonIds = rawValue ? JSON.parse(rawValue) : [];

    return [101, 102, 201, 202].every((lessonId) => Array.isArray(completedLessonIds) && completedLessonIds.includes(lessonId));
  } catch {
    return false;
  }
};

export default function Certificate() {
  const navigate = useNavigate();
  const allLessonsCompleted = areAllLessonsCompleted();

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f3f7ff 0%, #ffffff 100%)", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 4,
            color: "white",
            background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #2563eb 100%)",
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.85 }}>
            Review center
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            Chapter review history
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 720 }}>
            Open a chapter to review the quiz answers. Chapters stay locked until the quiz score is at
            least 80% and all lessons are complete.
          </Typography>
        </Paper>

        {[
          { chapterId: "1", score: 90, title: "Chapter 1" },
          { chapterId: "2", score: 60, title: "Chapter 2" },
          { chapterId: "3", score: 85, title: "Chapter 3" },
          { chapterId: "4", score: 70, title: "Chapter 4" },
        ].map((item) => {
          const unlocked = item.score >= 80 && allLessonsCompleted;

          return (
            <Paper
              key={item.chapterId}
              sx={{
                p: { xs: 2.5, md: 3 },
                mb: 3,
                borderRadius: 4,
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                opacity: unlocked ? 1 : 0.6,
                border: "1px solid #e2e8f0",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                  <Chip label={unlocked ? "Open" : "Locked"} color={unlocked ? "success" : "default"} size="small" />
                  <Chip label={`${item.score}% score`} color={item.score >= 80 ? "success" : "warning"} size="small" />
                </Stack>

                <Typography fontWeight={900} color="#0f172a">
                  {item.title}
                </Typography>
                <Typography sx={{ mt: 0.5, color: "text.secondary" }}>
                  {unlocked ? "Open to review the answer details for this chapter." : "Locked until all lessons are completed and the score reaches 80%."}
                </Typography>
              </Box>

              {unlocked ? (
                <Button
                  onClick={() => navigate("/quiz-history")}
                  sx={{
                    background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                    color: "#fff",
                    px: 3,
                    borderRadius: 999,
                    minWidth: 120,
                  }}
                >
                  Open
                </Button>
              ) : (
                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    backgroundColor: "#eef2ff",
                    borderRadius: 999,
                    color: "#64748b",
                  }}
                >
                  Locked
                </Box>
              )}
            </Paper>
          );
        })}

        <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
            <Box>
              <Typography fontWeight={800} color="#0f172a">
                Need the answer review?
              </Typography>
              <Typography color="text.secondary">
                The quiz history page contains the full answer breakdown for each attempt.
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => navigate("/quiz-history")}>Open Quiz History</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
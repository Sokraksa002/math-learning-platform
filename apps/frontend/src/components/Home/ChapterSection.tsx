import {
  Box,
  Container,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import { useLocale } from "../../hooks/useLocale";
import { useEffect, useState } from "react";
import { getAllLessons } from "../../utils/api";
import type { Lesson } from "../../utils/api"; // ✅ FIX
import LessonCard from "../Lessons/LessonCard";

const ChapterSection: React.FC = () => {
  const { t } = useLocale();

  const [lessons, setLessons] = useState<Lesson[]>([]); // ✅ FIX
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getAllLessons()
      .then((data) => {
        if (!mounted) return;
        setLessons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load lessons", err);
        setLessons([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ SAFE localStorage
  let completedIds: string[] = [];

  try {
    const raw = localStorage.getItem("completedLessonIds");
    completedIds = raw ? JSON.parse(raw) : [];
  } catch {
    completedIds = [];
  }

  const total = lessons.length;

  const completedCount = lessons.filter((l) =>
    completedIds.includes(String(l.id))
  ).length;

  const percent =
    total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const firstIncompleteIndex = lessons.findIndex(
    (l) => !completedIds.includes(String(l.id))
  );

  return (
    <Box sx={{ py: 6, mb: 5 }}>
      <Container maxWidth="md">
        {/* TITLE */}
        <Typography
          sx={{
            fontWeight: 800,
            color: "#1F2937",
            mb: 2,
            fontSize: 28,
          }}
        >
          {t(
            "components.Home.ChapterSection.lessons",
            "Lessons"
          )}
        </Typography>

        {/* SUBTITLE */}
        <Typography sx={{ color: "#6B7280", fontSize: 13 }}>
          {t(
            "components.Home.ChapterSection.available_lessons",
            "Available lessons"
          )}
        </Typography>

        {/* CONTENT */}
        <Box mt={2}>
          {loading ? (
            <Typography>Loading lessons...</Typography>
          ) : lessons.length === 0 ? (
            <Typography>No lessons available.</Typography>
          ) : (
            <>
              {/* PROGRESS */}
              <Box sx={{ width: "100%", mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={percent}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              </Box>

              {/* GRID */}
              <Grid container spacing={3}>
                {lessons.map((lesson, idx) => {
                  let status:
                    | "completed"
                    | "current"
                    | "locked"
                    | "default" = "default";

                  const idStr = String(lesson.id);

                  if (completedIds.includes(idStr)) {
                    status = "completed";
                  } else if (idx === firstIncompleteIndex) {
                    status = "current";
                  } else if (idx > firstIncompleteIndex) {
                    status = "locked";
                  }

                  return (
                    <Grid item xs={12} md={6} key={idStr}>
                      <LessonCard
                        lesson={lesson} // ✅ type-safe now
                        status={status}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ChapterSection;
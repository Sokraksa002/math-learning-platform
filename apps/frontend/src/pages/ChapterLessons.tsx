import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

import { getAllLessons } from "../utils/api";
import type { Lesson } from "../utils/api";

import LessonCard from "../components/Lessons/LessonCard";
import { useLocale } from "../hooks/useLocale";

import { getCompletedLessonIds } from "../utils/learningProgress";

export default function ChapterLessons() {
  const { chapterId } = useParams();
  const { t } = useLocale();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ LOAD LESSONS
   */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!chapterId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAllLessons();

        if (!mounted) return;

        const filtered = Array.isArray(data)
          ? data.filter(
              (lesson) => String(lesson.chapterId) === String(chapterId)
            )
          : [];

        setLessons(filtered);

      } catch (err: unknown) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : t("errors.failed_fetch", "Failed to load lessons")
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [chapterId, t]);

  /**
   * ✅ GET COMPLETED IDS
   */
  const completedIds = getCompletedLessonIds();

  return (
    <Box sx={{ minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">

        {/* ✅ TITLE */}
        <Typography fontWeight={800} fontSize={28} mb={4}>
          {t("nav.chapter")} - {t("components.Chapter.lessons", "Lessons")}
        </Typography>

        {/* ✅ LOADING */}
        {loading && (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        )}

        {/* ✅ ERROR */}
        {!loading && error && (
          <Typography color="error">{error}</Typography>
        )}

        {/* ✅ EMPTY */}
        {!loading && !error && lessons.length === 0 && (
          <Box textAlign="center" py={5}>
            <Typography fontSize={18}>
              {t("no_lessons", "No lessons available.")}
            </Typography>
          </Box>
        )}

        {/* ✅ LESSON LIST */}
        {!loading && !error && lessons.length > 0 && (
          <Grid container spacing={3}>
            {lessons.map((lesson) => {
              const isCompleted = completedIds.includes(String(lesson.id));

              return (
                <Grid item xs={12} md={6} key={String(lesson.id)}>
                  <LessonCard
                    lesson={lesson}
                    completed={isCompleted} // ✅ NEW PROP
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
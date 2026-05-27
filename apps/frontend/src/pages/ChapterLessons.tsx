import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getAllLessons } from "../utils/api";
import type { Lesson } from "../utils/api";
import LessonCard from "../components/Lessons/LessonCard";
import { useLocale } from "../hooks/useLocale";
import { isValidUuid } from "../utils/validators";

export default function ChapterLessons() {
  const { chapterId } = useParams();
  const { t } = useLocale();

  // ✅ VALIDATION OUTSIDE EFFECT
  const isValid = chapterId && isValidUuid(String(chapterId));

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(isValid); // ✅ depends on valid
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValid) return; // ✅ no setState here

    let mounted = true;

    getAllLessons()
      .then((data) => {
        if (!mounted) return;

        const filtered = Array.isArray(data)
          ? data.filter(
              (l) => String(l.chapterId) === String(chapterId)
            )
          : [];

        setLessons(filtered);
      })
      .catch((err: unknown) => {
        if (!mounted) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            t("errors.failed_fetch", "Failed to load lessons")
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [chapterId, isValid, t]);

  return (
    <Box sx={{ minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Typography fontWeight={800} fontSize={28} mb={4}>
          {t("components.Chapter.lessons", "Lessons")}
        </Typography>

        {/* ✅ INVALID CASE */}
        {!isValid ? (
          <Typography color="error">
            Invalid chapter ID
          </Typography>
        ) : loading ? (
          <Typography>Loading lessons...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : lessons.length === 0 ? (
          <Typography>No lessons available.</Typography>
        ) : (
          <Grid container spacing={3}>
            {lessons.map((lesson) => (
              <Grid item xs={12} md={6} key={String(lesson.id)}>
                <LessonCard lesson={lesson} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

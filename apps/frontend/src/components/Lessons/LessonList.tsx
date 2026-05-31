import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  LinearProgress,
} from "@mui/material";
import { MenuBook } from "@mui/icons-material";
import { useLocale } from "../../hooks/useLocale";
import { getAllLessons, getCompletedLessons } from "../../utils/api";
import type { Lesson } from "../../utils/api"; // ✅ FIXED
import LessonCard from "./LessonCard";

export default function LessonList({
  chapterName,
}: {
  chapterName?: string;
}) {
  const { t, locale } = useLocale();
  const isKhmer = locale === "km";

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const readFallbackCompletedIds = () => {
      try {
        const raw = localStorage.getItem("completedLessonIds");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    };

    const loadLessons = async () => {
      try {
        const lessonData = await getAllLessons();

        if (!mounted) return;

        setLessons(Array.isArray(lessonData) ? lessonData : []);
      } catch (err: unknown) {
        console.error("getAllLessons failed", err);

        if (!mounted) return;

        setLessons([]);

        setError(
          isKhmer
            ? "មិនអាចផ្ទុកមេរៀនបាន។ សូមព្យាយាមម្តងទៀត។"
            : err instanceof Error
              ? err.message
              : "Failed to load lessons"
        );
      }
    };

    const loadCompletedIds = async () => {
      try {
        const completedData = await getCompletedLessons();

        if (!mounted) return;

        setCompletedIds(Array.isArray(completedData) ? completedData : []);
      } catch {
        if (!mounted) return;

        setCompletedIds(readFallbackCompletedIds());
      }
    };

    Promise.all([loadLessons(), loadCompletedIds()]).finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

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
        {/* ✅ SHOW ERROR (FIXED UNUSED VAR) */}
        {error && (
          <Typography color="error" mb={2}>
            {isKhmer ? "មិនអាចផ្ទុកមេរៀនបាន។ សូមព្យាយាមម្តងទៀត។" : error}
          </Typography>
        )}

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#1F2937",
                mb: 1,
                fontSize: 28,
              }}
            >
              {chapterName
                ? `${t(
                    "components.Home.LessonList.chapter",
                    isKhmer ? "ជំពូក" : "Chapter"
                  )}: ${chapterName}`
                : t(
                    "components.Home.LessonList.lessons",
                    isKhmer ? "មេរៀន" : "Lessons"
                  )}
            </Typography>

            <Typography sx={{ color: "#6B7280", fontSize: 13 }}>
              {isKhmer
                ? `${completedCount} / ${total} មេរៀនបានបញ្ចប់`
                : `${completedCount} / ${total} lessons completed`}
            </Typography>
          </Box>

          <Box sx={{ width: 220 }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{ height: 8, borderRadius: 2 }}
            />
          </Box>
        </Box>

        {/* CONTENT */}
        {loading ? (
          <Typography>{isKhmer ? "កំពុងផ្ទុកមេរៀន..." : "Loading lessons..."}</Typography>
        ) : lessons.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <MenuBook
              sx={{ fontSize: 48, color: "#3B82F6", mb: 2 }}
            />
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
              {isKhmer ? "មិនមានមេរៀនទេ" : "No lessons available"}
            </Typography>
          </Box>
        ) : (
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
                    lesson={lesson}
                    status={status}
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
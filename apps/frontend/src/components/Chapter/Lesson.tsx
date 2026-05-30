import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChapters, getAllLessons } from "../../utils/api";
import type { Lesson } from "../../utils/api";
import { isValidUuid } from "../../utils/validators";

// 🎨 Pastel colors
const PASTEL_PALETTE = [
  "#C8E6C9",
  "#BBDEFB",
  "#FFE0B2",
  "#E1BEE7",
  "#FFF9C4",
  "#B2DFDB",
];

// ✅ SAFE TEXT
const getText = (value: unknown): string => {
  if (typeof value === "string") return value;

  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, string>;
    return obj.en ?? obj.km ?? "Untitled";
  }

  return "Untitled";
};

type ChapterApi = {
  id: string | number;
  title?: string | Record<string, string>;
  name?: string;
};

export default function ChapterLessonList() {
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<ChapterApi[]>([]);
  const [lessonsByChapter, setLessonsByChapter] =
    useState<Record<string, Lesson[]>>({});
  const [openChapterId, setOpenChapterId] =
    useState<string | null>(null);

  const [loadingChapters, setLoadingChapters] = useState(true);

  // ✅ LOAD DATA
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const chaptersData = await getChapters();
        const lessonsData = await getAllLessons();

        if (!mounted) return;

        setChapters(chaptersData || []);

        const grouped: Record<string, Lesson[]> = {};
        lessonsData.forEach((lesson) => {
          const key = String(lesson.chapterId || "unknown");
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(lesson);
        });

        setLessonsByChapter(grouped);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingChapters(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleChapter = (id: string | number) => {
    const idStr = String(id);
    setOpenChapterId(openChapterId === idStr ? null : idStr);
  };

  return (
    <Box sx={{ background: "#ffffff", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box display="flex" flexDirection="column" gap={3}>

          {loadingChapters ? (
            <Typography>Loading...</Typography>
          ) : chapters.length === 0 ? (
            <Typography>No chapters available</Typography>
          ) : (
            chapters.map((chapter, index) => {
              const idStr = String(chapter.id);
              const isOpen = openChapterId === idStr;
              const accent =
                PASTEL_PALETTE[index % PASTEL_PALETTE.length];

              const lessons = lessonsByChapter[idStr] ?? [];

              return (
                <Box key={idStr}>

                  {/* ✅ CHAPTER CARD */}
                  <Box
                    onClick={() => toggleChapter(idStr)}
                    sx={{
                      backgroundColor: "#ffffff",
                      borderLeft: `6px solid ${accent}`,
                      borderRadius: 3,
                      px: 3,
                      py: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      {getText(chapter.title) ||
                        chapter.name ||
                        "Untitled"}
                    </Typography>

                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: accent,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 12,
                      }}
                    >
                      {isOpen ? "▲" : "▼"}
                    </Box>
                  </Box>

                  {/* ✅ LESSON LIST */}
                  {isOpen && (
                    <Box
                      sx={{
                        mt: 1.5,
                        ml: 3,
                        pl: 2,
                        borderLeft: `3px solid ${accent}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.2,
                      }}
                    >
                      {lessons.length === 0 ? (
                        <Typography color="text.secondary">
                          No lessons
                        </Typography>
                      ) : (
                        lessons.map((lesson) => {
                          const lessonId = String(lesson.id);

                          return (
                            <Box
                              key={lessonId}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                px: 2,
                                py: 1.4,
                                backgroundColor: "#ffffff",
                                borderRadius: 2,
                                border: `1px solid ${accent}33`,
                                boxShadow:
                                  "0 2px 8px rgba(0,0,0,0.04)",
                                transition: "0.2s",

                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow:
                                    "0 6px 14px rgba(0,0,0,0.06)",
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  color: "#1E293B",
                                }}
                              >
                                {getText(lesson.title) ||
                                  lesson.titleKm}
                              </Typography>

                              <Button
                                size="small"
                                sx={{
                                  minWidth: "unset",
                                  fontSize: 18,
                                  color: "#2563EB",
                                  fontWeight: 700,
                                }}
                                onClick={() => {
                                  if (!isValidUuid(lessonId)) return;
                                  navigate(`/lesson/${lessonId}`);
                                }}
                              >
                                →
                              </Button>
                            </Box>
                          );
                        })
                      )}
                    </Box>
                  )}

                </Box>
              );
            })
          )}
        </Box>
      </Container>
    </Box>
  );
}

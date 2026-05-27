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
import LessonList from "../Lessons/LessonList";

// 🎨 Pastel colors
const PASTEL_PALETTE = [
  "#C8E6C9",
  "#BBDEFB",
  "#FFE0B2",
  "#E1BEE7",
  "#FFF9C4",
  "#B2DFDB",
];

// ✅ SAFE TEXT HELPER (VERY IMPORTANT FIX)
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
  const [lessonsByChapter, setLessonsByChapter] = useState<
    Record<string, Lesson[]>
  >({});
  const [openChapterId, setOpenChapterId] = useState<string | null>(
    null
  );

  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingLessonsId, setLoadingLessonsId] =
    useState<string | null>(null);

  // ✅ LOAD CHAPTERS
  useEffect(() => {
    let mounted = true;

    getChapters()
      .then((data) => {
        if (!mounted) return;
        setChapters(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load chapters", err);
        setChapters([]);
      })
      .finally(() => {
        if (mounted) setLoadingChapters(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ TOGGLE CHAPTER + LOAD LESSONS
  const toggleChapter = async (id: string | number) => {
    const idStr = String(id);

    if (openChapterId === idStr) {
      setOpenChapterId(null);
      return;
    }

    setOpenChapterId(idStr);

    if (lessonsByChapter[idStr]) return;

    setLoadingLessonsId(idStr);

    try {
      const allLessons = await getAllLessons();

      const filtered = allLessons.filter(
        (lesson) => String(lesson.chapterId) === idStr
      );

      setLessonsByChapter((prev) => ({
        ...prev,
        [idStr]: filtered,
      }));
    } catch {
      setLessonsByChapter((prev) => ({
        ...prev,
        [idStr]: [],
      }));
    } finally {
      setLoadingLessonsId(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        {loadingChapters ? (
          <Typography>Loading chapters...</Typography>
        ) : chapters.length === 0 ? (
          <LessonList />
        ) : (
          chapters.map((chapter, index) => {
            const idStr = String(chapter.id);
            const isOpen = openChapterId === idStr;
            const accent =
              PASTEL_PALETTE[index % PASTEL_PALETTE.length];

            const lessons = lessonsByChapter[idStr] ?? [];
            const loadingLessons =
              loadingLessonsId === idStr;

            return (
              <Box key={idStr}>
                {/* ✅ CHAPTER */}
                <Box
                  onClick={() => toggleChapter(idStr)}
                  sx={{
                    backgroundColor: isOpen
                      ? `${accent}22`
                      : "#fff",
                    borderLeft: `6px solid ${accent}`,
                    borderRadius: 3,
                    px: 3,
                    py: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography fontWeight={700}>
                    {getText(chapter.title) ||
                      chapter.name ||
                      "Untitled"}
                  </Typography>

                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: accent,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                    }}
                  >
                    {isOpen ? "▲" : "▼"}
                  </Box>
                </Box>

                {/* ✅ LESSONS */}
                {isOpen && (
                  <Box
                    sx={{
                      mt: 1.5,
                      ml: 3,
                      pl: 2,
                      borderLeft: `3px solid ${accent}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {loadingLessons ? (
                      <Typography>
                        Loading lessons...
                      </Typography>
                    ) : lessons.length === 0 ? (
                      <Typography>No lessons</Typography>
                    ) : (
                      lessons.map((lesson) => {
                        const idStr = String(lesson.id);

                        return (
                          <Box
                            key={idStr}
                            sx={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              alignItems: "center",
                              px: 2,
                              py: 1.2,
                              backgroundColor: `${accent}66`,
                              borderRadius: 2,
                            }}
                          >
                            <Typography>
                              {getText(lesson.title) ||
                                lesson.titleKm}
                            </Typography>

                            <Button
                              onClick={() => {
                                if (!isValidUuid(idStr)) {
                                  console.warn(
                                    "Invalid lesson id",
                                    idStr
                                  );
                                  return;
                                }

                                navigate(`/lesson/${idStr}`);
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
  );
}
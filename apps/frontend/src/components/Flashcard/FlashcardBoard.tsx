import { useMemo, useState, useEffect } from "react";
import { useLocale } from "../../hooks/useLocale";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import { getAllLessons, protectedPost } from "../../utils/api";

/* ✅ TYPES */

type LessonResp = {
  id: string;
  fallbackTitle?: string | null;
  titleKm?: string | null;
  title?: { km?: string } | null;
  chapterId?: string;
};

type AiFlashcard = {
  question: string;
  answer: string;
};

type AiFlashcardResponse = {
  flashcards?: AiFlashcard[];
  data?: {
    flashcards?: AiFlashcard[];
  };
};

interface FlashcardData {
  front: string;
  backTitle: string;
  backExplanation: string;
}

const LESSON_TITLE_KM: Record<string, string> = {
  "Complex Numbers": "ចំនួនកុំផ្លិច",
  "Conic Sections": "កោនិក",
  "Derivatives": "ដេរីវេ",
  "Differential Equations": "សមីការឌីផេរ៉ង់ស្យែល",
  "Functions": "អនុគមន៍",
  "Integrals": "អាំងតេក្រាល",
  "Limits": "លីមីត",
  "Probability": "ប្រូបាប៊ីលីតេ",
};

const localizeLessonTitle = (value: string, locale: string): string => {
  if (locale !== "km") return value;

  const lessonMatch = value.match(/^Lesson\s*(\d+)\s*-\s*(.+)$/i);
  if (lessonMatch) {
    const number = lessonMatch[1];
    const subject = lessonMatch[2].trim();
    const translatedSubject = LESSON_TITLE_KM[subject] ?? subject;
    return `មេរៀនទី ${number} - ${translatedSubject}`;
  }

  return LESSON_TITLE_KM[value] ?? value;
};

/* ================= FALLBACK ================= */

function buildFallbackFlashcard(
  question: string,
  lessonLabel?: string
): FlashcardData {
  const topic = question.trim() || "សំណួរ";
  const label = lessonLabel?.trim();

  return {
    front: topic,
    backTitle: "Answer",
    backExplanation: label
      ? `ចម្លើយគំរូសម្រាប់ ${label}: សូមពិនិត្យជំហានដោះស្រាយនៃ ${topic}`
      : `ចម្លើយគំរូ: សូមពិនិត្យជំហានដោះស្រាយនៃ ${topic}`,
  };
}

/* ================= COMPONENT ================= */

export default function FlashcardBoard() {
  const { t, locale } = useLocale();
  const isKhmer = locale === 'km';
  const navigate = useNavigate();

  const [lessonOptions, setLessonOptions] = useState<
    { label: string; value: string; chapterId?: string }[]
  >([]);

  const [lesson, setLesson] = useState("");
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index] ?? null;
  const generatedCard = useMemo(() => card, [card]);

  /* ================= LOAD LESSONS ================= */

  useEffect(() => {
    getAllLessons().then((lessons) => {
      const mapped = (lessons as LessonResp[]).map((l) => ({
        label: localizeLessonTitle(
          l.title?.km || l.titleKm || l.fallbackTitle || "Untitled",
          locale
        ),
        value: l.id,
        chapterId: l.chapterId ?? undefined,
      }));

      setLessonOptions(mapped);

      setLesson((current) =>
        current && mapped.some((option) => option.value === current)
          ? current
          : mapped[0]?.value || ""
      );
    });
  }, [locale]);

  /* ================= GENERATE ================= */

  const handleGenerate = async () => {
    if (!isLoggedIn()) {
      navigate(`/login?next=${encodeURIComponent("/flashcard")}`);
      return;
    }

    if (!lesson) return alert(isKhmer ? "សូមជ្រើសរើសមេរៀនសិន" : "Please select a lesson first");
    if (!topic) return alert(isKhmer ? "សូមបញ្ចូលប្រធានបទសិន" : "Please enter a topic");

    try {
      const res = await protectedPost<AiFlashcardResponse>(
        "/api/ai/flashcards",
        {
          lessonId: lesson,
          topic: topic,
          language: "km",
          save: false,
        }
      );

      console.log("AI RESPONSE:", res);

      const flashcards =
        res.flashcards || res.data?.flashcards || [];

      if (!flashcards || flashcards.length === 0) {
        throw new Error(isKhmer ? "មិនមានកាតត្រឡប់មកពី AI ទេ" : "No flashcards returned from AI");
      }

      const transformed: FlashcardData[] = flashcards.map((f) => ({
        front: f.question,
        backTitle: "Answer",
        backExplanation: f.answer,
      }));

      setCards(transformed);
      setIndex(0);
      setFlipped(false);
    } catch (err) {
      console.error("Flashcard error:", err);

      const selectedLabel = lessonOptions.find(
        (o) => o.value === lesson
      )?.label;

      const fallback = buildFallbackFlashcard(topic, selectedLabel);

      setCards([fallback]);
      setIndex(0);
      setFlipped(false);
    }
  };

  /* ✅ CLEAR */
  const handleClear = () => {
    setLesson("");
    setTopic("");
    setCards([]);
    setIndex(0);
    setFlipped(false);
  };

  /* ✅ NAVIGATION */
  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "340px 1fr" },
        minHeight: { xs: "auto", md: "560px" },
        border: "1px solid #B7B7B7",
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* LEFT PANEL */}
      <Box
        sx={{
          p: 2.5,
          borderRight: { xs: "none", md: "1px solid #B7B7B7" },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 0,
            boxShadow: "none",
            borderColor: "#B7B7B7",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
            {t(
              "components.Flashcard.FlashcardBoard.flashcard",
              isKhmer ? "កាតរំលឹក" : "Flashcard"
            )}
          </Typography>
          <Typography sx={{ color: "#666", fontSize: 13 }}>
            {isKhmer
              ? 'បង្កើតកាតរំលឹកអន្តរកម្មសម្រាប់ការពិនិត្យមើលឆាប់រហ័ស'
              : 'Generate interactive flashcard for fast revision'}
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ mb: 0.75 }}>{isKhmer ? 'មេរៀន' : 'Lesson'}</Typography>

            <Select
              fullWidth
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
            >
              {lessonOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography sx={{ mb: 0.75 }}>{isKhmer ? 'ប្រធានបទ' : 'Topic'}</Typography>
            <TextField
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={isKhmer ? 'បញ្ចូលលំហាត់' : 'Enter exercise'}
            />
          </Box>

          <Button
            onClick={handleGenerate}
            variant="contained"
            sx={{
              backgroundColor: "#F8E8AE",
              color: "#111",
              borderRadius: 3,
              "&:hover": { backgroundColor: "#F5DEA0" },
            }}
          >
            {isKhmer ? 'បង្កើត' : 'Generate'}
          </Button>

          <Button
            onClick={handleClear}
            variant="contained"
            sx={{
              backgroundColor: "#AEE0F0",
              color: "#111",
              borderRadius: 3,
              "&:hover": { backgroundColor: "#97D2E7" },
            }}
          >
            {isKhmer ? 'សម្អាត' : 'Clear'}
          </Button>
        </Stack>
      </Box>

      {/* RIGHT PANEL */}
      <Box sx={{ p: 4, display: "grid", placeItems: "center" }}>
        {generatedCard ? (
          <>
            <Box
              onClick={() => setFlipped((v) => !v)}
              sx={{
                width: 430,
                maxWidth: "100%",
                minHeight: 240,
                perspective: "1200px",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  minHeight: 240,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s ease",
                  transform: flipped
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                }}
              >
                <Paper
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    borderRadius: 3,
                    backgroundColor: "#FFF0BF",
                    p: 3,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography textAlign="center" fontSize={26}>
                    {generatedCard.front}
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    position: "absolute",
                    inset: 0,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    borderRadius: 3,
                    backgroundColor: "#FFF7DE",
                    p: 3,
                  }}
                >
                  <Typography fontWeight="bold" mb={1}>
                    {isKhmer ? 'ចម្លើយ' : generatedCard.backTitle}
                  </Typography>
                  <Typography>
                    {generatedCard.backExplanation}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} mt={2}>
              <Button onClick={handlePrev} disabled={index === 0}>
                {isKhmer ? 'មុន' : 'Prev'}
              </Button>

              <Button
                onClick={handleNext}
                disabled={index === cards.length - 1}
              >
                {isKhmer ? 'បន្ទាប់' : 'Next'}
              </Button>
            </Stack>

            <Typography mt={1}>
              {index + 1} / {cards.length}
            </Typography>
          </>
        ) : (
          <Box
            sx={{
              width: 430,
              border: "1px dashed #ccc",
              textAlign: "center",
              p: 3,
            }}
          >
            {isKhmer ? 'មិនទាន់មានកាតរំលឹកទេ' : 'No flashcard yet'}
          </Box>
        )}
      </Box>
    </Box>
  );
}

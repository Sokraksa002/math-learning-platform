import { useMemo, useState, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';
import { getAllLessons, protectedPost } from '../../utils/api';

// ✅ FIXED IMPORTS


type AiFlashcardResponse = {
  id?: string;
  questionKm?: string;
  answerJson?: unknown;
};

type LessonResp = {
  id: string;
  fallbackTitle?: string | null;
  title?: { km?: string } | null;
  chapterId?: string;
};

function hasAnswerField(x: unknown): x is { answer?: string } {
  return typeof x === 'object' && x !== null && 'answer' in x;
}


/* ✅ TYPE */
interface FlashcardData {
  front: string;
  backTitle: string;
  backExplanation: string;
}

export default function FlashcardBoard() {
  const { t } = useLocale();
  const navigate = useNavigate();

  /* ✅ STATE */
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

  /* ✅ LOAD LESSONS FROM BACKEND */
  useEffect(() => {
    getAllLessons().then((lessons) => {
      const mapped = (lessons as LessonResp[]).map((l) => ({
        label: l.fallbackTitle ?? (l.title?.km ?? 'Untitled'),
        value: l.id,
        chapterId: l.chapterId ?? undefined,
      }));

      setLessonOptions(mapped);

      if (mapped.length > 0) {
        setLesson(mapped[0].value);
      }
    });
  }, []);

  /* ✅ GENERATE FROM BACKEND */
  const handleGenerate = async () => {
    if (!isLoggedIn()) {
      navigate(`/login?next=${encodeURIComponent('/flashcard')}`);
      return;
    }

    if (!lesson) {
      alert("Please select a lesson first");
      return;
    }

    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    try {
      // ✅ CALL BACKEND GENERATE ENDPOINT
      // find selected lesson to obtain its chapterId (flashcards reference chapters)
      const selected = lessonOptions.find((o) => o.value === lesson);
      const chapterIdToSend = selected?.chapterId;
      if (!chapterIdToSend) {
        alert('Selected lesson has no associated chapter — cannot generate flashcard');
        return;
      }

      const data = await protectedPost<AiFlashcardResponse>('/api/flashcard/generate', {
        chapterId: chapterIdToSend,
        question: topic,
      });

      console.log("FLASHCARD RESPONSE:", data);

      const transformed: FlashcardData[] = [
        {
          // ✅ Use user input OR AI question
          front: (topic || data.questionKm || "") as string,
          backTitle: "Answer",
          backExplanation:
            (hasAnswerField(data.answerJson) && data.answerJson.answer) ||
            JSON.stringify(data.answerJson) ||
            "",
        },
      ];

      setCards(transformed);
      setIndex(0);
      setFlipped(false);

    } catch (err) {
      console.error("Flashcard error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to generate flashcard");
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
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '340px 1fr' },
        minHeight: { xs: 'auto', md: '560px' },
        border: '1px solid #B7B7B7',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {/* ✅ LEFT PANEL */}
      <Box sx={{ p: 2.5, borderRight: { xs: 'none', md: '1px solid #B7B7B7' } }}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 0,
            boxShadow: 'none',
            borderColor: '#B7B7B7',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
            {t('components.Flashcard.FlashcardBoard.flashcard', 'Flashcard')}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 13 }}>
            Generate interactive flashcard for fast revision
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ mb: 0.75 }}>Lesson</Typography>

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
            <Typography sx={{ mb: 0.75 }}>Topic</Typography>
            <TextField
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter exercise"
            />
          </Box>

          <Button
            onClick={handleGenerate}
            variant="contained"
            sx={{
              backgroundColor: '#F8E8AE',
              color: '#111',
              borderRadius: 3,
              '&:hover': { backgroundColor: '#F5DEA0' },
            }}
          >
            Generate
          </Button>

          <Button
            onClick={handleClear}
            variant="contained"
            sx={{
              backgroundColor: '#AEE0F0',
              color: '#111',
              borderRadius: 3,
              '&:hover': { backgroundColor: '#97D2E7' },
            }}
          >
            Clear
          </Button>
        </Stack>
      </Box>

      {/* ✅ RIGHT PANEL */}
      <Box sx={{ p: 4, display: 'grid', placeItems: 'center' }}>
        {generatedCard ? (
          <>
            <Box
              onClick={() => setFlipped((v) => !v)}
              sx={{
                width: 430,
                maxWidth: '100%',
                minHeight: 240,
                perspective: '1200px',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 240,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT */}
                <Paper
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    borderRadius: 3,
                    backgroundColor: '#FFF0BF',
                    p: 3,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Typography textAlign="center" fontSize={26}>
                    {generatedCard.front}
                  </Typography>
                </Paper>

                {/* BACK */}
                <Paper
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    borderRadius: 3,
                    backgroundColor: '#FFF7DE',
                    p: 3,
                  }}
                >
                  <Typography fontWeight="bold" mb={1}>
                    {generatedCard.backTitle}
                  </Typography>
                  <Typography>
                    {generatedCard.backExplanation}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} mt={2}>
              <Button onClick={handlePrev} disabled={index === 0}>
                Prev
              </Button>

              <Button onClick={handleNext} disabled={index === cards.length - 1}>
                Next
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
              border: '1px dashed #ccc',
              textAlign: 'center',
              p: 3,
            }}
          >
            No flashcard yet
          </Box>
        )}
      </Box>
    </Box>
  );
}
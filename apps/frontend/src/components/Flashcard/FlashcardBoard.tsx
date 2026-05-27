import { useMemo, useState } from 'react';
import { useLocale } from '../../hooks/useLocale';
import { Box, Button, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';

interface FlashcardData {
  front: string;
  backTitle: string;
  backExplanation: string;
}

const flashcardLibrary: Record<string, FlashcardData> = {
  Limit: {
    front: 'f(x) = (x - 1) ln x',
    backTitle: 'Answer',
    backExplanation:
      'lim(x→1) (x - 1)lnx = 0 because (x - 1) approaches 0 while lnx stays finite near x = 1.',
  },
  Derivative: {
    front: 'd/dx (x^2)',
    backTitle: 'Answer',
    backExplanation: 'The derivative of x^2 is 2x using the power rule.',
  },
  Integral: {
    front: '∫ 1 dx',
    backTitle: 'Answer',
    backExplanation: 'The integral of 1 with respect to x is x + C.',
  },
};

const lessonOptions = ['Limit', 'Derivative', 'Integral'];

export default function FlashcardBoard() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState('Limit');
  const [topic, setTopic] = useState('f(x) = (x - 1)lnx');
  const [card, setCard] = useState<FlashcardData | null>(null);
  const [flipped, setFlipped] = useState(false);

  const generatedCard = useMemo(() => {
    if (!card) {
      return null;
    }

    return card;
  }, [card]);

  const handleGenerate = () => {
    // require login for generation
    if (!isLoggedIn()) {
      navigate(`/login?next=${encodeURIComponent('/flashcard')}`);
      return;
    }
    const nextCard = flashcardLibrary[lesson] ?? flashcardLibrary.Limit;
    const derivedCard =
      topic.trim().length > 0
        ? {
            ...nextCard,
            front: topic,
          }
        : nextCard;

    setCard(derivedCard);
    setFlipped(false);
  };

  const handleClear = () => {
    setLesson('Limit');
    setTopic('f(x) = (x - 1)lnx');
    setCard(null);
    setFlipped(false);
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
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>{t('components.Flashcard.FlashcardBoard.flashcard', 'Flashcard')}</Typography>
          <Typography sx={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>
            Generate interactive flashcard for fast revision and memory retention
          </Typography>
        </Paper>

        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 16 ,
 textAlign: 'left',
    alignSelf: 'flex-start',
}}>{t('components.Flashcard.FlashcardBoard.lesson', 'lesson')}</Typography>
            <Select
              fullWidth
              value={lesson}
              onChange={(event: SelectChangeEvent) => setLesson(event.target.value)}
              displayEmpty
              sx={{ borderRadius: 0, backgroundColor: '#fff' }}
            >
              {lessonOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 16,
 textAlign: 'left',
    alignSelf: 'flex-start',
 }}>{t('components.Flashcard.FlashcardBoard.topic', 'Topic')}</Typography>
            <TextField
              fullWidth
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder={t('components.Flashcard.FlashcardBoard.enter_exercise', 'Enter exercise')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
          </Box>

          <Button
            onClick={handleGenerate}
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: '#F8E8AE',
              color: '#111',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 3,
              py: 1.1,
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
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 3,
              py: 1.1,
              '&:hover': { backgroundColor: '#97D2E7' },
            }}
          >
            Clear
          </Button>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 2.5, md: 4 }, display: 'grid', placeItems: 'center' }}>
        {generatedCard ? (
          <Box
            onClick={() => setFlipped((value) => !value)}
            sx={{
              width: { xs: '100%', sm: 430, md: 500 },
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
              <Paper
                elevation={0}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  borderRadius: 3,
                  backgroundColor: '#FFF0BF',
                  border: '1px solid #E5D8A2',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#9A6B00', fontWeight: 700, mb: 2 }}>{t('components.Flashcard.FlashcardBoard.flashcard', 'Flashcard')}</Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 30 },
                    fontWeight: 600,
                    textAlign: 'center',
                    color: '#1F2937',
                    fontFamily: 'serif',
                  }}
                >
                  {generatedCard.front}
                </Typography>
                <Typography sx={{ textAlign: 'right', color: '#8B6A3D', fontSize: 12, mt: 2 }}>
                  click to flip
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: 3,
                  backgroundColor: '#FFF7DE',
                  border: '1px solid #F0C24F',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#E29600', fontWeight: 700, mb: 2 }}>{generatedCard.backTitle}</Typography>
                <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: '#1F2937', whiteSpace: 'pre-line' }}>
                  {generatedCard.backExplanation}
                </Typography>
                <Typography sx={{ textAlign: 'right', color: '#8B6A3D', fontSize: 12, mt: 2 }}>
                  click to flip back
                </Typography>
              </Paper>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: { xs: '100%', sm: 430, md: 500 },
              maxWidth: '100%',
              minHeight: 240,
              borderRadius: 3,
              border: '1px dashed #D3D8E0',
              display: 'grid',
              placeItems: 'center',
              color: '#6B7280',
              textAlign: 'center',
              px: 3,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>{t('components.Flashcard.FlashcardBoard.flashcard_q__a', 'Flashcard Q & A')}</Typography>
              <Typography sx={{ fontSize: 13 }}>
                Generate a flashcard first, then click the card to flip and see the answer.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
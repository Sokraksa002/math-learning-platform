import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useLocale } from '../hooks/useLocale';

interface FlashcardCard {
  front: string;
  back: string;
  correct?: boolean;
}

interface FlashcardSession {
  id: string;
  topic: string;
  lesson: string;
  createdAt: string;
  mastery: number;
  reviewedCards: number;
  totalCards: number;
  notes: string;
  cards: FlashcardCard[];
}

const buildSessionDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const flashcardHistory: FlashcardSession[] = [
  {
    id: 'flashcard-1',
    topic: 'Limits and continuity',
    lesson: 'Limit',
    createdAt: buildSessionDate(1),
    mastery: 92,
    reviewedCards: 12,
    totalCards: 14,
    notes: 'Strong understanding of end behavior and one-sided limits.',
    cards: [
      { front: 'lim(x→1) (x - 1)lnx', back: '0', correct: true },
      { front: 'lim(x→0) sin x / x', back: '1', correct: true },
    ],
  },
  {
    id: 'flashcard-2',
    topic: 'Derivatives basics',
    lesson: 'Derivative',
    createdAt: buildSessionDate(3),
    mastery: 78,
    reviewedCards: 9,
    totalCards: 12,
    notes: 'Good recall on power rule, but chain rule needs more practice.',
    cards: [
      { front: 'd/dx (x^2)', back: '2x', correct: true },
      { front: 'd/dx (sin x)', back: 'cos x', correct: true },
      { front: 'd/dx (e^x)', back: 'e^x', correct: true },
    ],
  },
  {
    id: 'flashcard-3',
    topic: 'Integrals and constants',
    lesson: 'Integral',
    createdAt: buildSessionDate(6),
    mastery: 64,
    reviewedCards: 8,
    totalCards: 13,
    notes: 'Remember to add +C and identify simple antiderivatives faster.',
    cards: [
      { front: '∫ 1 dx', back: 'x + C', correct: true },
      { front: '∫ x dx', back: 'x^2 / 2 + C', correct: true },
    ],
  },
];

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function FlashcardHistory() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [openSessionId, setOpenSessionId] = useState<string | null>(flashcardHistory[0]?.id ?? null);

  const averageMastery = Math.round(
    flashcardHistory.reduce((sum, session) => sum + session.mastery, 0) / flashcardHistory.length
  );

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)',
        }}
      >
        <Box sx={{ maxWidth: '1100px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 3,
              borderRadius: 4,
                  background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #14b8a6 100%)',
              color: 'white',
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
              {t('pages.FlashcardHistory.flashcard_history', 'Flashcard history')}
            </Typography>
            <Typography variant="h4" fontWeight={800} mt={1} mb={1}>
              {t('pages.FlashcardHistory.your_revision_sessions', 'Your revision sessions')}
            </Typography>
            <Typography sx={{ maxWidth: 720, opacity: 0.9 }}>
              {t('pages.FlashcardHistory.subtitle', 'Track the flashcards you reviewed, how much you mastered, and the notes you left for each study session.')}
            </Typography>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                {t('pages.FlashcardHistory.sessions', 'Sessions')}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {flashcardHistory.length}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                {t('pages.FlashcardHistory.average_mastery', 'Average mastery')}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {averageMastery}%
              </Typography>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                {t('pages.FlashcardHistory.recent_review', 'Recent review')}
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {flashcardHistory[0]?.lesson ?? '-'}
              </Typography>
            </Paper>
          </Box>

          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
              <Box>
                <Typography fontWeight={800} color="#0f172a">
                  {t('pages.FlashcardHistory.jump_back_into_flashcards', 'Jump back into flashcards')}
                </Typography>
                <Typography color="text.secondary">
                  {t('pages.FlashcardHistory.flashcard_page_hint', 'Open the learning page directly instead of staying in the history view.')}
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => navigate('/flashcard')}>
                {t('pages.FlashcardHistory.go_to_flashcards', 'Go to Flashcards')}
              </Button>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            {flashcardHistory.map((session) => {
              const isOpen = openSessionId === session.id;
              const progress = Math.round((session.reviewedCards / session.totalCards) * 100);

              return (
                <Card key={session.id} sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                          <Chip label={session.lesson} color="primary" size="small" />
                          <Chip label={`${session.mastery}% mastery`} color={session.mastery >= 80 ? 'success' : 'warning'} size="small" />
                        </Stack>

                        <Typography variant="h6" fontWeight={800} mb={0.5}>
                          {session.topic}
                        </Typography>

                        <Typography color="text.secondary" mb={1}>
                          Reviewed on {formatDate(session.createdAt)}
                        </Typography>

                        <Typography color="text.secondary" fontSize="0.95rem">
                          {session.notes}
                        </Typography>
                      </Box>

                      <Box sx={{ minWidth: { xs: '100%', md: 260 } }}>
                        <Typography fontWeight={700} mb={0.5}>
                          {session.reviewedCards}/{session.totalCards} cards reviewed
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Typography color="text.secondary" fontSize="0.9rem" mb={2}>
                          Session completion: {progress}%
                        </Typography>
                        <Stack spacing={1.2}>
                          <Button variant={isOpen ? 'contained' : 'outlined'} onClick={() => setOpenSessionId(isOpen ? null : session.id)}>
                            {isOpen ? 'Hide details' : 'View details'}
                          </Button>
                          <Button variant="text" onClick={() => navigate('/flashcard')}>
                            Open Flashcards
                          </Button>
                        </Stack>
                      </Box>
                    </Box>

                    {isOpen ? (
                      <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                            gap: 2,
                          }}
                        >
                          {session.cards.map((card, ci) => (
                            <Paper key={`${session.id}-${ci}`} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                              <Typography fontWeight={700} mb={1}>
                                  {t('pages.FlashcardHistory.flashcard', 'Flashcard')}
                              </Typography>
                              <Typography color="text.secondary" fontSize="0.9rem" mb={1}>
                                {card.front}
                              </Typography>

                              <Divider sx={{ my: 1 }} />

                              <Typography fontWeight={700} mb={1}>
                                {t('pages.FlashcardHistory.answer', 'Answer')}
                              </Typography>
                              <Typography color="text.secondary" fontSize="0.9rem" mb={1}>
                                {card.back}
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </>
  );
}

import { Box, Container, Paper, Typography } from '@mui/material';
import FlashcardBoard from '../components/Flashcard/FlashcardBoard';

export default function Flashcard() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #eff6ff 0%, #f8fbff 46%, #ffffff 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3, borderRadius: 4, color: 'white', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #2563eb 100%)', boxShadow: '0 18px 40px rgba(37, 99, 235, 0.22)' }}>
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
            Flashcards
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            Practice with the blue learning theme
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 760 }}>
            Generate a card, flip it, and keep the interaction exactly the same while matching the new site color system.
          </Typography>
        </Paper>

        <FlashcardBoard />
      </Container>
    </Box>
  );
}
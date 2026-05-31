import { Box, Container, Paper, Typography } from '@mui/material';
import FlashcardBoard from '../components/Flashcard/FlashcardBoard';
import { useLocale } from '../hooks/useLocale';

export default function Flashcard() {
  const { t, locale } = useLocale();
  const isKhmer = locale === 'km';

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
            {isKhmer ? 'កាតរំលឹក' : t('pages.Flashcard.flashcards', 'Flashcards')}
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            {isKhmer
              ? 'អនុវត្តជាមួយប្រធានបទសិក្សាពណ៌ខៀវ'
              : t('pages.Flashcard.practice_theme', 'Practice with the blue learning theme')}
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 760 }}>
            {isKhmer
              ? 'បង្កើតកាត បង្វិលវា ហើយបន្តប្រើប្រាស់ដូចមុន ខណៈពេលដែលសម្របពណ៌សមនឹងគេហទំព័រ។'
              : t('pages.Flashcard.subtitle', 'Generate a card, flip it, and keep the interaction exactly the same while matching the new site color system.')}
          </Typography>
        </Paper>

        <FlashcardBoard />
      </Container>
    </Box>
  );
}
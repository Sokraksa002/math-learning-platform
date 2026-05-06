import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';


export default function FlashcardSection() {
  const { t } = useLocale();

  return (
    <Box sx={{ backgroundColor: '#FFF9C4', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 4,
            fontSize: '28px',
          }}
        >
          {t('components.Home.FlashcardSection.flashcards', 'Flashcard Q&A')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography sx={{ color: '#666', fontSize: '16px' }}>
            {t('components.Home.FlashcardSection.best_approach', "Let us show you the best approach to ace the test!")}
          </Typography>

          
<Button
  component={RouterLink}
  to="/flashcard"
  variant="contained"
  sx={{
    backgroundColor: '#FFD54F',
    color: '#000',
    fontWeight: 'bold',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: '#FFC107',
    },
  }}

          >
            {t('components.Home.FlashcardSection.card_generate', 'Card Generate')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

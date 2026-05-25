import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';
import walk from '../../assets/walk.gif';

export default function FlashcardSection() {
  const { t } = useLocale();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: '#fff',
            borderLeft: '6px solid #6FAEF2',
            borderRadius: 3,
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          {/* ================= LEFT CONTENT ================= */}
          <Box sx={{ maxWidth: 520 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: '#1F2937',
                mb: 1,
                fontSize: 32,
              }}
            >
              {t(
                'components.Home.FlashcardSection.flashcards',
                'Flashcards'
              )}
            </Typography>

            <Typography
              sx={{
                color: '#5f6c80',
                fontSize: 16,
                mb: 3,
              }}
            >
              {t(
                'components.Home.FlashcardSection.best_approach',
                'Let us show you the best approach to ace the test!'
              )}
            </Typography>

            <Button
              component={RouterLink}
              to="/flashcard"
              variant="contained"
              sx={{
                backgroundColor: '#3D86E8',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.1,
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: '#2F6FC0',
                },
              }}
            >
              {t(
                'components.Home.FlashcardSection.card_generate',
                'Card Generate'
              )}
            </Button>
          </Box>

          {/* ================= RIGHT GIF ================= */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            <img
              src={walk}
              alt="Flashcard illustration"
              style={{
                height: 120,
                display: 'block',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

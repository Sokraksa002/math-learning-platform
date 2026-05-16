import { Box, Container, Typography, Chip, Button } from '@mui/material';
import { useLocale } from '../../hooks/useLocale';
import { ArrowRight } from 'lucide-react';

const MATH_SYMBOLS = ['∑', '∫', 'π', '√', 'θ', 'x²', '∞', '∂'];

export default function HeroSection() {
  const { t } = useLocale();
  return (
    <Box sx={{ position: 'relative', py: { xs: 4, md: 8 }, overflow: 'hidden' }}>
      <Container maxWidth="lg">
        {/* Math symbols background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: 2,
            opacity: 0.08,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {MATH_SYMBOLS.map((symbol, i) => (
            <Box
              key={i}
              sx={{
                fontSize: '48px',
                color: '#3B82F6',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {symbol}
            </Box>
          ))}
        </Box>

        {/* Main hero content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              borderRadius: 3,
              px: { xs: 3, md: 6 },
              py: { xs: 5, md: 7 },
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -30,
                left: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Chip
                label={t('hero.ai_learning_hub', 'AI Learning Hub')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  mb: 2,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '28px', md: '44px' },
                  lineHeight: 1.3,
                }}
              >
                {t(
                  'hero.khmer_title',
                  'រៀនគណិតវិទ្យាកាន់តែងាយស្រួល'
                )}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  opacity: 0.95,
                  maxWidth: '600px',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                {t(
                  'hero.subtitle',
                  'Find exercise solutions and abundant learning resources with Kanit.'
                )}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: '#3B82F6',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '15px',
                  px: 3,
                  py: 1.2,
                  '&:hover': { backgroundColor: '#F3F4F6' },
                }}
                endIcon={<ArrowRight size={18} />}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

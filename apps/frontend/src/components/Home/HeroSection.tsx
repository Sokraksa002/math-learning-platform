import { Box, Container, Grid, Typography } from '@mui/material';
import { useLocale } from '../../hooks/useLocale';
import heroImg from '../../assets/avatar.jpg';

export default function HeroSection() {
  const { t } = useLocale();
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid xs={12} md={6}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              color: '#2196F3',
              fontSize: { xs: '36px', md: '48px' },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Welcome to Kanit
          </Typography>
        </Grid>

        <Grid xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
          <Box
            component="img"
            src={heroImg}
            alt={t('components.Home.HeroSection.learning_illustration', 'Learning Illustration')}
            sx={{
              maxWidth: { xs: '220px', md: '320px' },
              height: 'auto',
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

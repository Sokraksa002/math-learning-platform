import { Box, Container, Typography } from '@mui/material';
import Calender from './Calender';
import { useLocale } from '../../hooks/useLocale';

export default function MoodSection() {
  const { t } = useLocale();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 4,
            fontSize: '20px',
          }}
        >
          {t('components.Home.MoodSection.emotional_support', 'What about your mood for today?')}
        </Typography>
        <Calender />
      </Container>
    </Box>
  );
}

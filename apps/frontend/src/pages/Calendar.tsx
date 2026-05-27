import { Box, Container } from '@mui/material';
import EmotionCalendar from '../components/Home/EmotionCalendar';
import { useLocale } from '../hooks/useLocale';

export default function CalendarPage() {
  const { t } = useLocale();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <Box
        sx={{
          backgroundColor: '#2196F3',
          padding: '12px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 500,
          color: '#fff',
        }}
      >
        {t('pages.Calendar.title', 'Mood & Reflection Calendar')}
      </Box>

      <Box sx={{ backgroundColor: '#fff', flex: 1, py: 4 }}>
        <Container maxWidth="lg" sx={{ px: 0 }}>
          <EmotionCalendar />
        </Container>
      </Box>
    </Box>
  );
}

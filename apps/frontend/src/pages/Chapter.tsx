import { Box, Container } from '@mui/material';
import Lesson from '../components/Chapter/Lesson';
import { useLocale } from '../hooks/useLocale';

export default function Chapter() {
  const { t } = useLocale();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      {/* Banner */}
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
        {t('components.Chapter.lets_study', "Let's study with us!")}
      </Box>

      {/* Content */}
      <Box sx={{ backgroundColor: '#fff', flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: 0 }}>
          <Lesson />
        </Container>
      </Box>
    </Box>
  );
}

import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';

interface QuizCard {
  id: number;
  title: string;
  accent: string;
}

export default function QuizTimeSection() {
  const { t } = useLocale();
  const navigate = useNavigate();

  const quizzes: QuizCard[] = [
    { id: 1, title: 'Chapter 1', accent: '#3D86E8' },
    { id: 2, title: 'Chapter 2', accent: '#5CA8F2' },
    { id: 3, title: 'Chapter 3', accent: '#2F6FD4' },
    { id: 4, title: 'Chapter 4', accent: '#78B4F6' },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1F2937',
            mb: 5,
            fontSize: '28px',
          }}
        >
          {t('components.Home.QuizTimeSection.quiz_section', 'Quiz Time')}
        </Typography>
{/* Hamburger list */}
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  {quizzes.map((quiz) => (
    <Box
      key={quiz.id}
      onClick={() => navigate(`/quiz`)}
      sx={{
        backgroundColor: '#fff',
        borderLeft: `6px solid ${quiz.accent}`,
        borderRadius: '12px',
        px: 3,
        py: 2.5,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 22px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#161a1d' }}>
        {quiz.title}
      </Typography>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/quiz`);
        }}
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          fontSize: 20,
          width: 40,
          color: '#3D86E8',
          minWidth: 'auto',
        }}
      >
        →
      </Button>
    </Box>
  ))}
</Box>
      </Container>
    </Box>
  );
}
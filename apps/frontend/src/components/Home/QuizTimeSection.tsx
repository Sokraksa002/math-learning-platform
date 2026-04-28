import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface QuizCard {
  id: number;
  title: string;
  bgColor: string;
}

export default function QuizTimeSection() {
  const navigate = useNavigate();

  const quizzes: QuizCard[] = [
    { id: 1, title: 'Chapter 1', bgColor: '#A8D5BA' },
    { id: 2, title: 'Chapter 2', bgColor: '#74B9FF' },
    { id: 3, title: 'Chapter 3', bgColor: '#FFD4A3' },
    { id: 4, title: 'Chapter 4', bgColor: '#D8B9F9' },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 5,
            fontSize: '28px',
          }}
        >
          Quiz Time
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {quizzes.map((quiz) => (
            <Box
              key={quiz.id}
              onClick={() => navigate('/quiz')}
              sx={{
                flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' },
                backgroundColor: quiz.bgColor,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#2B2B2B', mb: 1 }}>{quiz.title}</Typography>
              <Typography sx={{ fontSize: 13, color: '#666', mb: 1 }}>Lesson: Limit</Typography>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  navigate('/quiz');
                }}
                variant="text"
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#3D86E8',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Start
              </Button>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

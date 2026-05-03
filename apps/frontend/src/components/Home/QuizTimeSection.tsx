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
{/* Hamburger list */}
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  {quizzes.map((quiz) => (
    <Box
      key={quiz.id}
      onClick={() => navigate(`/quiz`)}
      // onClick={() => navigate(`/quiz/${quiz.id}`)}
      sx={{
        backgroundColor: quiz.bgColor, // ✅ use chapter color
        borderRadius: '12px',
        px: 3,
        py: 2.5,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#2B2B2B' }}>
        {quiz.title}
      </Typography>

      <Button
        onClick={(e) => {
          e.stopPropagation();
           navigate(`/quiz`)}
      //  navigate(`/quiz/${quiz.id}`)}
      }
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          fontSize: 20,
          fontWidth: 50,
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
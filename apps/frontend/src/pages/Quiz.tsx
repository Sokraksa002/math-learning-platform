import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Home/Header';

const quizChapters = [
  { id: 1, name: 'Chapter 1', lesson: 'Lesson: Limit', color: '#B3E5FC' },
  { id: 2, name: 'Chapter 2', lesson: 'Lesson: Limit', color: '#C8E6C9' },
  { id: 3, name: 'Chapter 3', lesson: 'Lesson: Limit', color: '#FFF9C4' },
  { id: 4, name: 'Chapter 4', lesson: 'Lesson: Limit', color: '#E1BEE7' },
];

export default function Quiz() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <Header />

      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 5,
            textAlign: 'left',
            color: '#333',
          }}
        >
          Quiz Time
        </Typography>

        {/* ✅ HAMBURGER / LIST STYLE */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {quizChapters.map((chapter) => (
            <Card
              key={chapter.id}
              onClick={() => navigate(`/quiz/paper/${chapter.id}`)}
              sx={{
                backgroundColor: chapter.color,
                borderRadius: '12px',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 2.5,
                }}
              >
                {/* Left content */}
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '15px',
                      mb: 0.5,
                    }}
                  >
                    {chapter.name}
                  </Typography>

                  <Typography sx={{ fontSize: '13px', color: '#666' }}>
                    {chapter.lesson}
                  </Typography>
                </Box>

                {/* Right action */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent double navigation
                    navigate(`/quiz/paper/${chapter.id}`);
                  }}
                  variant="text"
                  sx={{
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2196F3',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  →
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
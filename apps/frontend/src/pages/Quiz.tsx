import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Home/Header';

const quizChapters = [
  { id: 1, name: 'Chapter1', lesson: 'Lesson: Limit', color: '#B3E5FC' },
  { id: 2, name: 'Chapter2', lesson: 'Lesson: Limit', color: '#C8E6C9' },
  { id: 3, name: 'Chapter3', lesson: 'Lesson: Limit', color: '#FFF9C4' },
  { id: 4, name: 'Chapter4', lesson: 'Lesson: Limit', color: '#E1BEE7' },
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

      {/* Quiz Time Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 6,
            textAlign: 'center',
            color: '#333',
          }}
        >
          Quiz Time
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {quizChapters.map((chapter) => (
            <Grid item xs={12} sm={6} md={3} key={chapter.id}>
              <Card
                sx={{
                  backgroundColor: chapter.color,
                  borderRadius: '12px',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography
                    sx={{ fontWeight: 'bold', color: '#333', mb: 1, fontSize: '14px' }}
                  >
                    {chapter.name}
                  </Typography>

                  <Typography sx={{ fontSize: '13px', color: '#666' }}>
                    {chapter.lesson}
                  </Typography>

                  <Button
                    onClick={() => navigate(`/quiz/paper/${chapter.id}`)}
                    variant="text"
                    sx={{
                      mt: 1,
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#2196F3',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Start
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2196F3',
              textTransform: 'none',
              borderRadius: '24px',
              px: 4,
              py: 1,
            }}
          >
            Select more
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
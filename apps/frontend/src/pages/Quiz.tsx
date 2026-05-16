import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Container,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const quizChapters = [
  { id: 1, name: 'Chapter 1', lesson: 'Lesson: Limit', color: '#3D86E8' },
  { id: 2, name: 'Chapter 2', lesson: 'Lesson: Limit', color: '#5CA8F2' },
  { id: 3, name: 'Chapter 3', lesson: 'Lesson: Limit', color: '#2F6FD4' },
  { id: 4, name: 'Chapter 4', lesson: 'Lesson: Limit', color: '#78B4F6' },
];

export default function Quiz() {
  const navigate = useNavigate();
  const weeklyGoal = 70;
  const completedToday = 2;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #f4f8ff 0%, #eef4ff 100%)',
      }}
    >
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box
          sx={{
            backgroundColor: '#fff',
            borderLeft: '6px solid #3D86E8',
            borderRadius: 3,
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            p: 3,
            mb: 3,
          }}
        >
          <Typography sx={{ color: '#7d8ca3', fontSize: 12, letterSpacing: 1, fontWeight: 700 }}>
            QUIZ HUB
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              textAlign: 'left',
              color: '#1F2937',
            }}
          >
            Quiz Time
          </Typography>

          <Typography sx={{ color: '#5f6c80', mb: 2 }}>
            Complete quick rounds, keep your streak, and level up your score.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' }, gap: 2 }}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#F5FAFF', border: '1px solid #D8E8FF' }}>
              <Typography sx={{ fontSize: 12, color: '#6e8099', fontWeight: 700, mb: 0.5 }}>
                Weekly challenge
              </Typography>
              <Typography sx={{ fontWeight: 800, color: '#1F2937', mb: 1 }}>
                Reach {weeklyGoal}% average score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, weeklyGoal)}
                sx={{
                  height: 8,
                  borderRadius: 99,
                  backgroundColor: '#DCEBFF',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#3D86E8' },
                }}
              />
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#F8FBFF', border: '1px solid #D8E8FF' }}>
              <Typography sx={{ fontSize: 12, color: '#6e8099', fontWeight: 700 }}>
                Today
              </Typography>
              <Typography sx={{ fontSize: 28, lineHeight: 1.1, fontWeight: 900, color: '#2F6FC0' }}>
                {completedToday}
              </Typography>
              <Typography sx={{ color: '#5f6c80', fontSize: 13 }}>
                quizzes completed
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'left',
            color: '#1F2937',
            fontSize: 24,
          }}
        >
          Pick a chapter
        </Typography>

        {/* ✅ HAMBURGER / LIST STYLE */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {quizChapters.map((chapter) => (
            <Card
              key={chapter.id}
              onClick={() => navigate(`/quiz/paper/${chapter.id}`)}
              sx={{
                backgroundColor: '#fff',
                borderLeft: `6px solid ${chapter.color}`,
                borderRadius: '12px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
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
                      color: '#1F2937',
                      fontSize: '15px',
                      mb: 0.5,
                    }}
                  >
                    {chapter.name}
                  </Typography>

                  <Typography sx={{ fontSize: '13px', color: '#5f6c80' }}>
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
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import chapterIcon from '../../assets/glasses on books.png';

const lessons = [
  {
    id: 1,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#B9F2A4',
    textColor: '#2B2B2B',
  },
  {
    id: 2,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#F8F1A6',
    textColor: '#2B2B2B',
  },
  {
    id: 3,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#D9D5FF',
    textColor: '#2B2B2B',
  },
  {
    id: 4,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#F8E0EC',
    textColor: '#2B2B2B',
  },
  {
    id: 5,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#F7D0C3',
    textColor: '#2B2B2B',
  },
  {
    id: 6,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#BFE5FB',
    textColor: '#2B2B2B',
  },
  {
    id: 7,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#E5F0DA',
    textColor: '#2B2B2B',
  },
  {
    id: 8,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#FBE3B6',
    textColor: '#2B2B2B',
  },
  {
    id: 9,
    description: 'the quick fox jumps over the lazy dog',
    accent: '#E2C7F4',
    textColor: '#2B2B2B',
  },
];

export default function Lesson() {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pt: 6, pb: 10 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
        <Box
          component="img"
          src={chapterIcon}
          alt="Chapter icon"
          sx={{ width: { xs: 48, md: 60 }, height: 'auto' }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#3D86E8',
            fontSize: { xs: '2rem', md: '3rem' },
            lineHeight: 1,
          }}
        >
          Chapter : 1
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {lessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson.id}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: lesson.accent,
                borderRadius: 2,
                minHeight: 118,
                px: 1,
                py: 0.5,
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: lesson.textColor,
                    mb: 1,
                    textTransform: 'lowercase',
                  }}
                >
                  <Box component="span" sx={{ color: '#8E63FF', mr: 1, fontWeight: 700 }}>
                    ›
                  </Box>
                  {lesson.description}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6D6D6D', lineHeight: 1.4, mb: 2 }}>
                  Things on a very small scale behave like nothing
                </Typography>
                <Button
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
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
                  View detail →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#3D86E8',
            color: '#3D86E8',
            borderRadius: 999,
            px: 4,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': {
              borderColor: '#2D6FC0',
              backgroundColor: 'rgba(61, 134, 232, 0.06)',
            },
          }}
        >
          Select more
        </Button>
      </Box>
    </Box>
  );
}

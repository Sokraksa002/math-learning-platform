import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function LessonDetail() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7FAFF', py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            border: '1px solid #E3ECF8',
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="overline" sx={{ color: '#3D86E8', fontWeight: 700 }}>
            Lesson detail
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1F2937', mt: 1, mb: 2 }}>
            Lesson {lessonId}
          </Typography>
          <Typography sx={{ color: '#5B6472', mb: 4, lineHeight: 1.8 }}>
            This page is ready for your lesson content. You can replace this text with the actual notes,
            exercises, or media for the selected lesson.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/chapter')}
            sx={{
              backgroundColor: '#3D86E8',
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              '&:hover': { backgroundColor: '#2F6FC0' },
            }}
          >
            Back to chapter
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

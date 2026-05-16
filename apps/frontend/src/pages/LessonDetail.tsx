import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const COMPLETED_LESSON_STORAGE_KEY = 'math-learning-completed-lessons';

const markLessonCompleted = (lessonId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const rawValue = window.localStorage.getItem(COMPLETED_LESSON_STORAGE_KEY);
    const currentLessonIds = rawValue ? JSON.parse(rawValue) : [];
    const updatedLessonIds = Array.isArray(currentLessonIds) ? currentLessonIds : [];

    if (!updatedLessonIds.includes(lessonId)) {
      updatedLessonIds.push(lessonId);
      window.localStorage.setItem(COMPLETED_LESSON_STORAGE_KEY, JSON.stringify(updatedLessonIds));
    }
  } catch {
    window.localStorage.setItem(COMPLETED_LESSON_STORAGE_KEY, JSON.stringify([lessonId]));
  }
};

export default function LessonDetail() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  useEffect(() => {
    const parsedLessonId = Number(lessonId);

    if (Number.isFinite(parsedLessonId)) {
      markLessonCompleted(parsedLessonId);
    }
  }, [lessonId]);

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

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{ px: 2, py: 1, borderRadius: 999, backgroundColor: '#EAF2FF', color: '#2563EB', fontWeight: 700 }}>
              Lesson marked complete
            </Box>
            <Box sx={{ px: 2, py: 1, borderRadius: 999, backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
              Complete all lessons to unlock the certificate
            </Box>
          </Stack>

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

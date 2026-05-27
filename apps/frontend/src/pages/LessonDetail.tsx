import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';
import { getLesson, getLessonExercises } from '../utils/api';
import { isLoggedIn } from '../utils/auth';
import { isValidUuid } from '../utils/validators';

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

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<any | null>(null);
  const [exerciseCount, setExerciseCount] = useState<number>(0);
  const { locale } = useLocale();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      if (!lessonId) return;

      if (!isValidUuid(lessonId)) {
        // don't call backend with an invalid id
        setLesson(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getLesson(lessonId);
        const ex = await getLessonExercises(lessonId).catch(() => ({ count: 0, ids: [] }));

        if (!mounted) return;
        setLesson(data ?? null);
        setExerciseCount(ex?.count ?? 0);

        // mark completed (legacy local storage) — only if numeric id
        const parsedLessonId = Number(lessonId);
        if (Number.isFinite(parsedLessonId)) markLessonCompleted(parsedLessonId);
      } catch (e) {
        if (!mounted) return;
        setLesson(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
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
          {loading ? (
            <Typography>Loading...</Typography>
          ) : !lesson ? (
            <Typography>No lesson found.</Typography>
          ) : (
            <>
              <Typography variant="overline" sx={{ color: '#3D86E8', fontWeight: 700 }}>
                Lesson detail
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#1F2937', mt: 1, mb: 2 }}>
                {(() => {
                  const raw = lesson.title ?? lesson.fallbackTitle ?? `Lesson ${lessonId}`;
                  if (typeof raw === 'object') return raw?.[locale] ?? raw?.en ?? raw?.km ?? `Lesson ${lessonId}`;
                  return String(raw);
                })()}
              </Typography>

              <Typography sx={{ color: '#5B6472', mb: 4, lineHeight: 1.8 }}>
                {(() => {
                  const content = lesson.contentJson ?? null;
                  if (!content) return 'No content available for this lesson.';
                  // localized: check content[locale], content.summary, content.html
                  try {
                    if (typeof content === 'string') return content;
                    if (content[locale]) {
                      const v = content[locale];
                      if (typeof v === 'string') return v;
                      if (v.html) return <span dangerouslySetInnerHTML={{ __html: String(v.html) }} />;
                      if (v.paragraphs) return v.paragraphs.join('\n\n');
                      if (v.summary) return String(v.summary);
                    }

                    if (content.html) {
                      // html might be object with locales or a string
                      if (typeof content.html === 'object') {
                        const html = content.html[locale] ?? content.html.en ?? content.html.km ?? null;
                        if (html) return <span dangerouslySetInnerHTML={{ __html: String(html) }} />;
                      } else return <span dangerouslySetInnerHTML={{ __html: String(content.html) }} />;
                    }

                    if (content.summary && typeof content.summary === 'object') return String(content.summary[locale] ?? content.summary.en ?? content.summary.km ?? '').replace(/\n/g, '\n');
                    if (content.summary && typeof content.summary === 'string') return content.summary;
                    if (content.paragraphs && Array.isArray(content.paragraphs)) return content.paragraphs.join('\n\n');
                    return JSON.stringify(content).slice(0, 400);
                  } catch (e) {
                    return 'No content available for this lesson.';
                  }
                })()}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 4 }}>
                <Box sx={{ px: 2, py: 1, borderRadius: 999, backgroundColor: '#EAF2FF', color: '#2563EB', fontWeight: 700 }}>
                  Lesson marked complete
                </Box>
                <Box sx={{ px: 2, py: 1, borderRadius: 999, backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                  Complete all lessons to unlock the certificate
                </Box>
              </Stack>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{
                    backgroundColor: '#3D86E8',
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3,
                    '&:hover': { backgroundColor: '#2F6FC0' },
                  }}
                >
                  Back to lessons
                </Button>

                {exerciseCount > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (!isLoggedIn()) {
                        navigate(`/login?next=${encodeURIComponent(`/quiz/${lessonId}`)}`);
                        return;
                      }
                      navigate(`/quiz/${lessonId}`);
                    }}
                    sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
                  >
                    Start Quiz ({exerciseCount})
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

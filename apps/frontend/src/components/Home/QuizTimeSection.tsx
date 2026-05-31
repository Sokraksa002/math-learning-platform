import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';
import { getQuizLessons, type QuizLessonSummary } from '../../utils/api';

interface QuizCard {
  id: string;
  title: string;
  accent: string;
  exerciseCount: number;
}

const SUBJECT_TITLE_MAP: Record<string, { en: string; km: string }> = {
  'grade12-complex': {
    en: 'Lesson 1 - Complex Numbers',
    km: 'មេរៀនទី 1 - ចំនួនកុំផ្លិច',
  },
  'grade12-conics': {
    en: 'Lesson 2 - Conic Sections',
    km: 'មេរៀនទី 2 - កោនិក',
  },
  'grade12-derivatives': {
    en: 'Lesson 3 - Derivatives',
    km: 'មេរៀនទី 3 - ដេរីវេ',
  },
  'grade12-differential': {
    en: 'Lesson 4 - Differential Equations',
    km: 'មេរៀនទី 4 - សមីការឌីផេរ៉ង់ស្យែល',
  },
  'grade12-functions': {
    en: 'Lesson 5 - Functions',
    km: 'មេរៀនទី 5 - អនុគមន៍',
  },
  'grade12-integrals': {
    en: 'Lesson 6 - Integrals',
    km: 'មេរៀនទី 6 - អាំងតេក្រាល',
  },
  'grade12-limits': {
    en: 'Lesson 7 - Limits',
    km: 'មេរៀនទី 7 - លីមីត',
  },
  'grade12-probability': {
    en: 'Lesson 8 - Probability',
    km: 'មេរៀនទី 8 - ប្រូបាប៊ីលីតេ',
  },
};

const getTitleFromSubject = (subject: string, fallbackTitle: string, locale: string): string => {
  const mapped = SUBJECT_TITLE_MAP[subject];
  if (!mapped) return fallbackTitle;
  return locale === 'km' ? mapped.km : mapped.en;
};

export default function QuizTimeSection() {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const [quizLessons, setQuizLessons] = useState<QuizLessonSummary[]>([]);

  useEffect(() => {
    let mounted = true;

    getQuizLessons()
      .then((rows) => {
        if (!mounted) return;
        setQuizLessons(rows);
      })
      .catch((err) => {
        console.error('Failed to load quiz lessons', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const quizzes: QuizCard[] = useMemo(
    () =>
      [...quizLessons]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .slice(0, 4)
        .map((lesson, index) => ({
          id: lesson.lessonId,
          title: getTitleFromSubject(lesson.subject, lesson.title, locale),
          accent: ['#3D86E8', '#5CA8F2', '#2F6FD4', '#78B4F6'][index % 4],
          exerciseCount: lesson.exerciseCount,
        })),
    [quizLessons, locale],
  );

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
        <Typography sx={{ color: '#6B7280', mb: 3, mt: -2 }}>
          {locale === 'km'
            ? 'ជ្រើសរើសមេរៀនសំណួរដើម្បីចាប់ផ្តើមការហាត់និងចូលទៅកាន់កម្រងសំណួរ​ពិត។'
            : 'Choose a lesson to practice and jump straight into the real quiz flow.'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {quizzes.map((quiz) => (
            <Box
              key={quiz.id}
              onClick={() => navigate(`/quiz/paper/${quiz.id}`)}
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
                gap: 2,
                transition: 'all 0.2s ease',
                boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 22px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#161a1d' }}>
                  {quiz.title}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.5 }}>
                  {locale === 'km'
                    ? `${quiz.exerciseCount} លំហាត់`
                    : `${quiz.exerciseCount} exercise${quiz.exerciseCount !== 1 ? 's' : ''}`}
                </Typography>
              </Box>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/quiz/paper/${quiz.id}`);
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
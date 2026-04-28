import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

interface QuizOption {
  id: string;
  label: string;
  text: string;
  color: string;
}

interface QuizQuestion {
  id: number;
  prompt: string;
  equation: string;
  options: QuizOption[];
  answerId: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'Find the limit of f(x) as x approaches 1.',
    equation: 'f(x) = ln((3x + 1) / (x - 1))',
    options: [
      { id: 'a', label: 'A.', text: 'In3', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: 'ln2', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '-1', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '0', color: '#FFF1C9' },
    ],
    answerId: 'a',
  },
  {
    id: 2,
    prompt: 'What is the derivative of x^2?',
    equation: 'd/dx (x^2)',
    options: [
      { id: 'a', label: 'A.', text: 'x', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '2x', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: 'x^2', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '2', color: '#FFF1C9' },
    ],
    answerId: 'b',
  },
  {
    id: 3,
    prompt: 'Evaluate the limit as x approaches 0.',
    equation: 'lim(x -> 0) sin(x) / x',
    options: [
      { id: 'a', label: 'A.', text: '0', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '1', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: 'Infinity', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '-1', color: '#FFF1C9' },
    ],
    answerId: 'b',
  },
  {
    id: 4,
    prompt: 'What is 2 + 2?',
    equation: 'Simple arithmetic',
    options: [
      { id: 'a', label: 'A.', text: '1', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '2', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '4', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '5', color: '#FFF1C9' },
    ],
    answerId: 'c',
  },
  {
    id: 5,
    prompt: 'Find the limit as x approaches 2.',
    equation: 'lim(x -> 2) x + 3',
    options: [
      { id: 'a', label: 'A.', text: '4', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '5', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '6', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '3', color: '#FFF1C9' },
    ],
    answerId: 'b',
  },
  {
    id: 6,
    prompt: 'What is the integral of 1 dx?',
    equation: '∫ 1 dx',
    options: [
      { id: 'a', label: 'A.', text: 'x + C', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '1 + C', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '0', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: 'x^2 + C', color: '#FFF1C9' },
    ],
    answerId: 'a',
  },
  {
    id: 7,
    prompt: 'Solve for the slope of y = 3x.',
    equation: 'Slope',
    options: [
      { id: 'a', label: 'A.', text: '1', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '2', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '3', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '0', color: '#FFF1C9' },
    ],
    answerId: 'c',
  },
  {
    id: 8,
    prompt: 'What is the square root of 81?',
    equation: 'sqrt(81)',
    options: [
      { id: 'a', label: 'A.', text: '7', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '8', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '9', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '10', color: '#FFF1C9' },
    ],
    answerId: 'c',
  },
  {
    id: 9,
    prompt: 'What is 10 / 2?',
    equation: 'Simple arithmetic',
    options: [
      { id: 'a', label: 'A.', text: '2', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '4', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '5', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '6', color: '#FFF1C9' },
    ],
    answerId: 'c',
  },
  {
    id: 10,
    prompt: 'What is the value of pi rounded?',
    equation: 'π',
    options: [
      { id: 'a', label: 'A.', text: '2.14', color: '#D9F7C6' },
      { id: 'b', label: 'B.', text: '3.14', color: '#E8D5FF' },
      { id: 'c', label: 'C.', text: '4.14', color: '#FFE0D6' },
      { id: 'd', label: 'D.', text: '5.14', color: '#FFF1C9' },
    ],
    answerId: 'b',
  },
];

const QUESTION_TIME = 15;

export default function Quizepaper() {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME);
  const [finished, setFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;

  const handleNextQuestion = useCallback(() => {
    if (currentIndex >= totalQuestions - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  }, [currentIndex, totalQuestions]);

  useEffect(() => {
    if (finished) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setSecondsLeft(QUESTION_TIME);
      setSelectedAnswer(null);
    }, 0);

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => {
      window.clearTimeout(resetTimer);
      window.clearInterval(interval);
    };
  }, [currentIndex, finished]);

  useEffect(() => {
    if (!finished && secondsLeft === 0) {
      const nextTimer = window.setTimeout(() => {
        handleNextQuestion();
      }, 0);

      return () => window.clearTimeout(nextTimer);
    }
  }, [secondsLeft, finished, handleNextQuestion]);

  const progress = useMemo(() => `${currentIndex + 1}/${totalQuestions}`, [currentIndex, totalQuestions]);

  const handleAnswer = (answerId: string) => {
    if (selectedAnswer || finished) {
      return;
    }

    setSelectedAnswer(answerId);

    if (answerId === currentQuestion.answerId) {
      setScore((value) => value + 1);
    }

    window.setTimeout(() => {
      handleNextQuestion();
    }, 700);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setSecondsLeft(QUESTION_TIME);
    setFinished(false);
  };

  const timerPercent = (secondsLeft / QUESTION_TIME) * 100;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC', py: 4 }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography sx={{ color: '#3D86E8', fontSize: 28, fontWeight: 800 }}>Kanit</Typography>
          <Typography sx={{ fontWeight: 700, color: '#111827' }}>Quiz {chapterId}</Typography>
          <Button onClick={() => navigate('/quiz')} sx={{ textTransform: 'none', color: '#3D86E8', fontWeight: 700 }}>
            Back
          </Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 700, md: 430 },
            borderRadius: 6,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
            boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(180deg, #69A8E7 0%, #5F9EE3 100%)',
              position: 'relative',
              minHeight: { xs: 220, md: 'auto' },
            }}
          >
            <IconButton
              onClick={() => navigate('/quiz')}
              sx={{ position: 'absolute', top: 16, left: 16, color: '#fff' }}
            >
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ backgroundColor: '#fff', px: { xs: 2.5, md: 5 }, py: { xs: 3, md: 4 } }}>
            {!finished ? (
              <>
                <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      border: '6px solid #8FCBE8',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#3D86E8',
                      fontWeight: 800,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: -6,
                        borderRadius: '50%',
                        background: `conic-gradient(#3D86E8 ${timerPercent}%, #E5EEF7 ${timerPercent}% 100%)`,
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))',
                      }}
                    />
                    <Typography sx={{ position: 'relative', zIndex: 1, fontSize: 16 }}>{progress}</Typography>
                  </Box>
                </Stack>

                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827', mb: 1.5, lineHeight: 1.6 }}>
                  {currentQuestion.prompt}
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#374151', mb: 3, fontWeight: 600 }}>
                  {currentQuestion.equation}
                </Typography>

                <Stack spacing={1.5}>
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedAnswer === option.id;
                    const isCorrect = option.id === currentQuestion.answerId;
                    const showCorrect = selectedAnswer !== null && isCorrect;
                    const showWrong = isSelected && !isCorrect;

                    return (
                      <Button
                        key={option.id}
                        onClick={() => handleAnswer(option.id)}
                        disabled={selectedAnswer !== null || finished}
                        fullWidth
                        variant="outlined"
                        sx={{
                          justifyContent: 'space-between',
                          px: 2,
                          py: 1.25,
                          borderRadius: 999,
                          textTransform: 'none',
                          backgroundColor: showCorrect ? '#DAF7C8' : option.color,
                          borderColor: showCorrect ? '#69C67A' : showWrong ? '#E08B8B' : '#D8DCE6',
                          color: '#1F2937',
                          '&:hover': {
                            backgroundColor: showCorrect ? '#DAF7C8' : option.color,
                            borderColor: '#3D86E8',
                          },
                        }}
                      >
                        <Box sx={{ fontWeight: 800, fontSize: 13 }}>{`${option.label} ${option.text}`}</Box>
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: '2px solid #6B7280',
                            backgroundColor: isSelected ? '#3D86E8' : 'transparent',
                          }}
                        />
                      </Button>
                    );
                  })}
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                  <Typography sx={{ color: '#6B7280', fontSize: 13 }}>Score: {score}</Typography>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    sx={{
                      color: '#3D86E8',
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: 36,
                      minWidth: 'auto',
                      p: 0,
                      lineHeight: 1,
                    }}
                  >
                    →
                  </Button>
                </Stack>
              </>
            ) : (
              <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', textAlign: 'center' }} spacing={2}>
                <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Quiz finished</Typography>
                <Typography sx={{ fontSize: 18, color: '#374151' }}>
                  Your score is {score} / {totalQuestions}
                </Typography>
                <Button
                  onClick={resetQuiz}
                  variant="contained"
                  sx={{
                    backgroundColor: '#3D86E8',
                    textTransform: 'none',
                    borderRadius: 999,
                    px: 3,
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#2F6FC0' },
                  }}
                >
                  Try again
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

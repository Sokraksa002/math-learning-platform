import { Box, Button, Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

/* =========================
   TYPES
========================= */
interface QuizOption {
  id: string;
  label: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  prompt: string;
  equation?: string;
  options: QuizOption[];
  answerId: string;
}

/* =========================
   MOCK QUESTIONS (10)
   👉 Replace later with API
========================= */
const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'What is the limit as x → 0?',
    equation: 'sin(x) / x',
    options: [
      { id: 'a', label: 'A.', text: '0' },
      { id: 'b', label: 'B.', text: '1' },
      { id: 'c', label: 'C.', text: '∞' },
      { id: 'd', label: 'D.', text: '-1' },
    ],
    answerId: 'b',
  },
  {
    id: 2,
    prompt: 'Derivative of x² is?',
    options: [
      { id: 'a', label: 'A.', text: 'x' },
      { id: 'b', label: 'B.', text: '2x' },
      { id: 'c', label: 'C.', text: 'x²' },
      { id: 'd', label: 'D.', text: '2' },
    ],
    answerId: 'b',
  },
  {
    id: 3,
    prompt: 'Solve: 2x + 4 = 10',
    options: [
      { id: 'a', label: 'A.', text: '2' },
      { id: 'b', label: 'B.', text: '3' },
      { id: 'c', label: 'C.', text: '4' },
      { id: 'd', label: 'D.', text: '6' },
    ],
    answerId: 'c',
  },
  {
    id: 4,
    prompt: 'Integral of 1 dx?',
    options: [
      { id: 'a', label: 'A.', text: '1' },
      { id: 'b', label: 'B.', text: 'x' },
      { id: 'c', label: 'C.', text: 'x²' },
      { id: 'd', label: 'D.', text: 'ln x' },
    ],
    answerId: 'b',
  },
  {
    id: 5,
    prompt: 'What is π approximately?',
    options: [
      { id: 'a', label: 'A.', text: '2.14' },
      { id: 'b', label: 'B.', text: '3.14' },
      { id: 'c', label: 'C.', text: '1.14' },
      { id: 'd', label: 'D.', text: '4.14' },
    ],
    answerId: 'b',
  },
  {
    id: 6,
    prompt: 'Derivative of sin(x)?',
    options: [
      { id: 'a', label: 'A.', text: 'cos(x)' },
      { id: 'b', label: 'B.', text: '-cos(x)' },
      { id: 'c', label: 'C.', text: 'tan(x)' },
      { id: 'd', label: 'D.', text: 'x' },
    ],
    answerId: 'a',
  },
  {
    id: 7,
    prompt: 'Solve: x² = 9',
    options: [
      { id: 'a', label: 'A.', text: '3 only' },
      { id: 'b', label: 'B.', text: '-3 only' },
      { id: 'c', label: 'C.', text: '±3' },
      { id: 'd', label: 'D.', text: '0' },
    ],
    answerId: 'c',
  },
  {
    id: 8,
    prompt: 'What is 2³?',
    options: [
      { id: 'a', label: 'A.', text: '6' },
      { id: 'b', label: 'B.', text: '8' },
      { id: 'c', label: 'C.', text: '9' },
      { id: 'd', label: 'D.', text: '4' },
    ],
    answerId: 'b',
  },
  {
    id: 9,
    prompt: 'Slope of y = 3x?',
    options: [
      { id: 'a', label: 'A.', text: '1' },
      { id: 'b', label: 'B.', text: '2' },
      { id: 'c', label: 'C.', text: '3' },
      { id: 'd', label: 'D.', text: '0' },
    ],
    answerId: 'c',
  },
  {
    id: 10,
    prompt: 'What is √16?',
    options: [
      { id: 'a', label: 'A.', text: '2' },
      { id: 'b', label: 'B.', text: '3' },
      { id: 'c', label: 'C.', text: '4' },
      { id: 'd', label: 'D.', text: '5' },
    ],
    answerId: 'c',
  },
];

/* =========================
   COMPONENT
========================= */
export default function QuizPaper() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const percentage = (score / total) * 100;

  const handleSelect = (id: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(id);

    if (id === question.answerId) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (currentIndex === total - 1) {
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
      }
    }, 600);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F4F6FB', py: 8 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: 4,
            p: 5,
            boxShadow: '0 12px 25px rgba(0,0,0,0.05)',
          }}
        >
          {!finished ? (
            <>
              {/* HEADER */}
              <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                Quiz – Chapter {chapterId}
              </Typography>

              <Typography sx={{ fontSize: 13, color: '#888', mb: 3 }}>
                Question {currentIndex + 1} / {total}
              </Typography>

              {/* QUESTION */}
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                {question.prompt}
              </Typography>

              {/* OPTIONS */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {question.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  const isCorrect = opt.id === question.answerId;
                  const show = selectedAnswer !== null;

                  let borderColor = '#E5E7EB';
                  let bgColor = '#FFFFFF';

                  if (show && isCorrect) {
                    borderColor = '#4CAF50';
                    bgColor = '#ECFDF5';
                  }

                  if (show && isSelected && !isCorrect) {
                    borderColor = '#F97316';
                    bgColor = '#FFF7ED';
                  }

                  return (
                    <Box
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      sx={{
                        border: `2px solid ${borderColor}`,
                        borderRadius: 3,
                        px: 3,
                        py: 2,
                        backgroundColor: bgColor,
                        cursor: show ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',

                        /* ✅ HOVER EFFECT */
                        '&:hover': {
                          backgroundColor: show ? bgColor : 'transparent',
                          borderColor: '#6366F1',
                          transform: show ? 'none' : 'scale(1.02)',
                        },
                      }}
                    >
                      <strong>{opt.label}</strong> {opt.text}
                    </Box>
                  );
                })}
              </Box>
            </>
          ) : (
            /* ✅ RESULT */
            <Box textAlign="center">
              <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 2 }}>
                🎉 Quiz Finished
              </Typography>

              <Typography sx={{ mb: 2 }}>
                Score: {score} / {total} ({percentage.toFixed(1)}%)
              </Typography>

              {percentage >= 80 ? (
                <Button
                  onClick={() => navigate(`/certificate/${chapterId}`)}
                  sx={{
                    backgroundColor: '#6366F1',
                    color: '#fff',
                    borderRadius: 2,
                    px: 4,
                    '&:hover': { backgroundColor: '#4F46E5' },
                  }}
                >
                  🎓 View Certificate
                </Button>
              ) : (
                <Typography sx={{ color: '#F97316', mt: 2 }}>
                  Score at least 80% to unlock certificate 💪
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
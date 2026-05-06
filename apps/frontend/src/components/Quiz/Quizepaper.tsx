import { Box, Button, Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    prompt: 'What is the limit as x → 0?',
    equation: 'sin(x) / x',
    options: [
      { id: 'a', label: 'A.', text: '0', color: '#A8D5BA' },
      { id: 'b', label: 'B.', text: '1', color: '#74B9FF' },
      { id: 'c', label: 'C.', text: '∞', color: '#FFD4A3' },
      { id: 'd', label: 'D.', text: '-1', color: '#D8B9F9' },
    ],
    answerId: 'b',
  },
];

export default function QuizPaper() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;

  if (!currentQuestion && !finished) return null;

  const handleAnswer = (answerId: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answerId);

    if (answerId === currentQuestion.answerId) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex === totalQuestions - 1) {
        setFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      }
    }, 600);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC', py: 8 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          }}
        >
          {!finished ? (
            <>
              {/* Header */}
              <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 1 }}>
                Quiz – Chapter {chapterId}
              </Typography>

              <Typography sx={{ fontSize: 14, color: '#666', mb: 3 }}>
                Question {currentIndex + 1} / {totalQuestions}
              </Typography>

              {/* Question */}
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                {currentQuestion.prompt}
              </Typography>

              <Typography sx={{ fontSize: 14, color: '#555', mb: 3 }}>
                {currentQuestion.equation}
              </Typography>

              {/* Options */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === currentQuestion.answerId;
                  const showResult = selectedAnswer !== null;

                  let bgColor = option.color;
                  if (showResult && isCorrect) bgColor = '#A8D5BA';
                  if (showResult && isSelected && !isCorrect) bgColor = '#FFD4A3';

                  return (
                    <Box
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      sx={{
                        backgroundColor: bgColor,
                        borderRadius: 2,
                        px: 3,
                        py: 2,
                        cursor: showResult ? 'default' : 'pointer',
                        fontWeight: 600,
                        transition: '0.2s',
                        opacity:
                          showResult && !isSelected && !isCorrect ? 0.6 : 1,
                        '&:hover': {
                          transform: showResult ? 'none' : 'translateY(-2px)',
                        },
                      }}
                    >
                      {option.label} {option.text}
                    </Box>
                  );
                })}
              </Box>
            </>
          ) : (
            /* ✅ FINISHED SCREEN (NO TRY AGAIN) */
            <Box textAlign="center">
              <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 2 }}>
                Quiz finished
              </Typography>

              <Typography sx={{ fontSize: 16, mb: 4 }}>
                Your score is {score} / {totalQuestions}
              </Typography>

              <Button
                onClick={() => navigate(`/certificate/${chapterId}`)}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#3D86E8',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 4,
                  mb: 2,
                  '&:hover': { backgroundColor: '#2F6FC0' },
                }}
              >
                View Certificate
              </Button>

              <br />

              <Button
                onClick={() => setShowAnswers(true)}
                sx={{ textTransform: 'none', fontWeight: 600, mb: 1 }}
              >
                View Answers
              </Button>

              <br />

              <Button
                onClick={() => navigate('/quiz')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Back
              </Button>
            </Box>
          )}

          {/* ✅ ANSWER REVIEW */}
          {finished && showAnswers && (
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Correct Answers
              </Typography>

              {QUESTIONS.map((q, index) => (
                <Typography key={q.id} sx={{ fontSize: 14, mb: 1 }}>
                  {index + 1}. {q.answerId.toUpperCase()}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

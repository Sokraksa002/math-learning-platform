import { useEffect, useState } from "react";
import { getProgress } from "../../utils/api"; // ✅ FIXED PATH
import {
  Box,
  Typography,
  LinearProgress,
  Button,
} from "@mui/material";
import type { NavigateFunction } from "react-router-dom";
/* ✅ TYPE */
type Props = {
  navigate: NavigateFunction;
};

const getMessage = (score: number) => {
  if (score >= 80) return "🔥 Excellent!";
  if (score >= 60) return "💪 Keep pushing!";
  return "📚 Keep practicing!";
};

export default function QuizHeader({ navigate }: Props) {
  const [progress, setProgress] = useState({
    completedLessons: 0,
    score: 0,
  });

  useEffect(() => {
    getProgress()
      .then((res: { completedLessons: number; score: number }) =>
        setProgress(res)
      )
      .catch(() => {
        setProgress({ completedLessons: 0, score: 0 });
      });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderLeft: "5px solid #4F9CF9",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        p: 3,
        mb: 4,
      }}
    >
      <Typography sx={{ color: "#9aa6b2", fontSize: 12 }}>
        QUIZ DASHBOARD
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Welcome Back 👋
      </Typography>

      <Typography sx={{ color: "#6b7280", mb: 2 }}>
        {getMessage(progress.score)}
      </Typography>

      <Box mb={2}>
        <Typography fontSize={13}>
          Weekly Progress ({progress.score}%)
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress.score}
          sx={{ height: 8, borderRadius: 5, mt: 1 }}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          background: "#f8fbff",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box>
          <Typography fontSize={12}>Completed</Typography>
          <Typography fontWeight="bold" fontSize={18}>
            {progress.completedLessons}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12}>Score</Typography>
          <Typography fontWeight="bold" fontSize={18}>
            {progress.score}%
          </Typography>
        </Box>
      </Box>

      <Box mt={2} display="flex" gap={1}>
        <Button
          variant="contained"
          onClick={() => navigate("/quiz-history")}
        >
          History
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/ability")}
        >
          Stats
        </Button>
      </Box>
    </Box>
  );
}
import { useEffect, useState } from "react";
import { getProgress } from "../../utils/api"; // ✅ FIXED PATH
import {
  Box,
  Typography,
  LinearProgress,
  Button,
} from "@mui/material";
import type { NavigateFunction } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
/* ✅ TYPE */
type Props = {
  navigate: NavigateFunction;
};

const getMessage = (averageScore: number, locale: string) => {
  if (locale === "km") {
    if (averageScore >= 80) return "🔥 ល្អណាស់!";
    if (averageScore >= 60) return "💪 បន្តខិតខំ!";
    return "📚 បន្តអនុវត្ត!";
  }

  if (averageScore >= 80) return "🔥 Excellent!";
  if (averageScore >= 60) return "💪 Keep pushing!";
  return "📚 Keep practicing!";
};

export default function QuizHeader({ navigate }: Props) {
  const { locale } = useLocale();
  const [progress, setProgress] = useState({
    totalLessons: 0,
    completedLessons: 0,
    progressPercent: 0,
    totalQuizzes: 0,
    averageScore: 0,
  });

  useEffect(() => {
    getProgress()
      .then((res) => setProgress(res))
      .catch(() => {
        setProgress({
          totalLessons: 0,
          completedLessons: 0,
          progressPercent: 0,
          totalQuizzes: 0,
          averageScore: 0,
        });
      });
  }, []);

  const progressValue = Number.isFinite(progress.progressPercent)
    ? progress.progressPercent
    : 0;

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
        {locale === "km" ? "ផ្ទាំងគ្រប់គ្រងកម្រងសំណួរ" : "QUIZ DASHBOARD"}
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {locale === "km" ? "សូមស្វាគមន៍ត្រឡប់មកវិញ 👋" : "Welcome Back 👋"}
      </Typography>

      <Typography sx={{ color: "#6b7280", mb: 2 }}>
        {getMessage(progress.averageScore, locale)}
      </Typography>

      <Box mb={2}>
        <Typography fontSize={13}>
          {locale === "km"
            ? `វឌ្ឍនភាពប្រចាំសប្តាហ៍ (${progressValue}%)`
            : `Weekly Progress (${progressValue}%)`}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressValue}
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
          <Typography fontSize={12}>
            {locale === "km" ? "បានបញ្ចប់" : "Completed"}
          </Typography>
          <Typography fontWeight="bold" fontSize={18}>
            {progress.completedLessons}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12}>{locale === "km" ? "ពិន្ទុ" : "Score"}</Typography>
          <Typography fontWeight="bold" fontSize={18}>
            {progress.averageScore}%
          </Typography>
        </Box>
      </Box>

      <Box mt={2} display="flex" gap={1}>
        <Button
          variant="contained"
          onClick={() => navigate("/quiz-history")}
        >
          {locale === "km" ? "ប្រវត្តិ" : "History"}
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/ability")}
        >
          {locale === "km" ? "ចាប់ផ្តើម" : "Start"}
        </Button>
      </Box>
    </Box>
  );
}
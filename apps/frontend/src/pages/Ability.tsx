import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
  Button,
  Alert,
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from "recharts";

import { useLocale } from "../hooks/useLocale";
import { colorPalette } from "../theme/colorPalette";
import { getStudyTime } from "../utils/timeTracking";
import { getQuizHistory } from "../utils/quizHistory";
import { getFlashcardHistory } from "../utils/flashcardHistory";
import { getCertificateEligibility, getProgress } from "../utils/api";

type StudyTime = {
  date: string;
  minutes: number;
};

type QuizHistory = {
  lesson: string;
  lessonId?: string;
  quizTitle?: string;
  chapterTitle?: string;
  score: number;
  date: string;
  totalQuestions?: number;
};

type FlashcardHistory = {
  date: string;
  correct: number;
  total: number;
};

type ProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  totalQuizzes: number;
  averageScore: number;
};

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const getSkillColor = (score: number) => {
  if (score < 50) return "#ef4444";
  if (score < 70) return "#facc15";
  return colorPalette.accent.blue;
};

const getRecommendation = (score: number) => {
  if (score < 50) return "🔴 Review carefully";
  if (score < 80) return "🟡 Practice more";
  return "🟢 Great job!";
};

export default function Ability() {
  const { t } = useLocale();
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [certificateEligible, setCertificateEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  const quizHistoryData = getQuizHistory();
  const flashcards = getFlashcardHistory().filter((f: FlashcardHistory) => {
    return Date.now() - new Date(f.date).getTime() <= THIRTY_DAYS;
  });

  const rawTime: StudyTime[] = getStudyTime();
  const groupedTime: Record<string, number> = {};

  rawTime.forEach((item) => {
    const day = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (!groupedTime[day]) groupedTime[day] = 0;
    groupedTime[day] += item.minutes;
  });

  const timeTrend = Object.entries(groupedTime).map(([day, minutes]) => ({
    day,
    minutes,
  }));

  const quizHistory = quizHistoryData.filter((q: QuizHistory) => {
    return Date.now() - new Date(q.date).getTime() <= SEVEN_DAYS;
  });

  const skillAreas = useMemo(() => {
    const grouped: Record<string, number[]> = {};

    quizHistoryData.forEach(({ lesson, score }) => {
      if (!grouped[lesson]) grouped[lesson] = [];
      grouped[lesson].push(score);
    });

    const entries = Object.entries(grouped);

    if (!entries.length) {
      return [{ name: "No quiz data yet", score: 0 }];
    }

    return entries.map(([lesson, scores]) => ({
      name: lesson,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
  }, [quizHistoryData]);

  const topSkill = useMemo(
    () => skillAreas.reduce((a, b) => (a.score > b.score ? a : b)),
    [skillAreas],
  );

  const weakestSkill = useMemo(
    () => skillAreas.reduce((a, b) => (a.score < b.score ? a : b)),
    [skillAreas],
  );

  const bestScore = quizHistoryData.length
    ? Math.max(...quizHistoryData.map((r) => r.score))
    : 0;

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getProgress().catch(() => ({
        totalLessons: 0,
        completedLessons: 0,
        progressPercent: 0,
        totalQuizzes: 0,
        averageScore: 0,
      })),
      getCertificateEligibility().catch(() => null),
    ])
      .then(([progressData, certificateData]) => {
        if (!mounted) return;

        setProgress(progressData as ProgressSummary);
        setCertificateEligible(Boolean(certificateData?.eligible));
      })
      .catch((err) => {
        if (!mounted) return;

        console.error("Ability data load failed", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const completedLessons = progress?.completedLessons ?? 0;
  const totalLessons = progress?.totalLessons ?? 0;
  const percent = progress?.progressPercent ?? 0;
  const quizCount = progress?.totalQuizzes ?? quizHistoryData.length;

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Paper
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 4,
            background: "#2563eb",
            color: "white",
          }}
        >
          <Typography variant="h5">{t("pages.Ability.my_ability")}</Typography>
          <Typography sx={{ opacity: 0.9, mt: 1 }}>
            Real tracking from completed lessons, quiz sessions, and saved quiz history.
          </Typography>
        </Paper>

        {loading ? <Alert severity="info" sx={{ mb: 3 }}>Loading real progress...</Alert> : null}

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography>Completed Lessons</Typography>
            <Typography fontWeight={800}>{totalLessons ? `${completedLessons} / ${totalLessons}` : completedLessons}</Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography>Best Quiz Score</Typography>
            <Typography>{bestScore}%</Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography>Quizzes Completed</Typography>
            <Typography fontWeight={800}>{quizCount}</Typography>
          </Paper>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={800}>⏱ Learning Time</Typography>

            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={timeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(v) => `${v} mins`} />
                  <Line dataKey="minutes" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={800}>📊 Skills</Typography>

            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={skillAreas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="score">
                    {skillAreas.map((s, i) => (
                      <Cell key={i} fill={getSkillColor(s.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={800} mb={2}>
              📝 Quiz (Last 7 Days)
            </Typography>

            {quizHistory.length === 0 ? (
              <Typography color="text.secondary">No recent quiz activity</Typography>
            ) : (
              <Stack spacing={1.5}>
                {quizHistory.map((q, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f8fafc",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>{q.quizTitle || q.chapterTitle || q.lesson}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(q.date).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        background:
                          q.score < 50
                            ? "#fee2e2"
                            : q.score < 80
                            ? "#fef9c3"
                            : "#dcfce7",
                        color: "#111",
                        fontWeight: 700,
                      }}
                    >
                      {q.score}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={800} mb={2}>
              🧠 Flashcards (Last 30 Days)
            </Typography>

            {flashcards.length === 0 ? (
              <Typography color="text.secondary">No recent flashcard activity</Typography>
            ) : (
              <Stack spacing={1.5}>
                {flashcards.map((f, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontWeight={600}>{new Date(f.date).toLocaleDateString()}</Typography>

                    <Typography color="#2563eb" fontWeight={700}>
                      {f.correct}/{f.total}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={800} mb={2}>
              🚀 Next Steps
            </Typography>

            <Stack spacing={1.5}>
              {skillAreas.map((skill) => (
                <Box
                  key={skill.name}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight={600}>{skill.name}</Typography>

                  <Typography
                    fontWeight={700}
                    color={
                      skill.score < 50
                        ? "error.main"
                        : skill.score < 80
                        ? "warning.main"
                        : "success.main"
                    }
                  >
                    {getRecommendation(skill.score)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            background: certificateEligible
              ? "linear-gradient(135deg,#10b981,#22c55e)"
              : "#f8fafc",
            color: certificateEligible ? "white" : "inherit",
          }}
        >
          <CardContent>
            <Typography fontWeight={800} mb={2}>
              🎓 Certificate
            </Typography>

            {certificateEligible ? (
              <>
                <Typography mb={2}>
                  ✅ Congratulations! You completed all lessons & quizzes
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    background: "white",
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  View Certificate
                </Button>
              </>
            ) : (
              <Typography color="text.secondary">
                Complete all lessons + quizzes to unlock certificate
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
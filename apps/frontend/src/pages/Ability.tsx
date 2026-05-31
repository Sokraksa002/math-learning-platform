import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLocale } from "../hooks/useLocale";
import { colorPalette } from "../theme/colorPalette";
import { getQuizHistory } from "../utils/quizHistory";
import { getCertificateEligibility, getProgress } from "../utils/api";

type ProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  totalQuizzes: number;
  averageScore: number;
};

const getSkillColor = (score: number) => {
  if (score < 50) return "#ef4444";
  if (score < 70) return "#f59e0b";
  return colorPalette.accent.blue;
};

const getRecommendation = (score: number, locale: string) => {
  if (score < 50) return locale === "km" ? "ត្រូវពិនិត្យឡើងវិញ" : "Review carefully";
  if (score < 80) return locale === "km" ? "ត្រូវហ្វឹកហាត់បន្ថែម" : "Practice more";
  return locale === "km" ? "ល្អខ្លាំង" : "Great job";
};

const shortenLessonLabel = (value: string) => {
  const match = value.match(/^Lesson\s*(\d+)\s*-\s*/i);
  if (match) {
    return `L${match[1]}`;
  }

  const slugMatch = value.match(/^grade12-([a-z-]+)(?:-lesson(\d+))?/i);
  if (slugMatch) {
    return slugMatch[2] ? `L${slugMatch[2]}` : slugMatch[1].slice(0, 3).toUpperCase();
  }

  return value.length > 10 ? `${value.slice(0, 10)}…` : value;
};

export default function Ability() {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const isKhmer = locale === "km";

  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [certificateEligible, setCertificateEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  const quizHistoryData = getQuizHistory();

  const groupedSkills: Record<string, number[]> = {};
  quizHistoryData.forEach(({ lesson, score }) => {
    if (!groupedSkills[lesson]) groupedSkills[lesson] = [];
    groupedSkills[lesson].push(score);
  });

  const skillAreas = Object.entries(groupedSkills).length
    ? Object.entries(groupedSkills).map(([lesson, scores]) => ({
        name: lesson,
        score: Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length),
      }))
    : [{ name: isKhmer ? "មិនទាន់មានទិន្នន័យ" : "No quiz data yet", score: 0 }];

  const bestScore = quizHistoryData.length
    ? Math.max(...quizHistoryData.map((record) => record.score))
    : 0;

  const strongestSkill = skillAreas.reduce((best, current) =>
    current.score > best.score ? current : best
  );
  const weakestSkill = skillAreas.reduce((worst, current) =>
    current.score < worst.score ? current : worst
  );

  const chartTickStyle = {
    fill: "#64748b",
    fontSize: 12,
  } as const;

  const chartTooltipStyle = {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
    },
    labelStyle: {
      color: "#0f172a",
      fontWeight: 700,
      marginBottom: 2,
    },
  } as const;

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
  const quizCount = progress?.totalQuizzes ?? quizHistoryData.length;

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)" }}>
      <Box sx={{ maxWidth: 1160, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 5,
            background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #2563eb 100%)",
            color: "white",
            boxShadow: "0 18px 40px rgba(37, 99, 235, 0.22)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
                {isKhmer ? "ផ្ទាំងវឌ្ឍនភាព" : t("pages.Ability.my_ability")}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                {isKhmer ? "តាមដានវឌ្ឍនភាព និងបន្តទៅជំហានបន្ទាប់" : t("pages.Ability.my_ability")}
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 1, maxWidth: 760 }}>
                {isKhmer
                  ? "មើលមេរៀនដែលបានបញ្ចប់ ពិន្ទុកម្រងសំណួរ ពេលវេលាសិក្សា និងជំហានណាដែលគួរបន្តពង្រឹង។"
                  : "Track completed lessons, quiz performance, study time, and the next best action to keep moving forward."}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                onClick={() => navigate("/chapter")}
                sx={{
                  background: "white",
                  color: "#1d4ed8",
                  fontWeight: 800,
                  "&:hover": { background: "#f8fafc" },
                }}
              >
                {isKhmer ? "បន្តរៀន" : "Continue learning"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/quiz-history")}
                sx={{
                  borderColor: "rgba(255,255,255,0.7)",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": { borderColor: "white", background: "rgba(255,255,255,0.08)" },
                }}
              >
                {isKhmer ? "មើលកម្រងសំណួរ" : "Review quizzes"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {loading ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {isKhmer ? "កំពុងផ្ទុកវឌ្ឍនភាព..." : "Loading progress..."}
          </Alert>
        ) : null}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {isKhmer ? "មេរៀនដែលបានបញ្ចប់" : "Completed lessons"}
            </Typography>
            <Typography fontWeight={800} variant="h5" sx={{ mt: 0.5 }}>
              {totalLessons ? `${completedLessons} / ${totalLessons}` : completedLessons}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {isKhmer ? "ពិន្ទុល្អបំផុត" : "Best score"}
            </Typography>
            <Typography fontWeight={800} variant="h5" sx={{ mt: 0.5 }}>
              {bestScore}%
            </Typography>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #dbeafe", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)" }}>
            <Typography color="text.secondary" fontSize="0.9rem">
              {isKhmer ? "កម្រងសំណួរដែលបានបញ្ចប់" : "Quizzes completed"}
            </Typography>
            <Typography fontWeight={800} variant="h5" sx={{ mt: 0.5 }}>
              {quizCount}
            </Typography>
          </Paper>
        </Box>

        <Card sx={{ mb: 3, borderRadius: 4, border: "1px solid #dbeafe", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
              <Box>
                <Typography fontWeight={800} variant="h6" mb={0.5}>
                  {isKhmer ? "ជំហានបន្ទាប់" : "Next step"}
                </Typography>
                <Typography color="text.secondary">
                  {isKhmer
                    ? "បន្តទៅកាន់មេរៀន ឬពិនិត្យលទ្ធផលដែលត្រូវការការពង្រឹង។"
                    : "Continue learning or review the area that needs the most attention."}
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <Button variant="contained" onClick={() => navigate("/chapter")}>{isKhmer ? "ទៅមេរៀន" : "Open lessons"}</Button>
                <Button variant="outlined" onClick={() => navigate("/flashcard")}>{isKhmer ? "ហ្វឹកហាត់កាតរំលឹក" : "Practice flashcards"}</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" }, gap: 3, mb: 3 }}>
          <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography fontWeight={800} mb={2}>
                {isKhmer ? "📈 ការវិវឌ្ឍជំនាញ" : "📈 Skill trend"}
              </Typography>

              <Box
                sx={{
                  height: 300,
                  p: 1,
                  borderRadius: 3,
                  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                }}
              >
                <ResponsiveContainer>
                  <AreaChart data={skillAreas} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="skillTrendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={chartTickStyle}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tickFormatter={shortenLessonLabel}
                      height={58}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={chartTickStyle}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, isKhmer ? "ពិន្ទុ" : "Score"]}
                      labelFormatter={(label) => `${isKhmer ? "មេរៀន" : "Lesson"}: ${label}`}
                      {...chartTooltipStyle}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#skillTrendGradient)"
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography fontWeight={800} mb={2}>
                {isKhmer ? "📊 ជំនាញ" : "📊 Skills"}
              </Typography>

              <Box
                sx={{
                  height: 300,
                  p: 1,
                  borderRadius: 3,
                  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                }}
              >
                <ResponsiveContainer>
                  <BarChart data={skillAreas} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <YAxis
                      tick={chartTickStyle}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip {...chartTooltipStyle} formatter={(value) => [`${value}%`, isKhmer ? "ពិន្ទុ" : "Score"]} />
                    <Bar dataKey="score">
                      {skillAreas.map((skill, index) => (
                        <Cell key={index} fill={getSkillColor(skill.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3, mb: 3 }}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography fontWeight={800} mb={2}>
                {isKhmer ? "📝 កម្រងសំណួរ (៧ ថ្ងៃចុងក្រោយ)" : "📝 Quiz history (last 7 days)"}
              </Typography>

              {quizHistoryData.length === 0 ? (
                <Typography color="text.secondary">
                  {isKhmer ? "មិនមានសកម្មភាពកម្រងសំណួរថ្មីៗទេ" : "No recent quiz activity yet"}
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {quizHistoryData.slice(0, 3).map((quiz, index) => (
                    <Box
                      key={index}
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
                        <Typography fontWeight={600}>{quiz.quizTitle || quiz.chapterTitle || quiz.lesson}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(quiz.date).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 999,
                          background:
                            quiz.score < 50
                              ? "#fee2e2"
                              : quiz.score < 80
                              ? "#fef9c3"
                              : "#dcfce7",
                          color: "#111",
                          fontWeight: 700,
                        }}
                      >
                        {quiz.score}%
                      </Typography>
                    </Box>
                  ))}

                  {quizHistoryData.length > 3 ? (
                    <Button
                      variant="text"
                      onClick={() => navigate("/quiz-history")}
                      sx={{ alignSelf: "flex-start", px: 0, fontWeight: 700 }}
                    >
                      {isKhmer ? "មើលបន្ថែម" : "View more"}
                    </Button>
                  ) : null}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography fontWeight={800} mb={2}>
                {isKhmer ? "🚀 ជំហានផ្តោតបន្ទាប់" : "🚀 Focus next"}
              </Typography>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography fontWeight={600}>{isKhmer ? "ខ្លាំងបំផុត" : "Strongest skill"}</Typography>
                  <Typography fontWeight={700} color="success.main">
                    {strongestSkill.name} · {strongestSkill.score}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography fontWeight={600}>{isKhmer ? "ត្រូវពង្រឹងបន្ថែម" : "Needs more practice"}</Typography>
                  <Typography
                    fontWeight={700}
                    color={weakestSkill.score < 50 ? "error.main" : weakestSkill.score < 80 ? "warning.main" : "success.main"}
                  >
                    {weakestSkill.name} · {getRecommendation(weakestSkill.score, locale)}
                  </Typography>
                </Box>

                <Divider />

                <Button variant="contained" onClick={() => navigate("/certificate")} disabled={!certificateEligible}>
                  {certificateEligible
                    ? isKhmer
                      ? "មើលវិញ្ញាបនបត្រ"
                      : "View certificate"
                    : isKhmer
                    ? "បន្តរៀនដើម្បីបើកវិញ្ញាបនបត្រ"
                    : "Keep learning to unlock certificate"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            background: certificateEligible
              ? "linear-gradient(135deg,#10b981,#22c55e)"
              : "#f8fafc",
            color: certificateEligible ? "white" : "inherit",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <CardContent>
            <Typography fontWeight={800} mb={2}>
              🎓 {isKhmer ? "វិញ្ញាបនបត្រ" : "Certificate"}
            </Typography>

            {certificateEligible ? (
              <>
                <Typography mb={2}>
                  {isKhmer
                    ? "✅ អបអរសាទរ! អ្នកបានបញ្ចប់មេរៀន និងកម្រងសំណួរទាំងអស់"
                    : "✅ Congratulations! You have completed all lessons and quizzes."}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => navigate("/certificate")}
                  sx={{
                    background: "white",
                    color: "#10b981",
                    fontWeight: 700,
                    "&:hover": { background: "#f8fafc" },
                  }}
                >
                  {isKhmer ? "មើលវិញ្ញាបនបត្រ" : "View certificate"}
                </Button>
              </>
            ) : (
              <Typography color="text.secondary">
                {isKhmer
                  ? "បញ្ចប់មេរៀន និងកម្រងសំណួរទាំងអស់ ដើម្បីបើកវិញ្ញាបនបត្រ"
                  : "Finish all lessons and quizzes to unlock your certificate."}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
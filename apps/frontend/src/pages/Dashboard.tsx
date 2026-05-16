import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent: string;
  note: string;
}

const progressData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 80 },
  { day: "Wed", score: 75 },
  { day: "Thu", score: 90 },
  { day: "Fri", score: 85 },
  { day: "Sat", score: 70 },
  { day: "Sun", score: 95 },
];

const quickActions = [
  { label: "Quiz", icon: <Target className="h-4 w-4" />, color: "#eff6ff", path: "/quiz" },
  { label: "Flashcards", icon: <Brain className="h-4 w-4" />, color: "#fdf2f8", path: "/flashcard" },
  { label: "Chapters", icon: <BookOpen className="h-4 w-4" />, color: "#ecfeff", path: "/chapter" },
  { label: "Focus", icon: <Clock className="h-4 w-4" />, color: "#f0fdf4", path: "/focus" },
];

const StatCard = ({ title, value, icon, accent, note }: StatCardProps) => (
  <Card
    sx={{
      position: "relative",
      overflow: "hidden",
      height: "100%",
      borderRadius: 3,
      color: "white",
      background: accent,
      boxShadow: "0 18px 35px rgba(15, 23, 42, 0.16)",
    }}
  >
    <CardContent sx={{ p: 3, position: "relative", minHeight: 148 }}>
      <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight={900} mt={1}>
        {value}
      </Typography>
      <Typography sx={{ mt: 1.5, maxWidth: 180, opacity: 0.9, fontSize: "0.95rem" }}>
        {note}
      </Typography>
      <Box sx={{ position: "absolute", right: -6, bottom: -8, opacity: 0.18 }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

export default function StudentDashboard() {
  const navigate = useNavigate();

  const currentStreak = 6;
  const maxStreak = 10;
  const progressPercent = Math.round((currentStreak / maxStreak) * 100);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f7ff" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 4,
            color: "white",
            background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #7c3aed 100%)",
            boxShadow: "0 24px 60px rgba(37, 99, 235, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", inset: 0, opacity: 0.12 }}>
            <Sparkles className="absolute left-8 top-8 h-28 w-28" />
            <TrendingUp className="absolute right-10 top-14 h-36 w-36" />
            <BookOpen className="absolute -bottom-6 right-4 h-40 w-40" />
          </Box>

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 3,
              alignItems: { md: "center" },
            }}
          >
            <Box>
              <Chip
                label="Student Dashboard"
                sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700, mb: 1.5 }}
              />
              <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
                Welcome back, Student
              </Typography>
              <Typography sx={{ opacity: 0.88, maxWidth: 760 }}>
                Keep moving with the same bold learning experience as the admin side, but tuned for your studies.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Chip label="Online now" sx={{ bgcolor: "rgba(34,197,94,0.16)", color: "#dcfce7", fontWeight: 700 }} />
              <Chip label="Thursday, May 14" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", fontWeight: 700 }} />
            </Stack>
          </Box>
        </Paper>

        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: "1px solid #dbe4ff",
                  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
                  <Box>
                    <Typography variant="overline" sx={{ letterSpacing: 1.2, color: "#2563eb", fontWeight: 800 }}>
                      Today's focus
                    </Typography>
                    <Typography variant="h5" fontWeight={900} sx={{ color: "#0f172a", mt: 0.5 }}>
                      Ready to beat your record?
                    </Typography>
                    <Typography sx={{ color: "#475569", mt: 1, maxWidth: 620 }}>
                      You've mastered 3 new concepts this week. Keep the momentum by opening a new chapter or reviewing a quiz.
                    </Typography>
                  </Box>

                  <Button
                    onClick={() => navigate("/chapter")}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      alignSelf: { xs: "flex-start", sm: "center" },
                      borderRadius: 999,
                      px: 3,
                      py: 1.4,
                      bgcolor: "#1d4ed8",
                      boxShadow: "0 16px 30px rgba(29, 78, 216, 0.28)",
                    }}
                  >
                    Continue Learning
                  </Button>
                </Stack>
              </Paper>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StatCard
                    title="Chapters Done"
                    value="12"
                    accent="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                    note="Steady progress through the core chapter path."
                    icon={<BookOpen className="h-24 w-24" />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StatCard
                    title="Quiz Accuracy"
                    value="89%"
                    accent="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
                    note="Strong quiz performance across recent attempts."
                    icon={<Target className="h-24 w-24" />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StatCard
                    title="Focus Hours"
                    value="24.5h"
                    accent="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                    note="Dedicated practice time keeps the streak alive."
                    icon={<Clock className="h-24 w-24" />}
                  />
                </Grid>
              </Grid>

              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={900} color="#0f172a">
                      Weekly Performance
                    </Typography>
                    <Typography color="text.secondary">
                      Match your progress against the learning goals for this week.
                    </Typography>
                  </Box>
                  <Chip label="Last 7 days" sx={{ bgcolor: "#eff6ff", color: "#1d4ed8", fontWeight: 700 }} />
                </Stack>

                <Box sx={{ height: 280, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 20px 30px rgba(15, 23, 42, 0.12)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ borderRadius: 3, bgcolor: "#fff7ed", p: 1.5, color: "#ea580c" }}>
                    <Zap className="h-6 w-6" />
                  </Box>
                  <Box>
                    <Typography fontWeight={900} color="#0f172a">
                      Study Streak
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep the streak going every day.
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="h2" fontWeight={900} color="#0f172a" sx={{ lineHeight: 1 }}>
                    {currentStreak}
                  </Typography>
                  <Typography sx={{ color: "#64748b", mt: 1 }}>days in a row</Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" fontWeight={700} color="#475569">
                      Progress to goal
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#475569">
                      {currentStreak}/{maxStreak}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{ height: 10, borderRadius: 999, bgcolor: "#e2e8f0" }}
                  />
                </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={1.5}>
                  {quickActions.map((action) => (
                    <Grid item xs={6} key={action.label}>
                      <Button
                        fullWidth
                        onClick={() => navigate(action.path)}
                        sx={{
                          height: 88,
                          borderRadius: 3,
                          background: action.color,
                          color: "#0f172a",
                          border: "1px solid rgba(148, 163, 184, 0.22)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          textTransform: "none",
                          fontWeight: 800,
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 16px 28px rgba(15, 23, 42, 0.08)",
                            background: action.color,
                          },
                        }}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px dashed #cbd5e1",
                  bgcolor: "#f8fafc",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <Typography fontWeight={900} color="#0f172a">
                    Daily Challenge
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1.5, color: "#475569" }}>
                  Complete 5 quiz questions to unlock the Mastery badge and improve your weekly score.
                </Typography>
                <Button
                  onClick={() => navigate("/quiz")}
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2.5, borderRadius: 999, py: 1.25, bgcolor: "#0f172a" }}
                >
                  Go to Quiz
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
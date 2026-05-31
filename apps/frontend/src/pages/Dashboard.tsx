import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useLocale } from "../hooks/useLocale";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent: string;
  note: string;
}


// We'll fetch real progress from the API
import { getProgress } from "../utils/api";

type ProgressSummary = {
  totalLessons?: number;
  completedLessons?: number;
  progressPercent?: number;
};

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
  const { t } = useLocale();

  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  let mounted = true;

  getProgress()
    .then((data) => {
      if (!mounted) return;

      setProgress(data as ProgressSummary);
    })
    .catch((err) => {
      if (!mounted) return;

      console.error("getProgress failed", err);

      setProgress({
        totalLessons: 0,
        completedLessons: 0,
        progressPercent: 0,
      });
    })
    .finally(() => {
      if (mounted) setLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);

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
                label={t("pages.Dashboard.student_dashboard", "Student Dashboard")}
                sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700, mb: 1.5 }}
              />
              <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
                {t("pages.Dashboard.welcome_back_student", "Welcome back, Student")}
              </Typography>
              <Typography sx={{ opacity: 0.88, maxWidth: 760 }}>
                {t("pages.Dashboard.student_intro", "Keep moving with the same bold learning experience as the admin side, but tuned for your studies.")}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Chip label={t("pages.Dashboard.online_now", "Online now")} sx={{ bgcolor: "rgba(34,197,94,0.16)", color: "#dcfce7", fontWeight: 700 }} />
              <Chip label={t("pages.Dashboard.dashboard_date", "Thursday, May 14")} sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", fontWeight: 700 }} />
            </Stack>
          </Box>
        </Paper>

        {/* Conditional dashboard content based on real progress data */}
        {loading ? (
          <Box sx={{ py: 8 }}>
            <Typography>{t("loading", "Loading...")}</Typography>
          </Box>
        ) : (
          (() => {
            const completed = progress?.completedLessons ?? 0;
            const total = progress?.totalLessons ?? 0;
            const percent = progress?.progressPercent ?? 0;
            const hasActivity = Boolean(progress && (completed > 0 || percent > 0));

            if (!hasActivity) {
              return (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <Paper sx={{ p: 6, maxWidth: 760, textAlign: "center", borderRadius: 4 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
                      {t("pages.Dashboard.welcome_new", "Welcome to Kanit 🎉")}
                    </Typography>
                    <Typography sx={{ color: "#475569", mb: 3 }}>
                      {t(
                        "pages.Dashboard.empty_message",
                        "You haven’t started learning yet. Start a chapter to begin tracking your progress."
                      )}
                    </Typography>
                    <Button variant="contained" size="large" onClick={() => navigate("/chapter")} sx={{ borderRadius: 999 }}>
                      {t("pages.Dashboard.start_learning", "Start Learning")}
                    </Button>
                  </Paper>
                </Box>
              );
            }

            return (
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} lg={8}>
                  <Stack spacing={3}>
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid #dbe4ff", background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
                        <Box>
                          <Typography variant="overline" sx={{ letterSpacing: 1.2, color: "#2563eb", fontWeight: 800 }}>
                            {t("pages.Dashboard.student_progress", "Your progress")}
                          </Typography>
                          <Typography variant="h5" fontWeight={900} sx={{ color: "#0f172a", mt: 0.5 }}>
                            {t("pages.Dashboard.keep_going", "Keep going — you’re making progress")}
                          </Typography>
                          <Typography sx={{ color: "#475569", mt: 1, maxWidth: 620 }}>
                            {t("pages.Dashboard.progress_summary", "Here’s a quick summary of your learning progress.")}
                          </Typography>
                        </Box>

                        <Button onClick={() => navigate("/chapter")} variant="contained" size="large" endIcon={<ArrowRight size={18} />} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, borderRadius: 999, px: 3, py: 1.4, bgcolor: "#1d4ed8", boxShadow: "0 16px 30px rgba(29, 78, 216, 0.28)" }}>
                          {t("pages.Dashboard.continue_learning", "Continue Learning")}
                        </Button>
                      </Stack>
                    </Paper>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <StatCard
                          title={t("pages.Dashboard.completed_lessons", "Completed Lessons")}
                          value={total ? `${completed} / ${total}` : completed}
                          accent="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                          note={t("pages.Dashboard.completed_lessons_note", "Lessons you've completed so far.")}
                          icon={<BookOpen className="h-24 w-24" />}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StatCard
                          title={t("pages.Dashboard.overall_progress", "Overall Progress")}
                          value={`${percent}%`}
                          accent="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
                          note={t("pages.Dashboard.progress_note", "Percent of published lessons completed.")}
                          icon={<Target className="h-24 w-24" />}
                        />
                      </Grid>
                    </Grid>

                    <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                      <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 1 }}>
                        {t("pages.Dashboard.summary", "Summary")}
                      </Typography>
                      <Typography sx={{ color: "#475569", mb: 2 }}>
                        {`You have completed ${completed} lessons.`}
                      </Typography>
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
                            {t("pages.Dashboard.progress", "Progress")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t("pages.Dashboard.progress_sub", "Completed percentage of the curriculum.")}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h3" fontWeight={900} color="#0f172a" sx={{ lineHeight: 1 }}>
                          {percent}%
                        </Typography>
                        <Typography sx={{ color: "#64748b", mt: 1 }}>{t("pages.Dashboard.of_curriculum", "of curriculum")}</Typography>
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <LinearProgress variant="determinate" value={percent} sx={{ height: 10, borderRadius: 999, bgcolor: "#e2e8f0" }} />
                      </Box>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                      <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 2 }}>
                        Quick Actions
                      </Typography>
                      <Grid container spacing={1.5}>
                        {quickActions.map((action) => (
                          <Grid item xs={6} key={action.label}>
                            <Button fullWidth onClick={() => navigate(action.path)} sx={{ height: 88, borderRadius: 3, background: action.color, color: "#0f172a", border: "1px solid rgba(148, 163, 184, 0.22)", display: "flex", flexDirection: "column", gap: 1, textTransform: "none", fontWeight: 800 }}>
                              {action.icon}
                              {action.label}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 4, border: "1px dashed #cbd5e1", bgcolor: "#f8fafc" }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <Typography fontWeight={900} color="#0f172a">Daily Challenge</Typography>
                      </Stack>
                      <Typography sx={{ mt: 1.5, color: "#475569" }}>{t("pages.Dashboard.daily_challenge_text", "Complete 5 quiz questions to unlock the Mastery badge and improve your weekly score.")}</Typography>
                      <Button onClick={() => navigate("/quiz")} variant="contained" fullWidth sx={{ mt: 2.5, borderRadius: 999, py: 1.25, bgcolor: "#0f172a" }}>{t("pages.Dashboard.go_to_quiz", "Go to Quiz")}</Button>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            );
          })()
        )}
      </Container>
    </Box>
  );
}
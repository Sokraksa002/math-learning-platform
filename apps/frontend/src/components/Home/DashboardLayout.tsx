import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { BookOpen, Edit3, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { useLocale } from "../../hooks/useLocale";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProgress } from "../../utils/api";

type ProgressData = {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  totalQuizzes: number;
  averageScore: number;
};

export default function DashboardLayout() {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const isKhmer = locale === "km";

  const [progress, setProgress] = useState<ProgressData | null>(null);

  // ✅ LOAD PROGRESS FROM BACKEND
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProgress();
        setProgress({
          totalLessons: data.totalLessons ?? 0,
          completedLessons: data.completedLessons ?? 0,
          progressPercent: data.progressPercent ?? 0,
          totalQuizzes: data.totalQuizzes ?? 0,
          averageScore: data.averageScore ?? 0,
        });
      } catch (err) {
        console.error("Failed to load progress:", err);
        setProgress({
          totalLessons: 0,
          completedLessons: 0,
          progressPercent: 0,
          totalQuizzes: 0,
          averageScore: 0,
        });
      }
    };

    load();
  }, []);

  // ✅ Dynamic Stats
  const stats = [
    {
      label: isKhmer ? "មេរៀនបានបញ្ចប់" : t("pages.Dashboard.chapters_done", "Chapters Done"),
      value: progress
        ? `${progress.completedLessons}/${progress.totalLessons}`
        : "...",
      icon: BookOpen,
      color: "#3B82F6",
    },
    {
      label: isKhmer ? "ភាពត្រឹមត្រូវកម្រងសំណួរ" : t("pages.Dashboard.quiz_accuracy", "Quiz Accuracy"),
      value: progress ? `${progress.averageScore}%` : "...",
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      label: isKhmer ? "វឌ្ឍនភាព" : t("pages.Dashboard.progress", "Progress"),
      value: progress ? `${progress.progressPercent}%` : "...",
      icon: Clock,
      color: "#F59E0B",
    },
  ];

  const features = [
    {
      title: t("nav.chapter", "Chapters"),
      titleKhmer: "មេរៀន",
      icon: BookOpen,
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BAE6FD 100%)",
      iconColor: "#0284C7",
      path: "/chapter",
    },
    {
      title: t("nav.quiz", "Quiz"),
      titleKhmer: "សំណួរ",
      icon: Edit3,
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BAE6FD 100%)",
      iconColor: "#0284C7",
      path: "/quiz",
    },
    {
      title: t("flashcard.khmer", "Flashcard"),
      bg: "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
      icon: CheckCircle,
      iconColor: "#6366F1",
      path: "/flashcard",
    },
  ];

  return (
    <Box sx={{ flex: 1, overflowY: "auto" }}>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 4 } }}>

        {/* ✅ HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isKhmer ? "សួស្តី សិស្ស! 👋" : t("pages.Dashboard.hello_student", "Hello, Student! 👋")}
          </Typography>

          <Typography sx={{ color: "#6B7280", fontSize: "14px" }}>
            {new Date().toLocaleDateString(isKhmer ? "km-KH" : "en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        <Grid container spacing={3}>

          {/* ✅ LEFT SIDE */}
          <Grid item xs={12} md={8}>

            {/* ✅ Welcome Card */}
            <Card
              sx={{
                mb: 3,
                background: "linear-gradient(135deg, #3B82F6, #1E40AF)",
                color: "#fff",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ display: "flex", gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {isKhmer ? "សូមស្វាគមន៍ត្រឡប់មកវិញ!" : t("pages.Dashboard.welcome_back", "Welcome back!")}
                  </Typography>

                  <Typography sx={{ mb: 2, fontSize: "14px" }}>
                    {progress
                      ? isKhmer
                        ? `អ្នកបានបញ្ចប់មេរៀន ${progress.completedLessons} មេរៀន 🎯`
                        : `You've completed ${progress.completedLessons} lessons 🎯`
                      : isKhmer
                        ? "កំពុងផ្ទុកវឌ្ឍនភាព..."
                        : "Loading progress..."}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => navigate("/chapter")}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#3B82F6",
                      "&:hover": { backgroundColor: "#F3F4F6" },
                    }}
                  >
                    {isKhmer ? "បន្តការរៀន" : t("pages.Dashboard.continue_learning", "Continue Learning")}
                  </Button>
                </Box>

                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={60} opacity={0.3} />
                </Box>
              </CardContent>
            </Card>

            {/* ✅ STATS */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {stats.map((stat, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 55,
                          height: 55,
                          borderRadius: "50%",
                          backgroundColor: `${stat.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <stat.icon size={28} color={stat.color} />
                      </Box>

                      <Box>
                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                          {stat.label}
                        </Typography>
                        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              {isKhmer ? "ផ្លូវការរៀនរបស់អ្នក" : "Your Learning Path"}
            </Typography>

            <Grid container spacing={2}>
              {features.map((feature, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    onClick={() => navigate(feature.path)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <Box sx={{ background: feature.bg, py: 2 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <feature.icon size={36} color={feature.iconColor} />
                      </Box>
                    </Box>

                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {feature.title}
                      </Typography>

                      {feature.titleKhmer && (
                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                          {feature.titleKhmer}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* ✅ RIGHT SIDE */}
          <Grid item xs={12} md={4}>
            
            {/* ✅ Progress Card
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  📊 Your Progress
                </Typography>

                <Typography sx={{ fontSize: "14px", color: "#6B7280", mb: 2 }}>
                  {progress
                    ? `You are ${progress.progressPercent ?? 0}% complete 🚀`
                    : "Loading progress..."}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/chapter")}
                  sx={{
                    backgroundColor: "#3B82F6",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#2563EB" },
                  }}
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card> */}

            {/* ✅ Profile Card
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>
                  Profile
                </Typography>

                <Box textAlign="center">
                  <Avatar sx={{ width: 70, height: 70, margin: "0 auto", mb: 1 }}>
                    S
                  </Avatar>

                  <Typography sx={{ fontWeight: 600 }}>
                    Student
                  </Typography>

                  <Typography sx={{ fontSize: "12px", color: "#6B7280", mb: 2 }}>
                    Learning every day 📚
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/profile")}
                  >
                    View Profile
                  </Button>
                </Box>
              </CardContent>
            </Card> */}

          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Paper,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home/Header";
import { useState, useEffect } from "react";
import { useLocale } from "../hooks/useLocale";
import BookIcon from "@mui/icons-material/Book";
import QuizIcon from "@mui/icons-material/Quiz";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setAnimateCards(true);
  }, []);

  const stats: StatCard[] = [
    {
      title: "Chapters Completed",
      value: "12 / 25",
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      color: "#2196F3",
      delay: 0,
    },
    {
      title: "Quiz Attempts",
      value: "45",
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      color: "#FF9800",
      delay: 0.1,
    },
    {
      title: "Flashcards Learned",
      value: "234",
      icon: <CardGiftcardIcon sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
      delay: 0.2,
    },
    {
      title: "Study Streak",
      value: "7 Days",
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: "#E91E63",
      delay: 0.3,
    },
    {
      title: "Badges Earned",
      value: "8",
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      color: "#9C27B0",
      delay: 0.4,
    },
    {
      title: "Tasks Completed",
      value: "156",
      icon: <TaskAltIcon sx={{ fontSize: 40 }} />,
      color: "#00BCD4",
      delay: 0.5,
    },
  ];

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            animation: animateCards ? "slideInDown 0.6s ease-out" : "none",
            "@keyframes slideInDown": {
              from: {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            Welcome back, Student! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            You're on a great learning journey. Keep pushing forward!
          </Typography>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 3,
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  border: `3px solid ${stat.color}`,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  animation: animateCards
                    ? `fadeInUp 0.6s ease-out ${stat.delay}s both`
                    : "none",
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${stat.color}40`,
                  },
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    color: stat.color,
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            animation: animateCards ? "fadeInUp 0.6s ease-out 0.6s both" : "none",
            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/quiz")}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  py: 1.5,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                Take Quiz
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/flashcard")}
                sx={{
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  py: 1.5,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                Learn Flashcards
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/chapter")}
                sx={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  py: 1.5,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                Study Chapter
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/focus")}
                sx={{
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  py: 1.5,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                Focus Mode
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Recent Progress */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                animation: animateCards ? "fadeInUp 0.6s ease-out 0.7s both" : "none",
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2}>
                This Week's Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">{t('pages.Dashboard.math', 'Math')}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    75%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">{t('pages.Dashboard.science', 'Science')}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    60%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4, backgroundColor: "#e0e0e0" }} />
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">{t('pages.Dashboard.history', 'History')}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    85%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4, backgroundColor: "#e0e0e0" }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                background: "linear-gradient(135deg, #fff5e6 0%, #ffe0b2 100%)",
                animation: animateCards ? "fadeInUp 0.6s ease-out 0.8s both" : "none",
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2}>
                🎯 Daily Challenge
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Complete 5 quiz questions today to earn bonus points!
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Progress: 2 / 5
                  </Typography>
                  <LinearProgress variant="determinate" value={40} sx={{ mt: 1, width: 150, height: 6, borderRadius: 3 }} />
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/quiz")}
                  sx={{
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


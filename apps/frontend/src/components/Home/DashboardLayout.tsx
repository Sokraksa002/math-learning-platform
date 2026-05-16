import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  BookOpen,
  BarChart3,
  Edit3,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useLocale } from "../../hooks/useLocale";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
export default function DashboardLayout() {
  const { t, locale } = useLocale();

  const stats = [
    { label: "Chapters Done", value: "12", icon: BookOpen, color: "#3B82F6" },
    { label: "Quiz Accuracy", value: "89%", icon: TrendingUp, color: "#10B981" },
    { label: "Daily Streak", value: "6 days", icon: Clock, color: "#F59E0B" },
  ];

  const features = [
    {
      title: t("nav.chapter", "Chapters"),
      titleKhmer: "មេរៀន",
      icon: BookOpen,
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BAE6FD 100%)",
      iconColor: "#0284C7",
    },
    {
      title: t("nav.quiz", "Quiz"),
      titleKhmer: "សំណួរ",
      icon: Edit3,
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BAE6FD 100%)",
      iconColor: "#0284C7",
    },
    {
      title: t("flashcard.khmer", "Flashcard"),
      titleKhmer: "កាតបង្រៀន",
      icon: BookOpen,
      bg: "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
      iconColor: "#6366F1",
    },
  ];

  const recentActivity = [
    { title: "Completed Chapter 5", time: "2 hours ago", icon: CheckCircle },
    { title: "Score: 92% in Algebra Quiz", time: "Yesterday", icon: TrendingUp },
    { title: "Studied for 45 minutes", time: "2 days ago", icon: Clock },
  ];

  return (
    <Box sx={{ flex: 1, overflowY: "auto" }}>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#1E40AF", mb: 1 }}
              >
                Hello, Student!
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: "14px" }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              {/* Welcome Card */}
              <Card
                sx={{
                  mb: 3,
                  background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
                  color: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Welcome back...
                    </Typography>
                    <Typography sx={{ opacity: 0.9, mb: 2, fontSize: "14px" }}>
                      You're on a 6-day learning streak! Keep it up! 🔥
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#fff",
                        color: "#3B82F6",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#F3F4F6" },
                      }}
                    >
                      Continue Learning
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      width: "140px",
                      height: "140px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookOpen size={64} opacity={0.3} />
                  </Box>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {stats.map((stat, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card sx={{ borderRadius: 2, height: "100%" }}>
                      <CardContent
                        sx={{
                          p: 2.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            backgroundColor: `${stat.color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <stat.icon
                            size={32}
                            color={stat.color}
                            strokeWidth={1.5}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#6B7280",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {stat.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "24px",
                              fontWeight: 700,
                              color: "#1F2937",
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Learning Features */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                Your Learning Path
              </Typography>
              <Grid container spacing={2}>
                {features.map((feature, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          background: feature.bg,
                          py: 4,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            backgroundColor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          <feature.icon
                            size={40}
                            color={feature.iconColor}
                            strokeWidth={1.5}
                          />
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 2.5, textAlign: "center" }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1F2937",
                            mb: 0.5,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#3B82F6",
                            fontWeight: 600,
                          }}
                        >
                          {feature.titleKhmer}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Right Column - User Profile & Activity */}
            <Grid item xs={12} md={4}>

  {/* ✅ Calendar Card (ADD HERE) */}
  <Card sx={{ mb: 3, borderRadius: 2 }}>
  <CardContent>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        textAlign: "center",
        mb: 2,
      }}
    >
      {locale === "km" ? "ប្រតិទិន" : "Calendar"}
    </Typography>
<Calendar
  value={new Date()}
  style={{
    border: "none",
    width: "100%",
  }}
/>
  </CardContent>
</Card>


  
              {/* User Card */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        margin: "0 auto",
                        mb: 2,
                        backgroundColor: "#3B82F6",
                        fontSize: "32px",
                      }}
                    >
                      S
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Student Name
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", color: "#6B7280", mb: 3 }}
                    >
                      student@email.com
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        p: 2,
                        backgroundColor: "#F3F4F6",
                        borderRadius: 1.5,
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#3B82F6",
                          }}
                        >
                          A+
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#6B7280",
                            fontWeight: 600,
                          }}
                        >
                          Grade
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#10B981",
                          }}
                        >
                          156/200
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#6B7280",
                            fontWeight: 600,
                          }}
                        >
                          Total Points
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        color: "#3B82F6",
                        borderColor: "#3B82F6",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#EFF6FF",
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#1F2937",
                      mb: 2,
                    }}
                  >
                    Recent Activity
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {recentActivity.map((activity, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          gap: 2,
                          p: 1.5,
                          backgroundColor: "#F9FAFB",
                          borderRadius: 1,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#EFF6FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <activity.icon size={20} color="#3B82F6" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#1F2937",
                              mb: 0.5,
                            }}
                          >
                            {activity.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#9CA3AF",
                            }}
                          >
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
    </Box>
  );
}


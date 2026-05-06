import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Header from "../components/Home/Header";
import { useState } from "react";
import { useLocale } from "../hooks/useLocale";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: "active" | "inactive";
}

export default function AdminDashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useLocale();
  const [dialogType, setDialogType] = useState<"user" | "chapter" | "content">("user");
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Student One",
      email: "student1@gmail.com",
      role: "student",
      joinDate: "2025-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Student Two",
      email: "student2@gmail.com",
      role: "student",
      joinDate: "2025-02-20",
      status: "active",
    },
    {
      id: 3,
      name: "Student Three",
      email: "student3@gmail.com",
      role: "student",
      joinDate: "2025-03-10",
      status: "inactive",
    },
  ]);

  const stats = [
    {
      title: "Total Users",
      value: "156",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#2196F3" }} />,
      color: "#E3F2FD",
      change: "+12%",
    },
    {
      title: "Total Chapters",
      value: "25",
      icon: <MenuBookIcon sx={{ fontSize: 40, color: "#4CAF50" }} />,
      color: "#E8F5E9",
      change: "+3%",
    },
    {
      title: "Quiz Attempts",
      value: "1,247",
      icon: <AssignmentIcon sx={{ fontSize: 40, color: "#FF9800" }} />,
      color: "#FFF3E0",
      change: "+8%",
    },
    {
      title: "Avg. Engagement",
      value: "78%",
      icon: <BarChartIcon sx={{ fontSize: 40, color: "#9C27B0" }} />,
      color: "#F3E5F5",
      change: "+5%",
    },
  ];

  const handleOpenDialog = (type: "user" | "chapter" | "content") => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Admin Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            animation: "slideInDown 0.6s ease-out",
            "@keyframes slideInDown": {
              from: { opacity: 0, transform: "translateY(-20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            👨‍💼 Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Manage users, content, and monitor platform performance
          </Typography>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: stat.color,
                  p: 2,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" fontWeight={600} mb={1}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography color="success.main" variant="caption" fontWeight={600}>
                      {stat.change}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Management Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Users Management */}
          <Grid item xs={12}>
            <Paper
              sx={{
                borderRadius: 2,
                animation: "fadeInUp 0.6s ease-out 0.4s both",
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  👥 User Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog("user")}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Add User
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>{t('pages.AdminDashboard.user', 'User')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('pages.AdminDashboard.email', 'Email')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('pages.AdminDashboard.role', 'Role')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('pages.AdminDashboard.join_date', 'Join Date')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('pages.AdminDashboard.status', 'Status')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                              {user.name[0]}
                            </Avatar>
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.role} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <Chip
                            icon={user.status === "active" ? <CheckCircleIcon /> : <WarningIcon />}
                            label={user.status}
                            size="small"
                            color={user.status === "active" ? "success" : "warning"}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{ mr: 1 }}
                            onClick={() => handleOpenDialog("user")}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Content Management */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                animation: "fadeInUp 0.6s ease-out 0.5s both",
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  📚 Chapter Management
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog("chapter")}
                  sx={{ color: "#667eea" }}
                >
                  Add Chapter
                </Button>
              </Box>
              <Box sx={{ space: 2 }}>
                {[1, 2, 3].map((chapter) => (
                  <Paper
                    key={chapter}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f5f5f5",
                      transition: "all 0.3s ease",
                      "&:hover": { backgroundColor: "#efefef", transform: "translateX(4px)" },
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>{t('pages.AdminDashboard.chapter_chapter_algebra_basics', 'Chapter {chapter}: Algebra Basics')}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        5 lessons • 3 quizzes • Updated 2 days ago
                      </Typography>
                    </Box>
                    <Chip label={`${chapter * 20}%`} size="small" />
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* System Performance */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                animation: "fadeInUp 0.6s ease-out 0.6s both",
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2}>
                ⚡ System Performance
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{t('pages.AdminDashboard.server_health', 'Server Health')}</Typography>
                  <Chip label={t('pages.AdminDashboard.excellent', 'Excellent')} size="small" color="success" />
                </Box>
                <LinearProgress variant="determinate" value={95} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{t('pages.AdminDashboard.database_load', 'Database Load')}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    45%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2">{t('pages.AdminDashboard.api_response_time', 'API Response Time')}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    120ms
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog for Adding/Editing */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogType === "user" && "Add/Edit User"}
            {dialogType === "chapter" && "Add/Edit Chapter"}
            {dialogType === "content" && "Add/Edit Content"}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('pages.AdminDashboard.name', 'Name')}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('pages.AdminDashboard.email', 'Email')}
              type="email"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            {dialogType === "chapter" && (
              <>
                <TextField
                  fullWidth
                  label={t('pages.AdminDashboard.title', 'Title')}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label={t('pages.AdminDashboard.description', 'Description')}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('pages.AdminDashboard.cancel', 'Cancel')}</Button>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}


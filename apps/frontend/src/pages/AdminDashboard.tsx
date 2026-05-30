import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getUser } from "../utils/auth";
import {
  createBlankExercise,
  createBlankQuiz,
  loadAdminUsers,
  loadQuizBank,
  saveAdminUsers,
  saveQuizBank,
} from "../data/adminContent";
import type {
  AdminUser,
  AdminUserStatus,
  QuizBankItem,
  QuizExercise,
} from "../data/adminContent";


type EntityType = "user" | "chapter" | "lesson" | "quiz";
type TabKey = "overview" | "users" | "chapters" | "lessons" | "quizzes";

interface ChapterItem {
  id: number;
  title: string;
  description: string;
  lessons: number;
  quizzes: number;
  status: "published" | "draft";
}

interface LessonItem {
  id: number;
  chapterId: number;
  title: string;
  duration: string;
  status: "published" | "draft";
}

interface FormState {
  id?: number | string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: AdminUserStatus;
  progress: string;
  attempts: string;
  title: string;
  description: string;
  lessons: string;
  quizzes: string;
  chapterId: string;
  duration: string;
  entityStatus: "published" | "draft";
  lessonId: string;
  exercises: QuizExercise[];
}

const emptyForm: FormState = {
  name: "",
  email: "",
  role: "student",
  joinDate: new Date().toISOString().slice(0, 10),
  status: "active",
  progress: "0",
  attempts: "0",
  title: "",
  description: "",
  lessons: "0",
  quizzes: "0",
  chapterId: "1",
  duration: "45 min",
  entityStatus: "published",
  lessonId: "",
  exercises: [createBlankExercise()],
};

const initialChapters: ChapterItem[] = [
  { id: 1, title: "Algebra Basics", description: "Core algebraic operations and expressions.", lessons: 5, quizzes: 3, status: "published" },
  { id: 2, title: "Functions", description: "Understand domains, ranges, and graph behavior.", lessons: 6, quizzes: 4, status: "published" },
  { id: 3, title: "Trigonometry", description: "Angles, identities, and trigonometric equations.", lessons: 4, quizzes: 2, status: "draft" },
];

const initialLessons: LessonItem[] = [
  { id: 1, chapterId: 1, title: "Variables and Expressions", duration: "30 min", status: "published" },
  { id: 2, chapterId: 1, title: "Linear Equations", duration: "35 min", status: "published" },
  { id: 3, chapterId: 2, title: "Function Notation", duration: "28 min", status: "draft" },
];

export default function AdminDashboard() {
  const currentUser = getUser();
  const [tab, setTab] = useState<TabKey>("overview");
  const [users, setUsers] = useState<AdminUser[]>(() => loadAdminUsers());
  const [chapters, setChapters] = useState<ChapterItem[]>(initialChapters);
  const [lessons, setLessons] = useState<LessonItem[]>(initialLessons);
  const [quizzes, setQuizzes] = useState<QuizBankItem[]>(() => loadQuizBank());
  const [openDialog, setOpenDialog] = useState(false);
  const [entityType, setEntityType] = useState<EntityType>("user");
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const isAdmin = (currentUser?.role ?? "").toLowerCase() === "admin";

  useEffect(() => {
    saveAdminUsers(users);
  }, [users]);

  useEffect(() => {
    saveQuizBank(quizzes);
  }, [quizzes]);

  const stats = useMemo(
    () => [
      { title: "Total Users", value: users.length, icon: "Users", color: "#E3F2FD" },
      { title: "Total Chapters", value: chapters.length, icon: "Chapters", color: "#E8F5E9" },
      { title: "Total Lessons", value: lessons.length, icon: "Lessons", color: "#FFF3E0" },
      { title: "Total Quizzes", value: quizzes.length, icon: "Quizzes", color: "#F3E5F5" },
    ],
    [users.length, chapters.length, lessons.length, quizzes.length]
  );

  const openEditor = (type: EntityType, id?: number | string) => {
    setEntityType(type);
    setEditingId(id ?? null);

    if (type === "user" && id) {
      const selected = users.find((item) => item.id === id);
      if (selected) {
        setForm({ ...emptyForm, id: selected.id, name: selected.name, email: selected.email, role: selected.role, joinDate: selected.joinDate, status: selected.status, progress: String(selected.progress), attempts: String(selected.attempts) });
      }
    }

    if (type === "chapter" && id) {
      const selected = chapters.find((item) => item.id === id);
      if (selected) {
        setForm({ ...emptyForm, id: selected.id, title: selected.title, description: selected.description, lessons: String(selected.lessons), quizzes: String(selected.quizzes), entityStatus: selected.status });
      }
    }

    if (type === "lesson" && id) {
      const selected = lessons.find((item) => item.id === id);
      if (selected) {
        setForm({ ...emptyForm, id: selected.id, chapterId: String(selected.chapterId), title: selected.title, duration: selected.duration, entityStatus: selected.status });
      }
    }

    if (type === "quiz" && id) {
      const selected = quizzes.find((item) => item.lessonId === id);
      if (selected) {
        setForm({
          ...emptyForm,
          id: selected.lessonId,
          lessonId: selected.lessonId,
          exercises: selected.exercises.map((exercise) => ({ ...exercise, choices: [...exercise.choices] })),
        });
      }
    }

    if (type === "quiz" && !id) {
      setForm(createBlankQuiz());
    }

    if (!id && type !== "quiz") setForm(emptyForm);
    setOpenDialog(true);
  };

  const closeEditor = () => {
    setOpenDialog(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveEntity = () => {
    if (entityType === "user") {
      const payload: AdminUser = {
        id: editingId ?? Date.now(),
        name: form.name.trim() || "New User",
        email: form.email.trim() || "user@example.com",
        role: (form.role || "student").toLowerCase() as AdminUser['role'],
        joinDate: form.joinDate,
        status: form.status,
        progress: Number(form.progress) || 0,
        attempts: Number(form.attempts) || 0,
      };

      setUsers((prev) => (editingId ? prev.map((item) => (item.id === editingId ? payload : item)) : [payload, ...prev]));
    }

    if (entityType === "chapter") {
      const payload: ChapterItem = {
        id: editingId ?? Date.now(),
        title: form.title.trim() || "New Chapter",
        description: form.description.trim() || "Chapter description",
        lessons: Number(form.lessons) || 0,
        quizzes: Number(form.quizzes) || 0,
        status: form.entityStatus,
      };

      setChapters((prev) => (editingId ? prev.map((item) => (item.id === editingId ? payload : item)) : [payload, ...prev]));
    }

    if (entityType === "lesson") {
      const payload: LessonItem = {
        id: editingId ?? Date.now(),
        chapterId: Number(form.chapterId) || 1,
        title: form.title.trim() || "New Lesson",
        duration: form.duration.trim() || "30 min",
        status: form.entityStatus,
      };

      setLessons((prev) => (editingId ? prev.map((item) => (item.id === editingId ? payload : item)) : [payload, ...prev]));
    }

    if (entityType === "quiz") {
      const normalizedExercises = form.exercises.map((exercise) => ({
        ...exercise,
        question: exercise.question.trim(),
        choices: exercise.choices.map((choice) => choice.trim()),
        correctIndex: Math.max(0, Math.min(3, Number(exercise.correctIndex) || 0)),
        explanation: exercise.explanation.trim(),
        externalId: exercise.externalId.trim(),
      }));

      const payload: QuizBankItem = {
        lessonId: form.lessonId.trim() || (typeof editingId === "string" ? editingId : `lesson-${Date.now()}`),
        exercises: normalizedExercises,
      };

      setQuizzes((prev) => (typeof editingId === "string" ? prev.map((item) => (item.lessonId === editingId ? payload : item)) : [payload, ...prev]));
    }

    closeEditor();
  };

  const deleteUser = (id: number) => setUsers((prev) => prev.filter((item) => item.id !== id));
  const deleteChapter = (id: number) => {
    setChapters((prev) => prev.filter((item) => item.id !== id));
    setLessons((prev) => prev.filter((item) => item.chapterId !== id));
  };
  const deleteLesson = (id: number) => setLessons((prev) => prev.filter((item) => item.id !== id));
  const deleteQuiz = (lessonId: string) => setQuizzes((prev) => prev.filter((item) => item.lessonId !== lessonId));

  if (!currentUser) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 4, maxWidth: 520 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Admin access required
          </Typography>
          <Typography color="text.secondary">
            Log in first, then set your local user role to <strong>admin</strong> to manage content.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper sx={{ p: 4, maxWidth: 520 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Access denied
          </Typography>
          <Typography color="text.secondary">This page is reserved for admin users only.</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, mb: 3, background: "linear-gradient(135deg, #0f172a 0%, #4338ca 45%, #7c3aed 100%)", color: "white", borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={800} mb={1}>Admin Management Center</Typography>
          <Typography sx={{ opacity: 0.9 }}>Manage users, chapters, lessons, and quizzes from one dashboard.</Typography>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ backgroundColor: stat.color, height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography color="text.secondary" variant="body2" fontWeight={700}>{stat.title}</Typography>
                      <Typography variant="h4" fontWeight={800}>{stat.value}</Typography>
                    </Box>
                    <Typography fontWeight={700} fontSize={20} color="text.secondary">
                      {stat.icon}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs value={tab} onChange={(_, next) => setTab(next)} variant="scrollable" scrollButtons="auto">
            <Tab value="overview" label="Overview" />
            <Tab value="users" label="Users" />
            <Tab value="chapters" label="Chapters" />
            <Tab value="lessons" label="Lessons" />
            <Tab value="quizzes" label="Quizzes" />
          </Tabs>
        </Paper>

        {tab === "overview" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={800} mb={2}>User dashboard</Typography>
                <Stack spacing={1.5}>
                  {users.map((user) => (
                    <Box key={user.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Box>
                        <Typography fontWeight={700}>{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email} · {user.role}</Typography>
                      </Box>
                      <Chip label={`${user.progress}%`} color={user.status === "active" ? "success" : "default"} />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={800} mb={2}>Content summary</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography>Chapters</Typography><Typography fontWeight={700}>{chapters.length}</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography>Lessons</Typography><Typography fontWeight={700}>{lessons.length}</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography>Quizzes</Typography><Typography fontWeight={700}>{quizzes.length}</Typography></Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === "users" && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={800}>Manage Users</Typography>
              <Button variant="contained" onClick={() => openEditor("user")}>Add User</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Join date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell><Typography fontWeight={700}>{user.name}</Typography></TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Chip label={user.status} size="small" color={user.status === "active" ? "success" : "warning"} />
                      </TableCell>
                      <TableCell>{user.progress}%</TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => openEditor("user", user.id)} sx={{ mr: 1 }}>Edit</Button>
                        <Button size="small" color="error" onClick={() => deleteUser(user.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === "chapters" && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={800}>Manage Chapters</Typography>
              <Button variant="contained" onClick={() => openEditor("chapter")}>Add Chapter</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Lessons</TableCell>
                    <TableCell>Quizzes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chapters.map((chapter) => (
                    <TableRow key={chapter.id} hover>
                      <TableCell>
                        <Typography fontWeight={700}>{chapter.title}</Typography>
                      </TableCell>
                      <TableCell>{chapter.description}</TableCell>
                      <TableCell>{chapter.lessons}</TableCell>
                      <TableCell>{chapter.quizzes}</TableCell>
                      <TableCell><Chip label={chapter.status} size="small" color={chapter.status === "published" ? "success" : "default"} /></TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => openEditor("chapter", chapter.id)} sx={{ mr: 1 }}>Edit</Button>
                        <Button size="small" color="error" onClick={() => deleteChapter(chapter.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === "lessons" && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={800}>Manage Lessons</Typography>
              <Button variant="contained" onClick={() => openEditor("lesson")}>Add Lesson</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Chapter</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons.map((lesson) => {
                    const chapter = chapters.find((item) => item.id === lesson.chapterId);
                    return (
                      <TableRow key={lesson.id} hover>
                        <TableCell>
                          <Typography fontWeight={700}>{lesson.title}</Typography>
                        </TableCell>
                        <TableCell>{chapter?.title ?? `Chapter ${lesson.chapterId}`}</TableCell>
                        <TableCell>{lesson.duration}</TableCell>
                        <TableCell><Chip label={lesson.status} size="small" color={lesson.status === "published" ? "success" : "default"} /></TableCell>
                        <TableCell align="center">
                          <Button size="small" onClick={() => openEditor("lesson", lesson.id)} sx={{ mr: 1 }}>Edit</Button>
                          <Button size="small" color="error" onClick={() => deleteLesson(lesson.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === "quizzes" && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={800}>Manage Quiz Bank</Typography>
              <Button variant="contained" onClick={() => openEditor("quiz")}>Add Quiz</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Lesson ID</TableCell>
                    <TableCell>Exercises</TableCell>
                    <TableCell>First question</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizzes.map((quiz) => {
                    const firstExercise = quiz.exercises[0];
                    return (
                      <TableRow key={quiz.lessonId} hover>
                        <TableCell>
                          <Typography fontWeight={700}>{quiz.lessonId}</Typography>
                        </TableCell>
                        <TableCell>{quiz.exercises.length}</TableCell>
                        <TableCell>{firstExercise?.question || "No question yet"}</TableCell>
                        <TableCell align="center">
                          <Button size="small" onClick={() => openEditor("quiz", quiz.lessonId)} sx={{ mr: 1 }}>Edit</Button>
                          <Button size="small" color="error" onClick={() => deleteQuiz(quiz.lessonId)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Dialog open={openDialog} onClose={closeEditor} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? "Edit" : "Add"} {entityType}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {entityType === "user" && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField label="Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} fullWidth />
                <TextField label="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} fullWidth />
                <TextField label="Role" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} fullWidth />
                <TextField label="Join date" type="date" value={form.joinDate} onChange={(event) => setForm((prev) => ({ ...prev, joinDate: event.target.value }))} fullWidth InputLabelProps={{ shrink: true }} />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={form.status} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as AdminUserStatus }))}>
                    <MenuItem value="active">active</MenuItem>
                    <MenuItem value="inactive">inactive</MenuItem>
                  </Select>
                </FormControl>
                <TextField label="Progress %" type="number" value={form.progress} onChange={(event) => setForm((prev) => ({ ...prev, progress: event.target.value }))} fullWidth />
                <TextField label="Attempts" type="number" value={form.attempts} onChange={(event) => setForm((prev) => ({ ...prev, attempts: event.target.value }))} fullWidth />
              </Stack>
            )}

            {entityType === "chapter" && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} fullWidth />
                <TextField label="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} fullWidth multiline rows={4} />
                <TextField label="Lessons" type="number" value={form.lessons} onChange={(event) => setForm((prev) => ({ ...prev, lessons: event.target.value }))} fullWidth />
                <TextField label="Quizzes" type="number" value={form.quizzes} onChange={(event) => setForm((prev) => ({ ...prev, quizzes: event.target.value }))} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={form.entityStatus} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, entityStatus: event.target.value as "published" | "draft" }))}>
                    <MenuItem value="published">published</MenuItem>
                    <MenuItem value="draft">draft</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}

            {entityType === "lesson" && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} fullWidth />
                <TextField label="Chapter ID" type="number" value={form.chapterId} onChange={(event) => setForm((prev) => ({ ...prev, chapterId: event.target.value }))} fullWidth />
                <TextField label="Duration" value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={form.entityStatus} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, entityStatus: event.target.value as "published" | "draft" }))}>
                    <MenuItem value="published">published</MenuItem>
                    <MenuItem value="draft">draft</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}

            {entityType === "quiz" && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                  label="Lesson ID"
                  value={form.lessonId}
                  onChange={(event) => setForm((prev) => ({ ...prev, lessonId: event.target.value }))}
                  fullWidth
                />

                <Stack spacing={2}>
                  {form.exercises.map((exercise, exerciseIndex) => (
                    <Paper key={exercise.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography fontWeight={700}>Exercise {exerciseIndex + 1}</Typography>
                          <Button
                            color="error"
                            size="small"
                            onClick={() => {
                              setForm((prev) => {
                                if (prev.exercises.length === 1) {
                                  return { ...prev, exercises: [createBlankExercise()] };
                                }

                                return { ...prev, exercises: prev.exercises.filter((item) => item.id !== exercise.id) };
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </Box>

                        <TextField
                          label="Question"
                          value={exercise.question}
                          onChange={(event) => {
                            setForm((prev) => ({
                              ...prev,
                              exercises: prev.exercises.map((item) => (item.id === exercise.id ? { ...item, question: event.target.value } : item)),
                            }));
                          }}
                          fullWidth
                          multiline
                          rows={3}
                        />

                        <Stack spacing={1.5}>
                          {exercise.choices.map((choice, choiceIndex) => (
                            <TextField
                              key={`${exercise.id}-${choiceIndex}`}
                              label={`Choice ${choiceIndex + 1}`}
                              value={choice}
                              onChange={(event) => {
                                setForm((prev) => ({
                                  ...prev,
                                  exercises: prev.exercises.map((item) => {
                                    if (item.id !== exercise.id) {
                                      return item;
                                    }

                                    const nextChoices = [...item.choices];
                                    nextChoices[choiceIndex] = event.target.value;
                                    return { ...item, choices: nextChoices };
                                  }),
                                }));
                              }}
                              fullWidth
                            />
                          ))}
                        </Stack>

                        <FormControl fullWidth>
                          <InputLabel>Correct choice</InputLabel>
                          <Select
                            value={exercise.correctIndex}
                            label="Correct choice"
                            onChange={(event) => {
                              setForm((prev) => ({
                                ...prev,
                                exercises: prev.exercises.map((item) => (item.id === exercise.id ? { ...item, correctIndex: Number(event.target.value) } : item)),
                              }));
                            }}
                          >
                            <MenuItem value={0}>Choice 1</MenuItem>
                            <MenuItem value={1}>Choice 2</MenuItem>
                            <MenuItem value={2}>Choice 3</MenuItem>
                            <MenuItem value={3}>Choice 4</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          label="Explanation"
                          value={exercise.explanation}
                          onChange={(event) => {
                            setForm((prev) => ({
                              ...prev,
                              exercises: prev.exercises.map((item) => (item.id === exercise.id ? { ...item, explanation: event.target.value } : item)),
                            }));
                          }}
                          fullWidth
                          multiline
                          rows={3}
                        />

                        <TextField
                          label="External ID"
                          value={exercise.externalId}
                          onChange={(event) => {
                            setForm((prev) => ({
                              ...prev,
                              exercises: prev.exercises.map((item) => (item.id === exercise.id ? { ...item, externalId: event.target.value } : item)),
                            }));
                          }}
                          fullWidth
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <Button
                  variant="outlined"
                  onClick={() => setForm((prev) => ({ ...prev, exercises: [...prev.exercises, createBlankExercise()] }))}
                >
                  Add Exercise
                </Button>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditor}>Cancel</Button>
            <Button onClick={saveEntity} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}


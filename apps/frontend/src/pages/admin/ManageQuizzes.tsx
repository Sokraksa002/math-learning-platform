import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import { createBlankExercise, createBlankQuiz, loadQuizBank, saveQuizBank, type QuizBankItem, type QuizExercise } from '../../data/adminContent';
import { useLocale } from '../../hooks/useLocale';

const CHAPTER_STORAGE_KEY = 'math-admin-chapters';

const defaultChapters = ['Limits and Continuity', 'Functions', 'Algebra Basics', 'Trigonometry'];

const loadChapters = (): string[] => {
  if (typeof window === 'undefined') {
    return defaultChapters;
  }

  try {
    const rawValue = window.localStorage.getItem(CHAPTER_STORAGE_KEY);
    const parsed = rawValue ? (JSON.parse(rawValue) as string[]) : defaultChapters;
    return Array.isArray(parsed) ? parsed : defaultChapters;
  } catch {
    return defaultChapters;
  }
};

const saveChapters = (chapters: string[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(chapters));
};

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<QuizBankItem[]>(() => loadQuizBank());
  const [chapters, setChapters] = useState<string[]>(() => loadChapters());
  const [open, setOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [form, setForm] = useState<QuizBankItem>(createBlankQuiz());
  const [newChapterName, setNewChapterName] = useState('');
  const { t } = useLocale();

  useEffect(() => {
    saveQuizBank(quizzes);
  }, [quizzes]);

  useEffect(() => {
    saveChapters(chapters);
  }, [chapters]);

  const stats = useMemo(
    () => [
      { label: 'Quiz sets', value: quizzes.length },
      { label: 'Exercises', value: quizzes.reduce((sum, quiz) => sum + quiz.exercises.length, 0) },
      { label: 'Lessons covered', value: new Set(quizzes.map((quiz) => quiz.lessonId)).size },
    ],
    [quizzes]
  );

  const openEditor = (quiz?: QuizBankItem) => {
    if (quiz) {
      setEditingLessonId(quiz.lessonId);
      setForm({
        chapter: quiz.chapter || '',
        lessonId: quiz.lessonId,
        exercises: quiz.exercises.map((exercise) => ({ ...exercise, choices: [...exercise.choices] })),
      });
    } else {
      setEditingLessonId(null);
      setForm(createBlankQuiz());
    }

    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setEditingLessonId(null);
    setForm(createBlankQuiz());
  };

  const updateExercise = (exerciseId: string, updater: (exercise: QuizExercise) => QuizExercise) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => (exercise.id === exerciseId ? updater(exercise) : exercise)),
    }));
  };

  const saveQuiz = () => {
    const normalizedExercises = form.exercises.map((exercise) => ({
      ...exercise,
      question: exercise.question.trim(),
      choices: exercise.choices.map((choice) => choice.trim()),
      correctIndex: Math.max(0, Math.min(3, Number(exercise.correctIndex) || 0)),
      explanation: exercise.explanation.trim(),
      externalId: exercise.externalId.trim(),
    }));

    const payload: QuizBankItem = {
      chapter: form.chapter?.trim() || undefined,
      lessonId: form.lessonId.trim() || editingLessonId || `lesson-${Date.now()}`,
      exercises: normalizedExercises,
    };

    setQuizzes((prev) => (editingLessonId ? prev.map((item) => (item.lessonId === editingLessonId ? payload : item)) : [payload, ...prev]));
    closeEditor();
  };

  const deleteQuiz = (lessonId: string) => setQuizzes((prev) => prev.filter((item) => item.lessonId !== lessonId));

  const addChapter = () => {
    const nextChapter = newChapterName.trim();
    if (!nextChapter) {
      return;
    }

    setChapters((prev) => (prev.includes(nextChapter) ? prev : [nextChapter, ...prev]));
    setForm((prev) => ({ ...prev, chapter: nextChapter }));
    setNewChapterName('');
  };

  return (
    <AdminShell
      title={t('pages.AdminManageQuizzes.title', 'Manage Quizzes')}
      subtitle={t('pages.AdminManageQuizzes.subtitle', 'Edit the quiz bank by lesson ID and update the exercises used by the student quiz flow.')}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {stats.map((stat) => (
            <Paper key={stat.label} sx={{ p: 2.5, borderRadius: 3, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={700}>
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Quiz bank
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Local CRUD for lesson-level quiz content with chapter selection.
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => openEditor()}>
              Add quiz
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Chapter</TableCell>
                  <TableCell>Lesson ID</TableCell>
                  <TableCell>Exercises</TableCell>
                  <TableCell>First question</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.lessonId} hover>
                    <TableCell fontWeight={700}>{quiz.lessonId}</TableCell>
                    <TableCell>{quiz.exercises.length}</TableCell>
                    <TableCell>{quiz.exercises[0]?.question || 'No question yet'}</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => openEditor(quiz)} sx={{ mr: 1 }}>Edit</Button>
                      <Button size="small" color="error" onClick={() => deleteQuiz(quiz.lessonId)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Dialog open={open} onClose={closeEditor} fullWidth maxWidth="md">
        <DialogTitle>{editingLessonId ? 'Edit quiz' : 'Add quiz'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Chapter</InputLabel>
                <Select
                  value={form.chapter || ''}
                  label="Chapter"
                  onChange={(event) => setForm((prev) => ({ ...prev, chapter: event.target.value }))}
                >
                  <MenuItem value="">
                    <em>Select chapter</em>
                  </MenuItem>
                  {chapters.map((chapter) => (
                    <MenuItem key={chapter} value={chapter}>{chapter}</MenuItem>
                  ))}
                  <MenuItem value="__add__">+ Add chapter</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Lesson ID" value={form.lessonId} onChange={(event) => setForm((prev) => ({ ...prev, lessonId: event.target.value }))} fullWidth />
            </Stack>

            {form.chapter === '__add__' && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="New chapter name"
                    value={newChapterName}
                    onChange={(event) => setNewChapterName(event.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={addChapter}>Add chapter</Button>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Add the chapter first, then choose it from the selector.
                </Typography>
              </Paper>
            )}

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Chip label={form.chapter || 'No chapter selected'} color="primary" variant="outlined" />
              <Chip label={form.lessonId || 'Lesson ID pending'} color="default" variant="outlined" />
            </Stack>

            <Stack spacing={2}>
              {form.exercises.map((exercise, exerciseIndex) => (
                <Paper key={exercise.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      onChange={(event) => updateExercise(exercise.id, (item) => ({ ...item, question: event.target.value }))}
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
                            updateExercise(exercise.id, (item) => {
                              const nextChoices = [...item.choices];
                              nextChoices[choiceIndex] = event.target.value;
                              return { ...item, choices: nextChoices };
                            });
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
                        onChange={(event) => updateExercise(exercise.id, (item) => ({ ...item, correctIndex: Number(event.target.value) }))}
                      >
                        <MenuItem value={0}>Choice 1</MenuItem>
                        <MenuItem value={1}>Choice 2</MenuItem>
                        <MenuItem value={2}>Choice 3</MenuItem>
                        <MenuItem value={3}>Choice 4</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField label="Explanation" value={exercise.explanation} onChange={(event) => updateExercise(exercise.id, (item) => ({ ...item, explanation: event.target.value }))} fullWidth multiline rows={3} />
                    <TextField label="External ID" value={exercise.externalId} onChange={(event) => updateExercise(exercise.id, (item) => ({ ...item, externalId: event.target.value }))} fullWidth />
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Button variant="outlined" onClick={() => setForm((prev) => ({ ...prev, exercises: [...prev.exercises, createBlankExercise()] }))}>
              Add exercise
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveQuiz} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

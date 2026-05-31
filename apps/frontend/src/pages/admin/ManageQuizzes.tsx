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
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import { useLocale } from '../../hooks/useLocale';
import {
  addAdminExercise,
  deleteAdminExercise,
  getAdminChapters,
  getAdminLessonDetails,
  getAdminLessons,
  moveAdminExercise,
  type AdminChapter,
  type AdminLessonDetail,
  type AdminLessonExercise,
  type AdminLessonSummary,
} from '../../utils/api';

type ExerciseForm = {
  lessonId: string;
  questionKm: string;
  solutionKm: string;
  correctAnswer: string;
};

const blankExercise = (lessonId = ''): ExerciseForm => ({
  lessonId,
  questionKm: '',
  solutionKm: '',
  correctAnswer: '',
});

export default function ManageQuizzes() {
  const [lessons, setLessons] = useState<AdminLessonSummary[]>([]);
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<AdminLessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editMoveTarget, setEditMoveTarget] = useState('');
  const [form, setForm] = useState<ExerciseForm>(blankExercise());
  const { t } = useLocale();

  const chapterLabelById = useMemo(
    () => new Map(chapters.map((chapter) => [chapter.id, chapter.title?.km || chapter.fallbackTitle || chapter.id])),
    [chapters],
  );

  const loadAll = useCallback(async () => {
    const [lessonRows, chapterRows] = await Promise.all([getAdminLessons(), getAdminChapters()]);
    setLessons(lessonRows);
    setChapters(chapterRows);
    setSelectedLessonId((current) => current || lessonRows[0]?.id || '');
  }, []);

  const loadLessonDetail = useCallback(async (lessonId: string) => {
    if (!lessonId) {
      setSelectedLesson(null);
      return;
    }

    const detail = await getAdminLessonDetails(lessonId);
    setSelectedLesson(detail);
    setEditMoveTarget(detail.id);
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        await loadAll();
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, [loadAll]);

  useEffect(() => {
    const run = async () => {
      if (!selectedLessonId) return;

      try {
        await loadLessonDetail(selectedLessonId);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson exercises');
      }
    };

    void run();
  }, [loadLessonDetail, selectedLessonId]);

  const stats = useMemo(
    () => [
      { label: 'Lessons', value: lessons.length },
      { label: 'Exercises', value: lessons.reduce((sum, lesson) => sum + lesson.exerciseCount, 0) },
      { label: 'Chapters', value: chapters.length },
    ],
    [chapters.length, lessons],
  );

  const openEditor = () => {
    setForm(blankExercise(selectedLessonId));
    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setForm(blankExercise(selectedLessonId));
  };

  const refresh = async () => {
    const [lessonRows, chapterRows] = await Promise.all([getAdminLessons(), getAdminChapters()]);
    setLessons(lessonRows);
    setChapters(chapterRows);
    if (selectedLessonId) {
      const detail = await getAdminLessonDetails(selectedLessonId);
      setSelectedLesson(detail);
    }
  };

  const saveExercise = async () => {
    if (!form.lessonId || !form.questionKm.trim() || !form.solutionKm.trim() || !form.correctAnswer.trim()) {
      setError('Lesson, question, solution, and correct answer are required');
      return;
    }

    try {
      setSaving(true);
      await addAdminExercise({
        lessonId: form.lessonId,
        questionKm: form.questionKm.trim(),
        solutionKm: form.solutionKm.trim(),
        correctAnswer: form.correctAnswer.trim(),
      });
      await refresh();
      setError('');
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save exercise');
    } finally {
      setSaving(false);
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      setSaving(true);
      await deleteAdminExercise(exerciseId);
      await refresh();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exercise');
    } finally {
      setSaving(false);
    }
  };

  const moveExercise = async (exercise: AdminLessonExercise) => {
    if (!editMoveTarget || editMoveTarget === selectedLessonId) {
      return;
    }

    try {
      setSaving(true);
      await moveAdminExercise({ exerciseId: exercise.id, newLessonId: editMoveTarget });
      await refresh();
      await loadLessonDetail(selectedLessonId);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move exercise');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={t('pages.AdminManageQuizzes.title', 'Manage Quizzes')}
      subtitle={t('pages.AdminManageQuizzes.subtitle', 'Connected to backend lesson and exercise admin endpoints.')}
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

        {error && (
          <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #fecaca', background: '#fff1f2' }}>
            <Typography color="error" fontWeight={700}>{error}</Typography>
          </Paper>
        )}

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Quiz / exercise bank
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a lesson to manage its backend exercises.
              </Typography>
            </Box>
            <Button variant="contained" onClick={openEditor} disabled={loading || !selectedLessonId}>
              Add exercise
            </Button>
          </Box>

          <Box sx={{ px: 3, pb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Lesson</InputLabel>
              <Select
                value={selectedLessonId}
                label="Lesson"
                onChange={(event) => setSelectedLessonId(event.target.value)}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.titleKm} · {chapterLabelById.get(lesson.chapterId) || lesson.chapterId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Answer</TableCell>
                  <TableCell>Correct answer</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(selectedLesson?.exercises || []).map((exercise) => (
                  <TableRow key={exercise.id} hover>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography fontWeight={700} noWrap title={exercise.questionKm}>{exercise.questionKm}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography noWrap title={exercise.solutionKm}>{exercise.solutionKm}</Typography>
                    </TableCell>
                    <TableCell>{exercise.correctAnswer}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => moveExercise(exercise)}
                        sx={{ mr: 1 }}
                        disabled={saving || !editMoveTarget || editMoveTarget === selectedLessonId}
                      >
                        Move
                      </Button>
                      <Button
                        size="small"
                        onClick={() => deleteExercise(exercise.id)}
                        color="error"
                        sx={{ mr: 1 }}
                        disabled={saving}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {selectedLesson && selectedLesson.exercises.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography color="text.secondary">No exercises yet for this lesson.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {selectedLesson && (
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800}>Move exercise</Typography>
              <Typography variant="body2" color="text.secondary">
                If you want to move an exercise to another lesson, choose the target lesson here and then use the action button on the exercise row.
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Target lesson</InputLabel>
                <Select
                  value={editMoveTarget}
                  label="Target lesson"
                  onChange={(event) => setEditMoveTarget(event.target.value)}
                >
                  {lessons.map((lesson) => (
                    <MenuItem key={lesson.id} value={lesson.id}>
                      {lesson.titleKm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        )}
      </Stack>

      <Dialog open={open} onClose={closeEditor} fullWidth maxWidth="sm">
        <DialogTitle>Add exercise</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.25} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>Create a backend exercise</Typography>
              <Typography variant="body2" color="text.secondary">
                The server stores the question, solution, and correct answer for the selected lesson.
              </Typography>
            </Paper>

            <FormControl fullWidth>
              <InputLabel>Lesson</InputLabel>
              <Select
                value={form.lessonId}
                label="Lesson"
                onChange={(event) => setForm((prev) => ({ ...prev, lessonId: event.target.value }))}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.titleKm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Question (Khmer)"
              value={form.questionKm}
              onChange={(event) => setForm((prev) => ({ ...prev, questionKm: event.target.value }))}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Solution (Khmer)"
              value={form.solutionKm}
              onChange={(event) => setForm((prev) => ({ ...prev, solutionKm: event.target.value }))}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Correct answer"
              value={form.correctAnswer}
              onChange={(event) => setForm((prev) => ({ ...prev, correctAnswer: event.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveExercise} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

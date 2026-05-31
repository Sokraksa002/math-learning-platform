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
import { useEffect, useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import { useLocale } from '../../hooks/useLocale';
import {
  createAdminLesson,
  getAdminLessons,
  getChapters,
  type AdminLessonSummary,
  type Chapter,
} from '../../utils/api';

type LessonForm = {
  titleKm: string;
  chapterId: string;
  summary: string;
};

const blankLesson = (): LessonForm => ({
  titleKm: '',
  chapterId: '',
  summary: '',
});

export default function ManageLessons() {
  const [lessons, setLessons] = useState<AdminLessonSummary[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LessonForm>(blankLesson());
  const { t } = useLocale();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [lessonRows, chapterRows] = await Promise.all([getAdminLessons(), getChapters()]);
        setLessons(lessonRows);
        setChapters(chapterRows);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin lessons');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Lessons', value: lessons.length },
      { label: 'Chapters', value: chapters.length },
      { label: 'Exercises', value: lessons.reduce((sum, lesson) => sum + lesson.exerciseCount, 0) },
    ],
    [chapters.length, lessons]
  );

  const chapterOptions = useMemo(
    () => chapters.map((chapter) => ({ value: chapter.id, label: chapter.titleKm })),
    [chapters]
  );

  const openEditor = () => {
    setForm(blankLesson());
    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setForm(blankLesson());
  };

  const saveLesson = async () => {
    if (!form.titleKm.trim()) {
      setError('Lesson title is required');
      return;
    }

    if (!form.chapterId) {
      setError('Please choose a chapter');
      return;
    }

    try {
      setSaving(true);
      await createAdminLesson({
        chapterId: form.chapterId,
        titleKm: form.titleKm.trim(),
        orderIndex: lessons.length + 1,
        contentJson: {
          blocks: [
            {
              type: 'text',
              value: form.summary.trim() || form.titleKm.trim(),
            },
          ],
        },
      });

      const [lessonRows, chapterRows] = await Promise.all([getAdminLessons(), getChapters()]);
      setLessons(lessonRows);
      setChapters(chapterRows);
      setError('');
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title={t('pages.AdminManageLessons.title', 'Manage Lessons')} subtitle={t('pages.AdminManageLessons.subtitle', 'Connected to the backend lesson admin routes.')}> 
      <Stack spacing={3}>
        <Paper
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
            border: '1px solid #dbeafe',
          }}
        >
          <Stack spacing={1.25}>
            <Typography variant="h5" fontWeight={900}>
              Backend-connected lesson editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              This screen reads lessons from the backend and creates new lessons through the admin API. Edit and delete actions are not exposed yet by the backend.
            </Typography>
          </Stack>
        </Paper>

        {error && (
          <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #fecaca', background: '#fff1f2' }}>
            <Typography color="error" fontWeight={700}>{error}</Typography>
          </Paper>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {stats.map((stat) => (
            <Paper key={stat.label} sx={{ p: 2.5, borderRadius: 3, flex: 1, border: '1px solid #e5e7eb' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={700}>{stat.label}</Typography>
              <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>{stat.value}</Typography>
            </Paper>
          ))}
        </Stack>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={800}>Lesson list</Typography>
              <Typography variant="body2" color="text.secondary">Loaded from the live admin API.</Typography>
            </Box>
            <Button variant="contained" onClick={openEditor} disabled={loading}>Add lesson</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Chapter</TableCell>
                  <TableCell>Exercises</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{lesson.titleKm}</Typography>
                    </TableCell>
                    <TableCell>{chapterOptions.find((chapter) => chapter.value === lesson.chapterId)?.label || lesson.chapterId}</TableCell>
                    <TableCell>{lesson.exerciseCount}</TableCell>
                    <TableCell align="center">
                      <Button size="small" disabled sx={{ mr: 1 }}>Edit</Button>
                      <Button size="small" color="error" disabled>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Dialog open={open} onClose={closeEditor} fullWidth maxWidth="md">
        <DialogTitle>Add lesson</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>Create a backend lesson</Typography>
              <Typography variant="body2" color="text.secondary">
                The backend expects a chapter, a Khmer title, an order index, and lesson content JSON. This form creates that payload for you.
              </Typography>
            </Paper>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Lesson title (Khmer)" value={form.titleKm} onChange={(event) => setForm((prev) => ({ ...prev, titleKm: event.target.value }))} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Chapter</InputLabel>
                <Select
                  value={form.chapterId || ''}
                  label="Chapter"
                  onChange={(event) => setForm((prev) => ({ ...prev, chapterId: event.target.value }))}
                >
                  <MenuItem value="">
                    <em>Select chapter</em>
                  </MenuItem>
                  {chapterOptions.map((chapter) => (
                    <MenuItem key={chapter.value} value={chapter.value}>
                      {chapter.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Lesson summary"
              value={form.summary}
              onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
              fullWidth
              multiline
              rows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveLesson} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

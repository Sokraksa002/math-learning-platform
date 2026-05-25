import {
  Box,
  Button,
  Chip,
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
  Divider,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from './AdminShell';

type LessonStatus = 'draft' | 'published';

interface AdminLesson {
  id: number;
  title: string;
  chapter: string;
  duration: string;
  status: LessonStatus;
  quizCount: number;
  summary: string;
}

const LESSON_STORAGE_KEY = 'math-admin-lessons';
const CHAPTER_STORAGE_KEY = 'math-admin-chapters';

const defaultChapters = ['Limits and Continuity', 'Functions', 'Algebra Basics', 'Trigonometry'];

const defaultLessons: AdminLesson[] = [
  { id: 1, title: 'Variables and Expressions', chapter: 'Algebra Basics', duration: '30 min', status: 'published', quizCount: 2, summary: 'Introduce the core symbols and notation used in algebra.' },
  { id: 2, title: 'Linear Equations', chapter: 'Algebra Basics', duration: '35 min', status: 'published', quizCount: 3, summary: 'Solve one-variable linear equations with confidence.' },
  { id: 3, title: 'Function Notation', chapter: 'Functions', duration: '28 min', status: 'draft', quizCount: 1, summary: 'Read and evaluate function notation from graphs and expressions.' },
];

const loadLessons = (): AdminLesson[] => {
  if (typeof window === 'undefined') {
    return defaultLessons;
  }

  try {
    const rawValue = window.localStorage.getItem(LESSON_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as AdminLesson[]) : defaultLessons;
  } catch {
    return defaultLessons;
  }
};

const saveLessons = (lessons: AdminLesson[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(lessons));
};

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

const blankLesson = (): AdminLesson => ({
  id: Date.now(),
  title: '',
  chapter: '',
  duration: '30 min',
  status: 'draft',
  quizCount: 0,
  summary: '',
});

export default function ManageLessons() {
  const [lessons, setLessons] = useState<AdminLesson[]>(() => loadLessons());
  const [chapters, setChapters] = useState<string[]>(() => loadChapters());
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminLesson>(blankLesson());
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

  useEffect(() => {
    saveLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    saveChapters(chapters);
  }, [chapters]);

  const stats = useMemo(
    () => [
      { label: 'Lessons', value: lessons.length },
      { label: 'Published', value: lessons.filter((lesson) => lesson.status === 'published').length },
      { label: 'Drafts', value: lessons.filter((lesson) => lesson.status === 'draft').length },
    ],
    [lessons]
  );

  const chapterOptions = useMemo(
    () => Array.from(new Set([...defaultChapters, ...chapters, ...lessons.map((lesson) => lesson.chapter)])).filter(Boolean),
    [chapters, lessons]
  );

  const lessonOptions = useMemo(
    () => lessons.filter((lesson) => lesson.chapter === form.chapter),
    [form.chapter, lessons]
  );

  const handleChapterChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      chapter: value,
    }));
    setSelectedLessonId('');

    if (value !== '__add__') {
      setNewChapterName('');
    }
  };

  const addChapter = () => {
    const nextChapter = newChapterName.trim();
    if (!nextChapter) {
      return;
    }

    setChapters((prev) => (prev.includes(nextChapter) ? prev : [nextChapter, ...prev]));
    handleChapterChange(nextChapter);
  };

  const openEditor = (lesson?: AdminLesson) => {
    if (lesson) {
      setEditingId(lesson.id);
      setForm(lesson);
      setSelectedLessonId(String(lesson.id));
    } else {
      setEditingId(null);
      setForm(blankLesson());
      setSelectedLessonId('');
    }

    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setEditingId(null);
    setForm(blankLesson());
    setSelectedLessonId('');
    setNewChapterName('');
  };

  const saveLesson = () => {
    const payload: AdminLesson = {
      ...form,
      id: editingId ?? form.id ?? Date.now(),
      title: form.title.trim() || 'New lesson',
      chapter: form.chapter === '__add__' ? newChapterName.trim() || 'Unassigned' : form.chapter.trim() || 'Unassigned',
      duration: form.duration.trim() || '30 min',
      quizCount: Number(form.quizCount) || 0,
      summary: form.summary.trim() || 'Lesson summary',
    };

    setLessons((prev) => (editingId ? prev.map((item) => (item.id === editingId ? payload : item)) : [payload, ...prev]));
    closeEditor();
  };

  const deleteLesson = (id: number) => setLessons((prev) => prev.filter((item) => item.id !== id));

  return (
    <AdminShell title="Manage Lessons" subtitle="Create and organize lesson records independently from the chapter pages.">
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
              Friendly lesson editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              Keep each lesson simple: give it a title, connect it to a chapter, set a duration, and add a short summary so the lesson is easy to scan later.
            </Typography>
          </Stack>
        </Paper>

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
              <Typography variant="body2" color="text.secondary">A cleaner place to manage lesson details and publishing status.</Typography>
            </Box>
            <Button variant="contained" onClick={() => openEditor()}>Add lesson</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Chapter</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Quizzes</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{lesson.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{lesson.summary}</Typography>
                    </TableCell>
                    <TableCell>{lesson.chapter}</TableCell>
                    <TableCell>{lesson.duration}</TableCell>
                    <TableCell>{lesson.quizCount}</TableCell>
                    <TableCell>
                      <Chip label={lesson.status} size="small" color={lesson.status === 'published' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => openEditor(lesson)} sx={{ mr: 1 }}>Edit</Button>
                      <Button size="small" color="error" onClick={() => deleteLesson(lesson.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Dialog open={open} onClose={closeEditor} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Edit lesson' : 'Add lesson'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>Edit in one pass</Typography>
              <Typography variant="body2" color="text.secondary">
                Fill the core lesson details first, then fine-tune the summary and quiz count so the page feels more like a guided form than a raw table editor.
              </Typography>
            </Paper>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Chapter</InputLabel>
                <Select
                  value={form.chapter || ''}
                  label="Chapter"
                  onChange={(event) => handleChapterChange(event.target.value)}
                >
                  <MenuItem value="">
                    <em>Select chapter</em>
                  </MenuItem>
                  {chapterOptions.map((chapter) => (
                    <MenuItem key={chapter} value={chapter}>
                      {chapter}
                    </MenuItem>
                  ))}
                  <MenuItem value="__add__">+ Add chapter</MenuItem>
                </Select>
              </FormControl>
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

            <FormControl fullWidth>
              <InputLabel>Lesson from chapter</InputLabel>
              <Select
                value={selectedLessonId}
                label="Lesson from chapter"
                onChange={(event) => {
                  const lessonId = event.target.value;
                  setSelectedLessonId(lessonId);

                  const selectedLesson = lessons.find((lesson) => String(lesson.id) === lessonId);
                  if (selectedLesson) {
                    setSelectedLessonId(String(selectedLesson.id));
                    setForm(selectedLesson);
                  }
                }}
                disabled={!form.chapter || form.chapter === '__add__'}
              >
                <MenuItem value="">
                  <em>{form.chapter ? 'Pick a lesson' : 'Select a chapter first'}</em>
                </MenuItem>
                {lessonOptions.map((lesson) => (
                  <MenuItem key={lesson.id} value={String(lesson.id)}>
                    {lesson.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Duration" value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} fullWidth />
              <TextField label="Quiz count" type="number" value={form.quizCount} onChange={(event) => setForm((prev) => ({ ...prev, quizCount: Number(event.target.value) }))} fullWidth />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as LessonStatus }))}>
                  <MenuItem value="published">published</MenuItem>
                  <MenuItem value="draft">draft</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ flex: 1 }} />
            </Stack>

            <Divider />

            <TextField label="Summary" value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} fullWidth multiline rows={4} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveLesson} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

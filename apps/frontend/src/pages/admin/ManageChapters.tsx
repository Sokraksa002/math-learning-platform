import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
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
  createAdminChapter,
  getAdminChapters,
  publishAdminChapter,
  type AdminChapter,
} from '../../utils/api';

type ChapterForm = {
  titleKm: string;
  orderIndex: number;
};

const blankChapter = (): ChapterForm => ({
  titleKm: '',
  orderIndex: 1,
});

export default function ManageChapters() {
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ChapterForm>(blankChapter());
  const { t } = useLocale();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await getAdminChapters();
        setChapters(rows);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chapters');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Chapters', value: chapters.length },
      { label: 'Published', value: chapters.filter((chapter) => chapter.isPublished).length },
      { label: 'Drafts', value: chapters.filter((chapter) => !chapter.isPublished).length },
    ],
    [chapters],
  );

  const openEditor = () => {
    setForm(blankChapter());
    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setForm(blankChapter());
  };

  const reloadChapters = async () => {
    const rows = await getAdminChapters();
    setChapters(rows);
  };

  const saveChapter = async () => {
    if (!form.titleKm.trim()) {
      setError('Chapter title is required');
      return;
    }

    try {
      setSaving(true);
      await createAdminChapter({
        titleKm: form.titleKm.trim(),
        orderIndex: form.orderIndex,
      });
      await reloadChapters();
      setError('');
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save chapter');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (chapter: AdminChapter) => {
    try {
      setSaving(true);
      await publishAdminChapter(chapter.id, !chapter.isPublished);
      await reloadChapters();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update chapter');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={t('pages.AdminManageChapters.title', 'Manage Chapters')}
      subtitle={t('pages.AdminManageChapters.subtitle', 'Connected to the backend chapter admin endpoints.')}
    >
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
              Backend-connected chapter editor
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              This screen lists chapters from the backend and lets admins create new chapters or publish and unpublish them.
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
              <Typography variant="h6" fontWeight={800}>Chapter list</Typography>
              <Typography variant="body2" color="text.secondary">Loaded from the backend admin API.</Typography>
            </Box>
            <Button variant="contained" onClick={openEditor} disabled={loading}>Add chapter</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chapters.map((chapter) => (
                  <TableRow key={chapter.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{chapter.title?.km || chapter.fallbackTitle || chapter.id}</Typography>
                    </TableCell>
                    <TableCell>{chapter.orderIndex ?? '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={chapter.isPublished ? 'published' : 'draft'}
                        size="small"
                        color={chapter.isPublished ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => togglePublish(chapter)}
                        sx={{ mr: 1 }}
                        disabled={saving}
                      >
                        {chapter.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button size="small" color="error" disabled>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Dialog open={open} onClose={closeEditor} fullWidth maxWidth="sm">
        <DialogTitle>Add chapter</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>Create a backend chapter</Typography>
              <Typography variant="body2" color="text.secondary">
                The backend expects a Khmer title and an order index. After creating it, use publish or unpublish from the table.
              </Typography>
            </Paper>

            <TextField
              label="Chapter title (Khmer)"
              value={form.titleKm}
              onChange={(event) => setForm((prev) => ({ ...prev, titleKm: event.target.value }))}
              fullWidth
            />

            <TextField
              label="Order index"
              type="number"
              value={form.orderIndex}
              onChange={(event) => setForm((prev) => ({ ...prev, orderIndex: Number(event.target.value) }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveChapter} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

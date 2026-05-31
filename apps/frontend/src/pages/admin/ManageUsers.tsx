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
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import { useLocale } from '../../hooks/useLocale';
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
  type AdminUserSummary,
} from '../../utils/api';

type UserForm = {
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  isBanned: boolean;
  password: string;
};

const blankUser = (): UserForm => ({
  email: '',
  name: '',
  role: 'STUDENT',
  isBanned: false,
  password: '',
});

export default function ManageUsers() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserSummary | null>(null);
  const [form, setForm] = useState<UserForm>(blankUser());
  const { t } = useLocale();

  const loadUsers = async () => {
    const rows = await getAdminUsers();
    setUsers(rows);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        await loadUsers();
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total users', value: users.length },
      { label: 'Active users', value: users.filter((user) => !user.isBanned).length },
      { label: 'Admins', value: users.filter((user) => user.role === 'ADMIN').length },
    ],
    [users],
  );

  const openEditor = (user?: AdminUserSummary) => {
    if (user) {
      setEditingUser(user);
      setForm({
        email: user.email,
        name: user.name,
        role: user.role,
        isBanned: user.isBanned,
        password: '',
      });
    } else {
      setEditingUser(null);
      setForm(blankUser());
    }

    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setEditingUser(null);
    setForm(blankUser());
  };

  const saveUser = async () => {
    if (!form.email.trim() || !form.name.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      setSaving(true);
      if (editingUser) {
        await updateAdminUser(editingUser.id, {
          email: form.email.trim(),
          name: form.name.trim(),
          role: form.role,
          isBanned: form.isBanned,
        });
      } else {
        if (!form.password.trim()) {
          setError('Password is required for new users');
          return;
        }

        await createAdminUser({
          email: form.email.trim(),
          name: form.name.trim(),
          role: form.role,
          password: form.password,
        });
      }

      await loadUsers();
      setError('');
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (id: string) => {
    try {
      setSaving(true);
      await deleteAdminUser(id);
      await loadUsers();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={t('pages.AdminManageUsers.title', 'Manage Users')}
      subtitle={t('pages.AdminManageUsers.subtitle', 'Connected to the backend admin user endpoints.')}
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
                Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live CRUD for the backend user table.
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => openEditor()} disabled={loading}>
              Add user
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isBanned ? 'banned' : 'active'}
                        size="small"
                        color={user.isBanned ? 'warning' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => openEditor(user)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => removeUser(user.id)}>
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
        <DialogTitle>{editingUser ? 'Edit user' : 'Add user'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>Backend user record</Typography>
              <Typography variant="body2" color="text.secondary">
                Admin users are stored in the database. New users need a password; edits can change email, name, role, and ban status.
              </Typography>
            </Paper>

            <TextField
              label="Name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role}
                label="Role"
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserForm['role'] }))}
              >
                <MenuItem value="STUDENT">student</MenuItem>
                <MenuItem value="ADMIN">admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.isBanned ? 'banned' : 'active'}
                label="Status"
                onChange={(event) => setForm((prev) => ({ ...prev, isBanned: event.target.value === 'banned' }))}
              >
                <MenuItem value="active">active</MenuItem>
                <MenuItem value="banned">banned</MenuItem>
              </Select>
            </FormControl>
            {!editingUser && (
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveUser} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

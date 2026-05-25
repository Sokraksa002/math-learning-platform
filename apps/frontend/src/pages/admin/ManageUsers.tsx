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
import { loadAdminUsers, saveAdminUsers, type AdminUser, type AdminUserStatus } from '../../data/adminContent';
import { useLocale } from '../../hooks/useLocale';

const emptyUser: AdminUser = {
  id: 0,
  name: '',
  email: '',
  role: 'student',
  joinDate: new Date().toISOString().slice(0, 10),
  status: 'active',
  progress: 0,
  attempts: 0,
};

export default function ManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>(() => loadAdminUsers());
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminUser>(emptyUser);
  const { t } = useLocale();

  useEffect(() => {
    saveAdminUsers(users);
  }, [users]);

  const stats = useMemo(
    () => [
      { label: 'Total users', value: users.length },
      { label: 'Active users', value: users.filter((user) => user.status === 'active').length },
      { label: 'Admins', value: users.filter((user) => user.role === 'admin').length },
    ],
    [users]
  );

  const openEditor = (user?: AdminUser) => {
    if (user) {
      setEditingId(user.id);
      setForm(user);
    } else {
      setEditingId(null);
      setForm({ ...emptyUser, id: Date.now() });
    }

    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setEditingId(null);
    setForm(emptyUser);
  };

  const saveUser = () => {
    const payload: AdminUser = {
      ...form,
      id: editingId ?? form.id ?? Date.now(),
      name: form.name.trim() || 'New User',
      email: form.email.trim() || 'user@example.com',
      progress: Number(form.progress) || 0,
      attempts: Number(form.attempts) || 0,
    };

    setUsers((prev) => (editingId ? prev.map((item) => (item.id === editingId ? payload : item)) : [payload, ...prev]));
    closeEditor();
  };

  const deleteUser = (id: number) => setUsers((prev) => prev.filter((item) => item.id !== id));

  return (
    <AdminShell
      title={t('pages.AdminManageUsers.title', 'Manage Users')}
      subtitle={t('pages.AdminManageUsers.subtitle', 'Create, update, and remove student or admin accounts from a single table.')}
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
                Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Local CRUD for the admin-side account list.
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => openEditor()}>
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
                  <TableCell>Join date</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell fontWeight={700}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip label={user.status} size="small" color={user.status === 'active' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.progress}%</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => openEditor(user)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => deleteUser(user.id)}>
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
        <DialogTitle>{editingId ? 'Edit user' : 'Add user'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} fullWidth />
            <TextField label="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
                <MenuItem value="student">student</MenuItem>
                <MenuItem value="teacher">teacher</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Join date" type="date" value={form.joinDate} onChange={(event) => setForm((prev) => ({ ...prev, joinDate: event.target.value }))} fullWidth InputLabelProps={{ shrink: true }} />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as AdminUserStatus }))}>
                <MenuItem value="active">active</MenuItem>
                <MenuItem value="inactive">inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Progress" type="number" value={form.progress} onChange={(event) => setForm((prev) => ({ ...prev, progress: event.target.value }))} fullWidth />
            <TextField label="Attempts" type="number" value={form.attempts} onChange={(event) => setForm((prev) => ({ ...prev, attempts: event.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

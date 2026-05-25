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

type CertificateStatus = 'pending' | 'verified' | 'rejected';

interface CertificateRecord {
  id: number;
  studentName: string;
  courseTitle: string;
  score: number;
  issuedAt: string;
  status: CertificateStatus;
  certificateCode: string;
}

const CERT_STORAGE_KEY = 'math-admin-certificates';

const defaultCertificates: CertificateRecord[] = [
  { id: 1, studentName: 'Student One', courseTitle: 'Algebra Basics', score: 89, issuedAt: '2026-04-03', status: 'verified', certificateCode: 'CERT-ALG-001' },
  { id: 2, studentName: 'Student Two', courseTitle: 'Functions', score: 76, issuedAt: '2026-04-10', status: 'pending', certificateCode: 'CERT-FUN-002' },
  { id: 3, studentName: 'Student Three', courseTitle: 'Trigonometry', score: 94, issuedAt: '2026-04-11', status: 'rejected', certificateCode: 'CERT-TRI-003' },
];

const loadCertificates = (): CertificateRecord[] => {
  if (typeof window === 'undefined') {
    return defaultCertificates;
  }

  try {
    const rawValue = window.localStorage.getItem(CERT_STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as CertificateRecord[]) : defaultCertificates;
  } catch {
    return defaultCertificates;
  }
};

const saveCertificates = (certificates: CertificateRecord[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certificates));
};

const blankCertificate = (): CertificateRecord => ({
  id: Date.now(),
  studentName: '',
  courseTitle: '',
  score: 0,
  issuedAt: new Date().toISOString().slice(0, 10),
  status: 'pending',
  certificateCode: '',
});

export default function VerifyCertificates() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => loadCertificates());
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CertificateRecord>(blankCertificate());
  const { t } = useLocale();

  useEffect(() => {
    saveCertificates(certificates);
  }, [certificates]);

  const stats = useMemo(
    () => [
      { label: 'Certificates', value: certificates.length },
      { label: 'Pending', value: certificates.filter((certificate) => certificate.status === 'pending').length },
      { label: 'Verified', value: certificates.filter((certificate) => certificate.status === 'verified').length },
    ],
    [certificates]
  );

  const openEditor = (certificate?: CertificateRecord) => {
    if (certificate) {
      setEditingId(certificate.id);
      setForm(certificate);
    } else {
      setEditingId(null);
      setForm(blankCertificate());
    }

    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setEditingId(null);
    setForm(blankCertificate());
  };

  const saveCertificate = () => {
    const payload: CertificateRecord = {
      ...form,
      id: editingId ?? form.id ?? Date.now(),
      studentName: form.studentName.trim() || 'New student',
      courseTitle: form.courseTitle.trim() || 'Course',
      score: Number(form.score) || 0,
      certificateCode: form.certificateCode.trim() || `CERT-${Date.now()}`,
    };

    setCertificates((prev) => (editingId ? prev.map((item) => (item.id === editingId ? payload : item)) : [payload, ...prev]));
    closeEditor();
  };

  const deleteCertificate = (id: number) => setCertificates((prev) => prev.filter((item) => item.id !== id));
  const markVerified = (id: number) => setCertificates((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'verified' } : item)));
  const markRejected = (id: number) => setCertificates((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item)));

  return (
    <AdminShell title={t('pages.AdminVerifyCertificates.title', 'Verify Certificates')} subtitle={t('pages.AdminVerifyCertificates.subtitle', 'Review completion certificates and mark them as verified, pending, or rejected.')}>
      <Stack spacing={3}>
        <Paper
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
            border: '1px solid #dbeafe',
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="h5" fontWeight={900}>
              Quick verification flow
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              Open a certificate, check the student name, course, and score, then mark it verified when the record looks correct. Use pending for items that need a second review, or reject when the data is invalid.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Chip label="Review details" color="primary" variant="outlined" />
              <Chip label="Verify when valid" color="success" variant="outlined" />
              <Chip label="Reject incorrect records" color="error" variant="outlined" />
            </Stack>
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
              <Typography variant="h6" fontWeight={800}>Certificate queue</Typography>
              <Typography variant="body2" color="text.secondary">Review the pending list and update each certificate status with one click.</Typography>
            </Box>
            <Button variant="contained" onClick={() => openEditor()}>Add certificate</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f7fb' }}>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Issued</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow key={certificate.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{certificate.studentName}</Typography>
                      <Typography variant="body2" color="text.secondary">{certificate.certificateCode}</Typography>
                    </TableCell>
                    <TableCell>{certificate.courseTitle}</TableCell>
                    <TableCell>{certificate.score}%</TableCell>
                    <TableCell>{certificate.issuedAt}</TableCell>
                    <TableCell>
                      <Chip label={certificate.status} size="small" color={certificate.status === 'verified' ? 'success' : certificate.status === 'pending' ? 'warning' : 'default'} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', rowGap: 1 }}>
                        <Button size="small" variant="outlined" onClick={() => openEditor(certificate)}>Edit</Button>
                        <Button size="small" color="success" variant="contained" onClick={() => markVerified(certificate.id)}>Verify</Button>
                        <Button size="small" color="warning" variant="outlined" onClick={() => setCertificates((prev) => prev.map((item) => (item.id === certificate.id ? { ...item, status: 'pending' } : item)))}>Pending</Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => markRejected(certificate.id)}>Reject</Button>
                        <Button size="small" color="error" onClick={() => deleteCertificate(certificate.id)}>Delete</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      <Dialog open={open} onClose={closeEditor} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Edit certificate' : 'Add certificate'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, background: '#f8fbff' }}>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>How verification works</Typography>
              <Typography variant="body2" color="text.secondary">
                A verified certificate means the student record, course title, and score have been checked and approved. Pending keeps it in review, and rejected marks the record as invalid.
              </Typography>
            </Paper>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Student name" value={form.studentName} onChange={(event) => setForm((prev) => ({ ...prev, studentName: event.target.value }))} fullWidth />
              <TextField label="Course title" value={form.courseTitle} onChange={(event) => setForm((prev) => ({ ...prev, courseTitle: event.target.value }))} fullWidth />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Score" type="number" value={form.score} onChange={(event) => setForm((prev) => ({ ...prev, score: Number(event.target.value) }))} fullWidth />
              <TextField label="Issued at" type="date" value={form.issuedAt} onChange={(event) => setForm((prev) => ({ ...prev, issuedAt: event.target.value }))} fullWidth InputLabelProps={{ shrink: true }} />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as CertificateStatus }))}>
                  <MenuItem value="pending">pending</MenuItem>
                  <MenuItem value="verified">verified</MenuItem>
                  <MenuItem value="rejected">rejected</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Certificate code" value={form.certificateCode} onChange={(event) => setForm((prev) => ({ ...prev, certificateCode: event.target.value }))} fullWidth />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button onClick={saveCertificate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

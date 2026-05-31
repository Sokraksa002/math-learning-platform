import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AdminShell from './AdminShell';
import { useLocale } from '../../hooks/useLocale';
import {
  getAdminCertificates,
  revokeAdminCertificate,
  type AdminCertificateRecord,
} from '../../utils/api';

export default function VerifyCertificates() {
  const { t } = useLocale();
  const [certificates, setCertificates] = useState<AdminCertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const rows = await getAdminCertificates();
      setCertificates(rows);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCertificates();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Certificates', value: certificates.length },
      { label: 'Verified', value: certificates.filter((certificate) => certificate.status === 'verified').length },
      { label: 'Revoked', value: certificates.filter((certificate) => certificate.status === 'revoked').length },
    ],
    [certificates],
  );

  const handleRevoke = async (certificateId: string) => {
    try {
      setSavingId(certificateId);
      const revoked = await revokeAdminCertificate(certificateId);
      setCertificates((current) =>
        current.map((certificate) => (certificate.id === revoked.id ? revoked : certificate)),
      );
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : 'Failed to revoke certificate');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell
      title={t('pages.AdminVerifyCertificates.title', 'Verify Certificates')}
      subtitle={t(
        'pages.AdminVerifyCertificates.subtitle',
        'Review issued certificates from the backend and revoke the ones that are no longer valid.',
      )}
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
          <Stack spacing={1.5}>
            <Typography variant="h5" fontWeight={900}>
              Certificate review queue
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
              This view now comes from the backend. Certificates are shown with the student,
              course, score, and issue date, and admins can revoke any active certificate.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Chip label="Backend list" color="primary" variant="outlined" />
              <Chip label="Verified = active" color="success" variant="outlined" />
              <Chip label="Revoked = invalid" color="error" variant="outlined" />
            </Stack>
          </Stack>
        </Paper>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {stats.map((stat) => (
            <Paper key={stat.label} sx={{ p: 2.5, borderRadius: 3, flex: 1, border: '1px solid #e5e7eb' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={700}>
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Certificate queue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Certificates are read from Prisma and updated through admin endpoints.
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => void loadCertificates()} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
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
                {certificates.map((certificate) => {
                  const revoked = certificate.status === 'revoked';

                  return (
                    <TableRow key={certificate.id} hover>
                      <TableCell>
                        <Typography fontWeight={700}>{certificate.user?.name ?? 'Unknown student'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {certificate.user?.email ?? certificate.userId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {certificate.certificateCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{certificate.course}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {certificate.totalLessons} lessons
                        </Typography>
                      </TableCell>
                      <TableCell>{certificate.averageScore}%</TableCell>
                      <TableCell>{new Date(certificate.issuedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={revoked ? 'revoked' : 'verified'}
                          size="small"
                          color={revoked ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', rowGap: 1 }}>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={revoked || savingId === certificate.id}
                            onClick={() => void handleRevoke(certificate.id)}
                          >
                            {savingId === certificate.id ? 'Revoking...' : 'Revoke'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!loading && certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No certificates found yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </AdminShell>
  );
}

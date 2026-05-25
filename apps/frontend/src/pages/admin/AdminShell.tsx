import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const navItems = [
  { label: 'Overview', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Quizzes', path: '/admin/quizzes' },
  { label: 'Lessons', path: '/admin/lessons' },
  { label: 'Certificates', path: '/admin/certificates' },
];

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #eff6ff 0%, #f8fbff 42%, #ffffff 100%)', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 4,
            color: 'white',
            background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #2563eb 100%)',
            boxShadow: '0 18px 40px rgba(37, 99, 235, 0.22)',
            mb: 3,
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
            Admin console
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>
            {title}
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 840 }}>
            {subtitle}
          </Typography>
        </Paper>

        <Paper sx={{ p: 1.25, borderRadius: 3, mb: 3, overflowX: 'auto' }}>
          <Stack direction="row" spacing={1} sx={{ minWidth: 'max-content' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'contained' : 'text'}
                  onClick={() => navigate(item.path)}
                  sx={{ borderRadius: 999, px: 2.25, fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Paper>

        {children}
      </Container>
    </Box>
  );
}

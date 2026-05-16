import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useLocale } from '../../hooks/useLocale';

export default function PasswordSecurity() {
  const { t } = useLocale();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 12px 30px rgba(37, 99, 235, 0.08)', border: '1px solid #dbeafe' }}>
          <CardContent>
            <Typography fontWeight={800} mb={3} color="#1d4ed8">
              Password & Security
            </Typography>

            <TextField
              fullWidth
              label={t('components.Profile.PasswordSecurity.current_password', 'Current Password')}
              type="password"
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('components.Profile.PasswordSecurity.new_password', 'New Password')}
              type="password"
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('components.Profile.PasswordSecurity.confirm_new_password', 'Confirm New Password')}
              type="password"
              margin="normal"
            />

            <Button
              fullWidth
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

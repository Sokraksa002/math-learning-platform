import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import Header from '../Home/Header';
import { useLocale } from '../../hooks/useLocale';

export default function PasswordSecurity() {
  const { t } = useLocale();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography fontWeight={800} mb={3}>
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
                backgroundColor: '#2196F3',
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

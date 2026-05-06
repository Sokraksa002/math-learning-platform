import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import Header from '../../components/Home/Header';
import { useLocale } from '../../hooks/useLocale';

export default function Security() {
  const { t } = useLocale();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent>
            <Typography sx={{ fontWeight: 800, mb: 3 }}>
              Password & Security
            </Typography>

            <TextField
              fullWidth
              type="password"
              label={t('components.Profile.Security.current_password', 'Current Password')}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="password"
              label={t('components.Profile.Security.new_password', 'New Password')}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="password"
              label={t('components.Profile.Security.confirm_new_password', 'Confirm New Password')}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
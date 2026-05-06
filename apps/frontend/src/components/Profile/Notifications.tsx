import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import Header from '../../components/Home/Header';
import { useLocale } from '../../hooks/useLocale';

export default function Notifications() {
  const { t } = useLocale();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent>
            <Typography sx={{ fontWeight: 800, mb: 3 }}>
              Notifications
            </Typography>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label={t('components.Profile.Notifications.quiz_reminders', 'Quiz reminders')}
            />

            <FormControlLabel
              control={<Switch />}
              label={t('components.Profile.Notifications.new_lessons_available', 'New lessons available')}
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label={t('components.Profile.Notifications.certificate_notifications', 'Certificate notifications')}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

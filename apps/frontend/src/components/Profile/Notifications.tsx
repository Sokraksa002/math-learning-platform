import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useLocale } from '../../hooks/useLocale';

export default function Notifications() {
  const { t } = useLocale();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 12px 30px rgba(37, 99, 235, 0.08)', border: '1px solid #dbeafe' }}>
          <CardContent>
            <Typography sx={{ fontWeight: 800, mb: 3, color: '#1d4ed8' }}>
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

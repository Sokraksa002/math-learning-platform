import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  School,
  Quiz,
  Style,
  Psychology,
  WorkspacePremium,
  Logout,
  Notifications,
  Lock,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { useLocale } from '../hooks/useLocale';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const user = getUser();

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <CardContent>

            {/* USER INFO */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                {user.name?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{user.name}</Typography>
                <Typography fontSize={13} color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>

            {/* ACCOUNT */}
            <Typography fontSize={13} color="text.secondary" mb={1}>
              Account
            </Typography>
            <List disablePadding>
              <ListItemButton onClick={() => navigate('/chapter')}>
                <ListItemIcon><School /></ListItemIcon>
                <ListItemText primary="Lesson" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/quiz-history')}>
                <ListItemIcon><Quiz /></ListItemIcon>
                <ListItemText primary="My quiz attempts" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/flashcard-history')}>
                <ListItemIcon><Style /></ListItemIcon>
                <ListItemText primary="Flashcard history" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/ability')}>
                <ListItemIcon><Psychology /></ListItemIcon>
                <ListItemText primary="My Ability" />
              </ListItemButton>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* SETTINGS */}
            <Typography fontSize={13} color="text.secondary" mb={1}>
              Settings
            </Typography>
            <List disablePadding>
              <ListItemButton onClick={() => navigate('/profile/manage')}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Manage Profile" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/profile/security')}>
                <ListItemIcon><Lock /></ListItemIcon>
                <ListItemText primary="Password & Security" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/profile/notifications')}>
                <ListItemIcon><Notifications /></ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* CERTIFICATES */}
            <Typography fontSize={13} color="text.secondary" mb={1}>
              Certificates
            </Typography>
            <List disablePadding>
              <ListItemButton onClick={() => navigate('/certificate/1')}>
                <ListItemIcon><WorkspacePremium /></ListItemIcon>
                <ListItemText primary="Chapter 1 Certificate" />
                <Chip label={t('pages.Profile.view', 'View')} size="small" color="primary" />
              </ListItemButton>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* LOGOUT ✅ */}
            <List disablePadding>
              <ListItemButton
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                  window.location.reload();
                }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText
                  primary="Log out"
                  primaryTypographyProps={{ color: 'error' }}
                />
              </ListItemButton>
            </List>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
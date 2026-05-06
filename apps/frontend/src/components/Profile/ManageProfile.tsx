import {
  Box,
  Card,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocale';
import { getUser } from '../../utils/auth';
import Header from '../Home/Header';

type User = {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
};

export default function ManageProfile() {
  const { t } = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Load user from localStorage
  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser({ name: u.name || '', email: u.email || '', phone: '' });
      setAvatarPreview('');
    }
  }, []);

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save profile
  const handleSave = () => {
    if (!user) return;

    // Save to local storage
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, avatar: avatarPreview })
    );

    alert('Profile updated successfully');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography fontWeight={800} mb={3}>
              Manage Profile
            </Typography>

            {/* Avatar Section */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  mb: 1,
                  backgroundColor: '#2196F3',
                }}
                src={avatarPreview}
              >
                {user.name[0]}
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                id="avatar-input"
              />
              <label htmlFor="avatar-input">
                <Button component="span" variant="text" size="small">
                  Upload Avatar
                </Button>
              </label>
            </Box>

            {/* Form Fields */}
            <TextField
              fullWidth
              label={t('components.Profile.ManageProfile.name', 'Name')}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label={t('components.Profile.ManageProfile.email', 'Email')}
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label={t('components.Profile.ManageProfile.phone', 'Phone')}
              value={user.phone || ''}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              sx={{
                mt: 3,
                backgroundColor: '#2196F3',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

import {
  AppBar,
  Box,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  AccountCircle,
  School,
  Quiz,
  Style,
  Psychology,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import logo from "../../assets/Logo.png";
import { useState } from 'react';
import { useLocale } from '../../hooks/useLocale';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();

  // ✅ Profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // ✅ Active + hover nav style
  const navBtn = (path: string) => ({
    color: '#333',
    fontWeight: 500,
    textTransform: 'none',
    fontSize: 14,
    borderRadius: '12px',
    px: 2,
    backgroundColor: location.pathname.startsWith(path)
      ? '#E3F2FD'
      : 'transparent',
    '&:hover': {
      backgroundColor: '#E3F2FD',
    },
  });

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      
<Toolbar
  sx={{
    justifyContent: 'space-between',
    px: { xs: 2, sm: 4 },
    minHeight: 88,     // ✅ KEY LINE (default is 56)
    alignItems: 'center',
  }}
>

        {/* Logo */}
        <Box
          component={Link}
          to="/home"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img src={logo} alt="Kanit logo" style={{ height: 76, display: 'block' }} />
        </Box>

        {/* Main menu */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button onClick={() => navigate('/home')} sx={navBtn('/home')}>
            Home
          </Button>
          <Button onClick={() => navigate('/chapter')} sx={navBtn('/chapter')}>
            Chapter
          </Button>
          <Button onClick={() => navigate('/quiz')} sx={navBtn('/quiz')}>
            Quiz
          </Button>
          <Button
            onClick={() => navigate('/flashcard')}
            sx={navBtn('/flashcard')}
          >
            Flashcard
          </Button>
          <Button sx={navBtn('/about')}>{t('components.Home.HeaderBeforeLogin.about_us', 'About us')}</Button>
        </Box>

        {/* ✅ Account icon */}
        <IconButton onClick={handleProfileOpen} sx={{ color: '#333' }}>
          <AccountCircle sx={{ fontSize: 28 }} />
        </IconButton>

        {/* ✅ Profile dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              minWidth: 220,
              mt: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              navigate('/profile');
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            My profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate('/chapter');
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <School fontSize="small" />
            </ListItemIcon>
            Lesson
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate('/quiz-history');
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <Quiz fontSize="small" />
            </ListItemIcon>
            My quiz attempts
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate('/flashcard-history');
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <Style fontSize="small" />
            </ListItemIcon>
            Flashcard history
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate('/ability');
              handleProfileClose();
            }}
          >
            <ListItemIcon>
              <Psychology fontSize="small" />
            </ListItemIcon>
            My Ability
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

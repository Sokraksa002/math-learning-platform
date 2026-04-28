import { AppBar, Box, Button, Toolbar, Typography, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          {/* Logo → Home */}
          <Typography
            component={Link}
            to="/home"
            sx={{
              fontWeight: 'bold',
              color: '#2196F3',
              fontSize: '24px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Kanit
          </Typography>

          {/* Menu */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/chapter')}
              sx={navBtn}
            >
              Chapter
            </Button>

            <Button
              onClick={() => navigate('/quiz')}
              sx={navBtn}
            >
              Quiz
            </Button>

            <Button
              onClick={() => navigate('/flashcard')}
              sx={navBtn}
            >
              Flashcard
            </Button>

            <Button sx={navBtn}>
              About us
            </Button>
          </Box>

          {/* Account Icon */}
          <IconButton sx={{ color: '#333' }}>
            <AccountCircle sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Optional banner (correct JSX comment) */}
      {/*
      <Box
        sx={{
          backgroundColor: '#2196F3',
          padding: '12px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 500,
          color: '#fff',
        }}
      >
        Let&apos;s study with us!
      </Box>
      */}
    </>
  );
}

const navBtn = {
  color: '#333',
  fontWeight: 500,
  textTransform: 'none',
  fontSize: 14,
};

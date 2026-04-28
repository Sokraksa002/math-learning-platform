import { AppBar, Box, Button, Toolbar, Typography, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
          {/* Logo */}
          <Typography
            variant="h6"
            onClick={() => navigate('/home')}
            sx={{
              fontWeight: 'bold',
              color: '#2196F3',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            Kanit
          </Typography>

          {/* Menu */}
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/home')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: 14 }}
            >
              Home
            </Button>

            <Button
              onClick={() => navigate('/chapter')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: 14 }}
            >
              Chapter
            </Button>

            <Button
              onClick={() => navigate('/quiz')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: 14 }}
            >
              Quiz
            </Button>

            <Button
              onClick={() => navigate('/flashcard')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: 14 }}
            >
              Flashcard
            </Button>

            <Button
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: 14 }}
            >
              About us
            </Button>
          </Box>

          {/* Account Icon */}
          <IconButton sx={{ color: '#333' }}>
            <AccountCircle sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Banner */}
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
    </>
  );
}
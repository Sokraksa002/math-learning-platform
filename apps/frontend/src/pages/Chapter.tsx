import { Box, Button, Container, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Lesson from '../components/Chapter/Lesson';

export default function Chapter() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3', fontSize: '24px' }}>
            Kanit
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/chapter')} sx={{ color: '#333', fontWeight: 500, textTransform: 'none' }}>
              Chapter
            </Button>
            <Button color="inherit" onClick={() => navigate('/quiz')} sx={{ color: '#333', fontWeight: 500, textTransform: 'none' }}>
              Quiz
            </Button>
            <Button color="inherit" onClick={() => navigate('/flashcard')} sx={{ color: '#333', fontWeight: 500, textTransform: 'none' }}>
              Flashcard
            </Button>
            <Button color="inherit" sx={{ color: '#333', fontWeight: 500, textTransform: 'none' }}>
              About us
            </Button>
          </Box>
          <IconButton color="inherit" sx={{ color: '#333' }}>
            <AccountCircle sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Box sx={{ backgroundColor: '#2196F3', padding: '12px', textAlign: 'center', fontSize: '16px', fontWeight: 500, color: '#fff' }}>
        Let's study with us !
      </Box>

      <Box sx={{ backgroundColor: '#fff', flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: 0 }}>
          <Lesson />
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#3D86E8', color: '#fff', py: 2, px: { xs: 2, md: 4 }, mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.8rem' } }}>KANIT</Typography>
          <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' }, textAlign: 'center', flex: 1 }}>
            Copyright © 2024 Osman IT | Design & Developed by Arif Hasan
          </Typography>
          <Box sx={{ width: 56 }} />
        </Box>
      </Box>
    </Box>
  );
}

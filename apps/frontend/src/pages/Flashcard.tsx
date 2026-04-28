import { Box, Button, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FlashcardBoard from '../components/Flashcard/FlashcardBoard';

export default function Flashcard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
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

      <Box sx={{ backgroundColor: '#2196F3', padding: '12px', textAlign: 'center', fontSize: '16px', fontWeight: 500, color: '#fff' }}>
        Let's study with us !
      </Box>

      <Box sx={{ py: 4, px: { xs: 2, md: 4 }, flex: 1, backgroundColor: '#fff' }}>
        <FlashcardBoard />
      </Box>
    </Box>
  );
}

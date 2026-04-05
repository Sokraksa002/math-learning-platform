import { Box, Button, Card, CardContent, Grid, Container, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const quizChapters = [
  { id: 1, name: 'Chapter1', lesson: 'Lesson: Limit', color: '#B3E5FC' },
  { id: 2, name: 'Chapter2', lesson: 'Lesson: Limit', color: '#C8E6C9' },
  { id: 3, name: 'Chapter3', lesson: 'Lesson: Limit', color: '#FFF9C4' },
  { id: 4, name: 'Chapter3', lesson: 'Lesson: Limit', color: '#E1BEE7' },
];

export default function Quiz() {
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

      {/* Quiz Time Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: '#333' }}>
          Quiz Time
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {quizChapters.map((chapter) => (
            <Grid item xs={12} sm={6} md={3} key={chapter.id}>
              <Card sx={{ backgroundColor: chapter.color, borderRadius: '12px', boxShadow: 'none', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#333', mb: 1, fontSize: '14px' }}>{chapter.name}</Typography>
                  <Typography sx={{ fontSize: '13px', color: '#666' }}>{chapter.lesson}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" sx={{ backgroundColor: '#2196F3', textTransform: 'none', borderRadius: '24px', px: 4, py: 1 }}>
            Select more
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

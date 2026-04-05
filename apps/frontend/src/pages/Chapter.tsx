import { Box, Button, Card, CardContent, Grid, Container, Typography, AppBar, Toolbar, IconButton, Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const lessonsData = [
  { id: 1, name: 'Lesson 1', description: 'Introduction to Limits' },
  { id: 2, name: 'Lesson 2', description: 'Limit Laws & Properties' },
  { id: 3, name: 'Lesson 3', description: 'Computing Limits' },
];

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

      {/* Chapter Section */}
      <Box sx={{ backgroundColor: '#E3F2FD', py: 6, color: '#333' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: '32px' }}>🤔</span>
            Choose Chapter or Lesson
          </Typography>
          <Typography sx={{ mb: 4, fontSize: '14px', color: '#666' }}>
            Let's choose chapter or Lesson that u want to study 🤔
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {lessonsData.map((lesson) => (
              <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                <Card sx={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' } }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#333', mb: 1, fontSize: '16px' }}>{lesson.name}</Typography>
                    <Typography sx={{ fontSize: '13px', color: '#666', mb: 3 }}>{lesson.description}</Typography>
                    <Link sx={{ color: '#2196F3', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      View detail →
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" sx={{ backgroundColor: '#fff', color: '#2196F3', border: '2px solid #2196F3', textTransform: 'none', borderRadius: '24px', px: 4, fontWeight: '600', '&:hover': { backgroundColor: '#E3F2FD' } }}>
              Select more
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

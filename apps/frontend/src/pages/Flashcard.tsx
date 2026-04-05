import { Box, Button, Card, CardContent, Grid, Container, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Flashcard() {
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

      {/* Flashcard Section */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 8, textAlign: 'center', color: '#333', fontSize: '32px' }}>
          Flashcard Q&A
        </Typography>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: '18px', color: '#333', fontWeight: '500', lineHeight: 1.6 }}>
              Let us solve your problem Okay ?
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#FFF9C4', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
              <CardContent sx={{ textAlign: 'center', py: 7 }}>
                <Typography sx={{ fontWeight: 'bold', color: '#333', mb: 2, fontSize: '20px' }}>
                  Card Generate
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#FFB300', fontWeight: '600' }}>
                  Click here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

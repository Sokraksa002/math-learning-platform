import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { AccountCircle, MenuBook, Lock, AutoStories } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import FeatureCard from '../components/FeatureCard';
import Calender from '../components/Calender';

export default function Home() {
  const navigate = useNavigate();
  const features = [
    {
      title: 'Chapter',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: MenuBook,
      bgColor: '#C8E6C9',
      iconBg: '#81C784',
    },
    {
      title: 'Quiz',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: Lock,
      bgColor: '#B3E5FC',
      iconBg: '#4FC3F7',
    },
    {
      title: 'Flashcard Q&A',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: AutoStories,
      bgColor: '#FFF9C4',
      iconBg: '#FFD54F',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      {/* Header/Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#2196F3',
              fontSize: '24px',
            }}
          >
            Kanit
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, alignItems: 'center' }}>
            <Button
              color="inherit"
              onClick={() => navigate('/chapter')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: '14px', cursor: 'pointer' }}
            >
              Chapter
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/quiz')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: '14px', cursor: 'pointer' }}
            >
              Quiz
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/flashcard')}
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: '14px', cursor: 'pointer' }}
            >
              Flashcard
            </Button>
            <Button
              color="inherit"
              sx={{ color: '#333', fontWeight: 500, textTransform: 'none', fontSize: '14px' }}
            >
              About us
            </Button>
          </Box>

          <IconButton color="inherit" sx={{ color: '#333' }}>
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
        Let's study with us !
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: '#2196F3',
                fontSize: { xs: '36px', md: '48px' },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Welcome to Kanit
            </Typography>

            <Box
              component="img"
              src={heroImg}
              alt="Student Illustration"
              sx={{
                maxWidth: '200px',
                height: 'auto',
                mt: 2,
              }}
            />
          </Grid>

          {/* Right Content - Illustration */}
          <Grid xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box
              component="img"
              src={heroImg}
              alt="Learning Illustration"
              sx={{
                maxWidth: '300px',
                height: 'auto',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Our Functions Section */}
      <Box sx={{ backgroundColor: '#fafafa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              mb: 5,
              fontSize: '28px',
            }}
          >
            Our Functions
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ flex: 1, minWidth: 0 }}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  bgColor={feature.bgColor}
                  iconBg={feature.iconBg}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Calendar Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Calender />
        </Container>
      </Box>
    </Box>
  );
}
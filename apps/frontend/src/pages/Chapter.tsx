import { Box, Container, Typography } from '@mui/material';
import Header from '../components/Home/Header';
import Lesson from '../components/Chapter/Lesson';
import Footer from '../components/Home/Footer';

export default function Chapter() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <Header />

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
        Let&apos;s study with us !
      </Box>

      {/* Content */}
      <Box sx={{ backgroundColor: '#fff', flex: 1 }}>
        <Container maxWidth="lg" sx={{ px: 0 }}>
          <Lesson />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#3D86E8',
          color: '#fff',
          py: 2,
          px: { xs: 2, md: 4 },
          mt: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.8rem' } }}>
            KANIT
          </Typography>

          <Typography
            sx={{ fontSize: { xs: '0.7rem', md: '0.9rem' }, textAlign: 'center', flex: 1 }}
          >
            Copyright © 2024 Osman IT | Design &amp; Developed by Arif Hasan
          </Typography>

          <Box sx={{ width: 56 }} />
        </Box>
      </Box>
      <Footer/>
    </Box>
  );
}

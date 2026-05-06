import { Box } from '@mui/material';
import Header from '../components/Home/Header';
import FlashcardBoard from '../components/Flashcard/FlashcardBoard';
import Footer from '../components/Home/Footer';

export default function Flashcard() {
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

      <Box
        sx={{
          py: 4,
          px: { xs: 2, md: 4 },
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <FlashcardBoard />
      </Box>
      <Footer/>
    </Box>
  );
}
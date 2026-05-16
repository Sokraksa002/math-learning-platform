import { Box } from '@mui/material';
import FlashcardBoard from '../components/Flashcard/FlashcardBoard';

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
    </Box>
  );
}
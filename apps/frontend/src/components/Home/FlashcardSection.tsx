import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


export default function FlashcardSection() {
  return (
    <Box sx={{ backgroundColor: '#FFF9C4', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 4,
            fontSize: '28px',
          }}
        >
          Flashcard Q&A
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography sx={{ color: '#666', fontSize: '16px' }}>
            Let us show you the best approach to ace the test!
          </Typography>

          
<Button
  component={RouterLink}
  to="/flashcard"
  variant="contained"
  sx={{
    backgroundColor: '#FFD54F',
    color: '#000',
    fontWeight: 'bold',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: '#FFC107',
    },
  }}

          >
            Card Generate
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

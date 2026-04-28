import { Box, Container, Typography } from '@mui/material';
import Calender from './Calender';

export default function MoodSection() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            mb: 4,
            fontSize: '20px',
          }}
        >
          What about your mood for today?
        </Typography>
        <Calender />
      </Container>
    </Box>
  );
}

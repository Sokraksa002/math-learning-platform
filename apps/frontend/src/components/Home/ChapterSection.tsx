import { Box, Container, TextField, Typography } from '@mui/material';

interface Chapter {
  id: number;
  name: string;
  placeholder: string;
}

export default function ChapterSection() {
  const chapters: Chapter[] = [
    { id: 1, name: 'Chapter 1', placeholder: 'Enter chapter 1 content' },
    { id: 2, name: 'Chapter 2', placeholder: 'Enter chapter 2 content' },
    { id: 3, name: 'Chapter 3', placeholder: 'Enter chapter 3 content' },
  ];

  return (
    <Box sx={{ backgroundColor: '#2196F3', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            mb: 4,
            fontSize: '28px',
          }}
        >
          Chapter
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px' }}>
          {chapters.map((chapter) => (
            <TextField
              key={chapter.id}
              fullWidth
              label={chapter.name}
              placeholder={chapter.placeholder}
              variant="outlined"
              sx={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  color: '#333',
                },
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

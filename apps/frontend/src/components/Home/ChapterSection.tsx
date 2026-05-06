import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';

interface Chapter {
  id: number;
  name: string;
  accent: string;
}

const chapters: Chapter[] = [
  { id: 1, name: 'Chapter 1', accent: '#C8E6C9' }, // mint
  { id: 2, name: 'Chapter 2', accent: '#BBDEFB' }, // baby blue
  { id: 3, name: 'Chapter 3', accent: '#FFE0B2' }, // peach
];

const ChapterSection: React.FC = () => {
  const { t } = useLocale();
  const navigate = useNavigate(); // FIX: hook at top level

  return (
    <Box
      sx={{
        backgroundColor: '#2196F3',
        py: 6,
        mb: 5,
      }}
    >
      <Container maxWidth="md">
        <Typography
          sx={{
            fontWeight: 800,
            color: '#fff',
            mb: 4,
            fontSize: 28,
            letterSpacing: 0.5,
          }}
        >
          {t('components.Home.ChapterSection.chapters', 'Chapter')}
        </Typography>

        {/* Pastel Hamburger list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {chapters.map((chapter) => (
            <Box
              key={chapter.id}
              onClick={() => navigate(`/chapter/${chapter.id}`)}
              sx={{
                backgroundColor: chapter.accent, // ✅ pastel color
                borderRadius: '16px',
                px: 4,
                py: 3,
                cursor: 'pointer',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',

                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.25s ease',

                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.18)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#374151',
                }}
              >
                {chapter.name}
              </Typography>

              {/* Arrow */}
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  color: '#6B7280',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              >
                →
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ChapterSection;
import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 🎨 Pastel palette (UI only)
const PASTEL_PALETTE = [
  '#C8E6C9',
  '#BBDEFB',
  '#FFE0B2',
  '#E1BEE7',
  '#FFF9C4',
  '#B2DFDB',
];

interface Chapter {
  id: number;
  title: string;
  lessons: {
    id: number;
    name: string;
  }[];
}

const chapters: Chapter[] = [
  {
    id: 1,
    title: 'Chapter 1',
    lessons: [
      { id: 101, name: 'Introduction' },
      { id: 102, name: 'Basic Concept' },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2',
    lessons: [
      { id: 201, name: 'Overview' },
      { id: 202, name: 'Examples' },
    ],
  },
];

export default function ChapterLessonList() {
  const navigate = useNavigate();
  const [openChapterId, setOpenChapterId] = useState<number | null>(null);

  const toggleChapter = (id: number) => {
    setOpenChapterId(prev => (prev === id ? null : id));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {chapters.map((chapter, index) => {
          const isOpen = openChapterId === chapter.id;
          const accent = PASTEL_PALETTE[index % PASTEL_PALETTE.length];

          return (
            <Box key={chapter.id}>
              {/* ✅ Chapter Card */}
              <Box
                onClick={() => toggleChapter(chapter.id)}
                sx={{
                  backgroundColor: '#fff',
                  borderLeft: `6px solid ${accent}`, // 🎨 palette applied
                  borderRadius: 3,
                  px: 3,
                  py: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transition: 'all 0.25s ease',
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  {chapter.title}
                </Typography>

                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: accent,
                    color: '#1F2937',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                  }}
                >
                  {isOpen ? '▲' : '▼'}
                </Box>
              </Box>

              {/* ✅ Lessons */}
              {isOpen && (
                <Box
                  sx={{
                    mt: 1.5,
                    ml: 3,
                    pl: 2,
                    borderLeft: `3px solid ${accent}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {chapter.lessons.map((lesson) => (
                    <Box
                      key={lesson.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1.2,
                        backgroundColor: `${accent}66`, // pastel tint
                        borderRadius: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {lesson.name}
                      </Typography>

                      <Button
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        sx={{
                          minWidth: 'auto',
                          p: 0,
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#3D86E8',
                        }}
                      >
                        →
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}

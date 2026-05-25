import { Box, Card, CardContent, Chip, Paper, Stack, Typography } from '@mui/material';
import { useLocale } from '../hooks/useLocale';

interface SkillArea {
  name: string;
  score: number;
  note: string;
  color: string;
}

const skillAreas: SkillArea[] = [
  {
    name: 'Algebra',
    score: 86,
    note: 'Strong with equations and operations.',
    color: '#2563eb',
  },
  {
    name: 'Fractions',
    score: 74,
    note: 'Good base, still improving speed.',
    color: '#0f766e',
  },
  {
    name: 'Geometry',
    score: 91,
    note: 'Very confident with shapes and measures.',
    color: '#7c3aed',
  },
  {
    name: 'Mental math',
    score: 68,
    note: 'Needs more short timed practice.',
    color: '#ea580c',
  },
];

const recentWins = [
  'Solved 9 out of 10 geometry questions correctly.',
  'Kept a 92% mastery rate in recent flashcard sessions.',
  'Improved accuracy on ratio-based questions.',
];

const recommendations = [
  'Review multiplication and division flashcards for 10 minutes daily.',
  'Revisit fraction comparison exercises before taking the next quiz.',
  'Use short timed drills to raise mental math speed.',
];

const topSkill = skillAreas.reduce((best, current) => (current.score > best.score ? current : best));

export default function Ability() {
  useLocale();

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
        }}
      >
        <Box sx={{ maxWidth: '1100px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #60a5fa 100%)',
              color: 'white',
              boxShadow: '0 18px 40px rgba(37, 99, 235, 0.22)',
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.2 }}>
              My Ability
            </Typography>
            <Typography variant="h4" fontWeight={800} mt={1} mb={1}>
              Your learning strengths
            </Typography>
            <Typography sx={{ maxWidth: 720, opacity: 0.9 }}>
              A quick view of where you are strongest, what needs more practice, and which topic is
              currently leading your progress.
            </Typography>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dbeafe', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)' }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                Top skill
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#1d4ed8">
                {topSkill.name}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dbeafe', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)' }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                Best score
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#2563eb">
                {topSkill.score}%
              </Typography>
            </Paper>

            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #dbeafe', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)' }}>
              <Typography color="text.secondary" fontSize="0.9rem">
                Focus area
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#1d4ed8">
                Mental math
              </Typography>
            </Paper>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
              gap: 2,
            }}
          >
            <Card sx={{ borderRadius: 3, boxShadow: '0 12px 28px rgba(37, 99, 235, 0.08)', border: '1px solid #dbeafe' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Skill breakdown
                </Typography>
                <Stack spacing={2}>
                  {skillAreas.map((skill) => (
                    <Box key={skill.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography fontWeight={700}>{skill.name}</Typography>
                        <Typography fontWeight={700}>{skill.score}%</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 12,
                          borderRadius: 999,
                          backgroundColor: '#dbeafe',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${skill.score}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)`,
                          }}
                        />
                      </Box>
                      <Typography color="text.secondary" fontSize="0.9rem" mt={0.75}>
                        {skill.note}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Stack spacing={2}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 12px 28px rgba(37, 99, 235, 0.08)', border: '1px solid #dbeafe' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} mb={1.5}>
                    Recent wins
                  </Typography>
                  <Stack spacing={1}>
                    {recentWins.map((item) => (
                      <Chip key={item} label={item} variant="outlined" sx={{ justifyContent: 'flex-start', py: 1.5, height: 'auto', borderRadius: 2, borderColor: '#bfdbfe', color: '#1d4ed8' }} />
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: '0 12px 28px rgba(37, 99, 235, 0.08)', border: '1px solid #dbeafe' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} mb={1.5}>
                    Next steps
                  </Typography>
                  <Stack spacing={1.25}>
                    {recommendations.map((item) => (
                      <Typography key={item} color="text.secondary" fontSize="0.95rem">
                        • {item}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
